import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { leadSchema, normalizeBYPhone } from '@/lib/validation';
import { notifyTelegram, type Lead } from '@/lib/telegram';

// export const runtime = 'nodejs';

const redis = Redis.fromEnv();
const DEDUPE_TTL_SEC = 600; // 10 минут

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0] ?? 'form');
      errors[k] ??= issue.message;
    }
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }
  const data = parsed.data;

  // honeypot: боты заполняют скрытое поле — отвечаем «успехом», ничего не сохраняя
  if (data.website) return NextResponse.json({ ok: true });

  const phone = normalizeBYPhone(data.phone);
  if (!phone) {
    return NextResponse.json(
      {
        ok: false,
        errors: {
          phone: 'Введите белорусский номер, например +375 29 123-45-67',
        },
      },
      { status: 422 },
    );
  }

  // дедупликация: атомарно занимаем ключ на 10 минут
  const dedupeKey = `lead:dedupe:${phone}`;
  try {
    const fresh = await redis.set(dedupeKey, '1', {
      nx: true,
      ex: DEDUPE_TTL_SEC,
    });
    if (fresh === null) {
      return NextResponse.json({ ok: true, duplicate: true }); // для пользователя — тот же успех
    }
  } catch {
    return NextResponse.json({ ok: false, error: 'storage' }, { status: 503 });
  }

  const lead: Lead = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    name: data.name,
    phone,
    interest: data.interest,
    comment: data.comment ?? '',
    attribution: data.attribution,
  };

  try {
    await redis.lpush('leads', JSON.stringify(lead));
  } catch {
    await redis.del(dedupeKey).catch(() => {}); // не блокируем повторную попытку
    return NextResponse.json({ ok: false, error: 'storage' }, { status: 503 });
  }

  //   // Telegram — дополнительно; сбой не должен ронять заявку
  //   try {
  //     await notifyTelegram(lead);
  //   } catch (e) {
  //     console.error('telegram failed', e);
  //   }

  return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
}
