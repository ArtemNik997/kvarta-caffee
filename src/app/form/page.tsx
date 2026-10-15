"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type SubmissionState = "idle" | "success" | "error";

export default function Home() {
  const [status, setStatus] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("idle");
    setMessage("");
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          phone: formData.get("phone"),
        }),
      });
      const result: { error?: string } = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Не удалось отправить заявку. Попробуйте ещё раз.");
      }

      form.reset();
      setStatus("success");
      setMessage("Спасибо! Мы скоро свяжемся с вами.");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Не удалось отправить заявку. Попробуйте ещё раз.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f4ef] px-5 py-12 text-[#29291f] sm:px-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_80px_rgba(49,46,36,0.12)] md:min-h-[600px] md:grid-cols-[1fr_1fr]">
        <section className="relative flex min-h-[280px] flex-col justify-between overflow-hidden bg-[#283b32] p-8 text-[#f5f0e4] sm:p-12 md:min-h-full">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10"
          />
          <div
            aria-hidden="true"
            className="absolute -right-10 -top-14 h-52 w-52 rounded-full border border-white/10"
          />
          <p className="relative text-xs font-semibold uppercase tracking-[0.28em] text-[#d5bd8b]">
            Кофейня · Минск
          </p>

          <div className="relative mt-14 md:mt-0">
            <p className="mb-4 text-sm text-[#d5bd8b]">Хороший повод порадовать себя</p>
            <h1 className="max-w-sm font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
              Ваш заказ начинается здесь
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/70">
              Оставьте контакты — мы уточним детали и поможем оформить заказ.
            </p>
          </div>

          <p className="relative mt-10 text-xs tracking-wide text-white/50 md:mt-0">
            Свежий кофе. Тёплые встречи.
          </p>
        </section>

        <section className="flex flex-col justify-center p-8 sm:p-12">
          <div className="mb-9">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#78816e]">
              Заявка на заказ
            </p>
            <h2 className="font-serif text-3xl tracking-tight">Как с вами связаться?</h2>
            <p className="mt-3 text-sm leading-6 text-[#77776f]">
              Заполните форму, и мы перезвоним вам в ближайшее время.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium" htmlFor="name">
                Ваше имя
              </label>
              <input
                autoComplete="name"
                className="h-13 w-full rounded-xl border border-[#e6e4dc] bg-[#fbfaf7] px-4 text-base outline-none transition placeholder:text-[#aaa99f] focus:border-[#78816e] focus:ring-2 focus:ring-[#78816e]/15"
                id="name"
                maxLength={100}
                name="name"
                placeholder="Например, Анна"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium" htmlFor="phone">
                Номер телефона
              </label>
              <input
                autoComplete="tel"
                className="h-13 w-full rounded-xl border border-[#e6e4dc] bg-[#fbfaf7] px-4 text-base outline-none transition placeholder:text-[#aaa99f] focus:border-[#78816e] focus:ring-2 focus:ring-[#78816e]/15"
                id="phone"
                maxLength={32}
                name="phone"
                placeholder="+375 (29) 123-45-67"
                required
                type="tel"
              />
              <p className="mt-2 text-xs text-[#8a8980]">
                Белорусский номер, например +375 (29) 123-45-67
              </p>
            </div>

            <button
              className="flex h-13 w-full items-center justify-center rounded-xl bg-[#283b32] px-5 font-medium text-white transition hover:bg-[#354d40] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#283b32] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Отправляем…" : "Оставить заявку"}
            </button>

            <p
              aria-live="polite"
              className={`min-h-5 text-center text-sm ${
                status === "success"
                  ? "text-[#3b7651]"
                  : status === "error"
                    ? "text-red-700"
                    : "text-transparent"
              }`}
              role={status === "error" ? "alert" : "status"}
            >
              {message || "\u00a0"}
            </p>
          </form>

          <p className="mt-5 text-center text-xs leading-5 text-[#96958c]">
            Нажимая кнопку, вы соглашаетесь на связь по указанному номеру.
          </p>
        </section>
      </div>
    </main>
  );
}
