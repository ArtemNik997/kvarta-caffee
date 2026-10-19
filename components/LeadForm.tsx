'use client';
import { useRef, useState } from 'react';
import { normalizeBYPhone } from '@/lib/validation';
import { getAttribution } from '@/lib/attribution';

type Status = 'idle' | 'submitting' | 'success' | 'error';
type Errors = Partial<Record<'name' | 'phone' | 'interest', string>>;

export default function LeadForm({
  phone: contactPhone,
  tg,
}: {
  phone: string;
  tg: string;
}) {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const lock = useRef(false); // защита от двойного клика (state обновляется асинхронно)

  async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (lock.current) return;

    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get('name') ?? '').trim();
    const phone = String(fd.get('phone') ?? '');

    const next: Errors = {};
    if (name.length < 2) next.name = 'Как к вам обращаться?';
    if (!normalizeBYPhone(phone))
      next.phone = 'Введите белорусский номер, например +375 29 123-45-67';
    setErrors(next);
    if (Object.keys(next).length) return;

    lock.current = true;
    setStatus('submitting');
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10_000);

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          interest: fd.get('interest'),
          comment: fd.get('comment'),
          website: fd.get('website'),
          attribution: getAttribution(),
        }),
        signal: ctrl.signal,
      });

      if (res.status === 422) {
        const j = await res.json();
        setErrors(j.errors ?? {});
        setStatus('idle');
        return;
      }
      if (!res.ok) throw new Error(String(res.status));

      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    } finally {
      clearTimeout(timer);
      lock.current = false;
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="label-card p-5">
        <p className="font-display text-2xl font-bold">Заявка принята</p>
        <p className="mt-2">Перезвоним в рабочее время.</p>
      </div>
    );
  }

  const busy = status === 'submitting';
  const input =
    'mt-1 w-full rounded border border-roast/50 bg-white/70 px-3 py-3 text-base';

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      {/* honeypot */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute left-[-9999px]"
      />

      <label>
        Имя
        <input
          name="name"
          autoComplete="given-name"
          className={input}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'e-name' : undefined}
        />
        {errors.name && (
          <span id="e-name" className="text-sm text-ember">
            {errors.name}
          </span>
        )}
      </label>

      <label>
        Телефон
        <input
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+375 29 123-45-67"
          className={input}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'e-phone' : undefined}
        />
        {errors.phone && (
          <span id="e-phone" className="text-sm text-ember">
            {errors.phone}
          </span>
        )}
      </label>

      <fieldset>
        <legend>Что интересует</legend>
        <div className="mt-2 flex flex-wrap gap-4">
          <label>
            <input
              type="radio"
              name="interest"
              value="subscription"
              defaultChecked
            />{' '}
            Подписка
          </label>
          <label>
            <input type="radio" name="interest" value="one-time" /> Разовый
            заказ
          </label>
          <label>
            <input type="radio" name="interest" value="question" /> Вопрос
          </label>
        </div>
      </fieldset>

      <label>
        Комментарий
        <textarea name="comment" rows={3} maxLength={500} className={input} />
      </label>

      {status === 'error' && (
        <div role="alert" className="rounded border border-ember p-3 text-sm">
          Не получилось отправить заявку. Проверьте интернет и нажмите ещё раз —
          или позвоните{' '}
          <a className="underline" href={`tel:${contactPhone}`}>
            {contactPhone}
          </a>{' '}
          / напишите в{' '}
          <a className="underline" href={`https://t.me/${tg}`}>
            Telegram
          </a>
          .
        </div>
      )}

      <button
        type="submit"
        disabled={busy}
        className="rounded bg-ember px-5 py-3 font-medium text-white disabled:opacity-60"
      >
        {busy
          ? 'Отправляем…'
          : status === 'error'
            ? 'Повторить отправку'
            : 'Отправить заявку'}
      </button>
    </form>
  );
}
