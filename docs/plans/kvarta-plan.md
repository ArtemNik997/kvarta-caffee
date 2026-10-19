# Кварта — лендинг + форма заявки: план действий и код

**Стек:** Next.js 15 (App Router, TS) · Tailwind v4 · zod · Upstash Redis · Telegram Bot API · Vercel
**Дедлайн:** пн 19.10, 18:00 МСК · **Бюджет:** 4–6 ч

---

## 0. Структура репозитория

```
kvarta/
├─ app/
│  ├─ api/lead/route.ts
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  ├─ AttributionCapture.tsx
│  ├─ FreshnessBadge.tsx
│  ├─ LeadForm.tsx
│  ├─ ProductCard.tsx
│  └─ Reveal.tsx
├─ data/products.ts
├─ lib/
│  ├─ attribution.ts
│  ├─ freshness.ts
│  ├─ telegram.ts
│  └─ validation.ts
├─ public/
│  ├─ img/            # фото (Unsplash/Pexels), ≤1600px
│  └─ og.jpg          # 1200×630
├─ docs/
│  ├─ ai-session.md   # экспорт /export из Claude Code
│  └─ lighthouse-mobile.html
├─ .env.example
└─ README.md
```

---

## 1. Тайм-план

| Время | Этап |
|---|---|
| 0:00–0:20 | Репозиторий, Next.js, Vercel-деплой «пустышки» |
| 0:20–0:50 | Дизайн-направление, токены, шрифты, фото |
| 0:50–2:30 | Вёрстка секций |
| 2:30–3:45 | API `/api/lead`, форма, UTM |
| 3:45–4:15 | Telegram, OG-превью, анимации |
| 4:15–5:00 | Проверки, Lighthouse, правки |
| 5:00–5:30 | README, экспорт сессии, отправка |

---

## 2. Шаг 1 — инициализация

```bash
npx create-next-app@latest kvarta --ts --tailwind --eslint --app --import-alias "@/*" --use-npm
cd kvarta
npm i zod @upstash/redis
git init && git add -A && git commit -m "chore: init next.js project"
git remote add origin git@github.com:<user>/kvarta.git
git push -u origin main
```

Деплой сразу (чтобы ссылка жила с первого часа):

```bash
npx vercel          # или Import Project на vercel.com
```

`.env.example`:

```bash
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
NEXT_PUBLIC_SITE_URL=https://kvarta.vercel.app
NEXT_PUBLIC_CONTACT_PHONE=+375290000000
NEXT_PUBLIC_CONTACT_TG=kvarta_roast
```

---

## 3. Шаг 2 — дизайн-направление

Цель: не «типовой ИИ-лендинг». Решения:

- Бумага + чернила, как этикетка на крафтовой пачке. **Без** градиентов, стекла, фиолетового, одинаковых карточек с иконками.
- Центральная идея — **календарь обжарки**: чт — обжарка, пт — доставка. Счётчик «дней с последней обжарки».
- Карточки товаров = этикетки пачек (пунктирная рамка, штамп «Обжарка: чт»).
- Тон: тёплый, простой, от первого лица («мы», Аня и Дмитрий).
- Шрифты: **Alegreya** (заголовки), **Onest** (текст), оба с кириллицей.
- Моб. первый: sticky-кнопка «Заказать» внизу экрана.

`app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-paper: #f3eadb;
  --color-paper-2: #e9dcc5;
  --color-ink: #2a1f18;
  --color-roast: #6b3a22;
  --color-ember: #d4532b;
  --color-leaf: #3e5a3b;
  --font-sans: var(--font-onest), system-ui, sans-serif;
  --font-display: var(--font-alegreya), Georgia, serif;
}

html { scroll-behavior: smooth; }
body { background: var(--color-paper); color: var(--color-ink); font-family: var(--font-sans); }

.label-card {
  border: 2px dashed var(--color-roast);
  border-radius: 6px;
  background: color-mix(in srgb, var(--color-paper) 70%, white);
}

[data-reveal] {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity .5s ease, transform .5s ease;
}
[data-reveal].is-in { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  [data-reveal] { opacity: 1; transform: none; transition: none; }
}
```

`app/layout.tsx`:

```tsx
import type { Metadata, Viewport } from "next";
import { Onest, Alegreya } from "next/font/google";
import "./globals.css";

const onest = Onest({ subsets: ["cyrillic", "latin"], variable: "--font-onest", display: "swap" });
const alegreya = Alegreya({
  subsets: ["cyrillic", "latin"],
  variable: "--font-alegreya",
  display: "swap",
  weight: ["500", "700"],
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kvarta.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Кварта — обжарка кофе в Минске. Свежее зерно на 1–3 день",
  description:
    "Маленькая обжарка в Минске. Обжариваем в четверг, возим в пятницу. Подписка от 54 BYN в месяц, зерно на 1–3 день после обжарки.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE,
    siteName: "Кварта",
    title: "Кварта — обжарили в четверг, привезли в пятницу",
    description: "Свежий кофе из маленькой минской обжарки. Подписка и разовые заказы.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Кофе Кварта" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
};

export const viewport: Viewport = { themeColor: "#f3eadb" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${onest.variable} ${alegreya.variable}`}>
      <body>
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
```

Коммит: `git commit -am "feat: design tokens, fonts, layout meta"`

---

## 4. Шаг 3 — данные и контент

`data/products.ts`:

```ts
export type Product = {
  id: string;
  name: string;
  notes: string;
  meta: string;
  price: number;
  img?: string;
};

export const products: Product[] = [
  { id: "ethiopia", name: "Эфиопия Иргачеффе", notes: "цветочный, бергамот", meta: "светлая обжарка · 250 г", price: 32, img: "/img/ethiopia.jpg" },
  { id: "colombia", name: "Колумбия Уила", notes: "карамель, красное яблоко", meta: "250 г", price: 29, img: "/img/colombia.jpg" },
  { id: "brazil", name: "Бразилия Серрадо", notes: "орех, шоколад", meta: "под эспрессо · 250 г", price: 26, img: "/img/brazil.jpg" },
  { id: "drip", name: "Дрип-пакеты, ассорти", notes: "10 штук", meta: "для офиса и дороги", price: 18 },
];

export const SUBSCRIPTION_PRICE = 54;
export const FREE_DELIVERY_FROM = 50;
```

Структура страницы (порядок под конверсию, моб. первый):

1. **Hero** — «Обжарили в четверг — у вас в пятницу», CTA «Оформить подписку» / «Заказать разово»
2. **Свежесть** — календарь чт/пт + счётчик дней
3. **Ассортимент** — 4 этикетки с ценами
4. **Подписка** — 2 × 250 г, 54 BYN/мес, доставка бесплатно
5. **Доставка и самовывоз** — пт по Минску, от 50 BYN бесплатно, адрес, часы
6. **Кто мы** — Аня и Дмитрий, бывшие бариста, партии по 5 кг с 2019
7. **Форма заявки**
8. **Футер** — контакты, часы, адрес

Тексты (кратко, на правку):

```text
H1:      Обжарили в четверг — у вас в пятницу
Sub:     Маленькая обжарка в Минске. Партии по 5 кг, зерно у вас на 1–3 день после обжарки.
Свежесть: Кофе лучше всего раскрывается в первые недели после обжарки. Поэтому мы не держим склад:
          обжариваем по четвергам и развозим по пятницам.
Подписка: Две пачки по 250 г раз в месяц. Доставка бесплатно. 54 BYN.
Форма:   Оставьте номер — менеджер перезвонит и всё оформит. Оплата не нужна.
Успех:   Заявка принята. Перезвоним в рабочее время.
Ошибка:  Не получилось отправить. Попробуйте ещё раз или позвоните: +375 …
```

---

## 5. Шаг 4 — компоненты

`lib/freshness.ts`

```ts
const ROAST_DAY = 4; // четверг

export function lastRoast(now = new Date()) {
  const minsk = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Minsk" }));
  const daysAgo = (minsk.getDay() - ROAST_DAY + 7) % 7;
  const date = new Date(minsk);
  date.setDate(minsk.getDate() - daysAgo);
  return { date, daysAgo };
}
```

`components/FreshnessBadge.tsx`

```tsx
"use client";
import { useEffect, useState } from "react";
import { lastRoast } from "@/lib/freshness";

export default function FreshnessBadge() {
  const [info, setInfo] = useState<{ label: string; daysAgo: number } | null>(null);

  useEffect(() => {
    const { date, daysAgo } = lastRoast();
    const label = date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
    setInfo({ label, daysAgo });
  }, []);

  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-leaf px-3 py-1 text-sm text-leaf">
      <span className="h-2 w-2 rounded-full bg-leaf" aria-hidden />
      {info
        ? `Последняя обжарка: ${info.label}${info.daysAgo === 0 ? " — сегодня" : ""}`
        : "Обжариваем по четвергам"}
    </p>
  );
}
```

`components/Reveal.tsx`

```tsx
"use client";
import { useEffect, useRef } from "react";

export default function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-reveal className={className}>
      {children}
    </div>
  );
}
```

`components/ProductCard.tsx`

```tsx
import Image from "next/image";
import type { Product } from "@/data/products";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <article className="label-card flex flex-col gap-3 p-4">
      {p.img && (
        <Image
          src={p.img}
          alt={p.name}
          width={640}
          height={480}
          sizes="(min-width:768px) 25vw, 90vw"
          className="aspect-[4/3] w-full rounded object-cover"
        />
      )}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-xl font-bold leading-tight">{p.name}</h3>
        <span className="whitespace-nowrap font-display text-xl text-ember">{p.price} BYN</span>
      </div>
      <p>{p.notes}</p>
      <p className="text-sm text-roast">{p.meta}</p>
      <span className="mt-auto self-start rotate-[-3deg] border border-ember px-2 py-0.5 text-xs uppercase tracking-wide text-ember">
        Обжарка: чт
      </span>
    </article>
  );
}
```

`app/page.tsx`

```tsx
import AttributionCapture from "@/components/AttributionCapture";
import FreshnessBadge from "@/components/FreshnessBadge";
import LeadForm from "@/components/LeadForm";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { products, SUBSCRIPTION_PRICE, FREE_DELIVERY_FROM } from "@/data/products";

const PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+375290000000";
const TG = process.env.NEXT_PUBLIC_CONTACT_TG ?? "kvarta_roast";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  name: "Кварта",
  address: { "@type": "PostalAddress", streetAddress: "ул. Короля, 9", addressLocality: "Минск", addressCountry: "BY" },
  openingHours: ["Mo-Fr 08:00-20:00", "Sa-Su 10:00-18:00"],
  telephone: PHONE,
};

export default function Home() {
  return (
    <main>
      <AttributionCapture />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO */}
      <section className="mx-auto max-w-5xl px-5 pb-12 pt-10 md:pt-20">
        <p className="font-display text-lg text-roast">Кварта · обжарка кофе · Минск</p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-[1.05] md:text-6xl">
          Обжарили в четверг —<br /> у вас в пятницу
        </h1>
        <p className="mt-5 max-w-xl text-lg">
          Маленькая обжарка в Минске. Партии по 5 кг, зерно у вас на 1–3 день после обжарки.
        </p>
        <div className="mt-6"><FreshnessBadge /></div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#order" className="rounded bg-ember px-5 py-3 font-medium text-white">Оформить подписку</a>
          <a href="#order" className="rounded border-2 border-ink px-5 py-3 font-medium">Заказать разово</a>
        </div>
      </section>

      {/* СВЕЖЕСТЬ */}
      <section className="bg-paper-2 py-12">
        <Reveal className="mx-auto grid max-w-5xl gap-8 px-5 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold">Почему мы не держим склад</h2>
            <p className="mt-4">
              Кофе лучше всего раскрывается в первые недели после обжарки. Поэтому обжариваем по четвергам
              и развозим по пятницам — без полок и залежавшихся пачек.
            </p>
          </div>
          <ol className="grid grid-cols-2 gap-3 text-center">
            <li className="label-card p-4"><b className="block font-display text-2xl">Чт</b>обжарка</li>
            <li className="label-card p-4"><b className="block font-display text-2xl">Пт</b>доставка по Минску</li>
            <li className="label-card col-span-2 p-4"><b className="block font-display text-2xl">1–3 день</b>зерно у вас после обжарки</li>
          </ol>
        </Reveal>
      </section>

      {/* АССОРТИМЕНТ */}
      <section id="coffee" className="mx-auto max-w-5xl px-5 py-14">
        <Reveal>
          <h2 className="font-display text-3xl font-bold">Что обжариваем</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </Reveal>
      </section>

      {/* ПОДПИСКА */}
      <section className="bg-roast py-14 text-paper">
        <Reveal className="mx-auto max-w-5xl px-5">
          <h2 className="font-display text-3xl font-bold">Подписка</h2>
          <p className="mt-3 max-w-xl">Две пачки по 250 г раз в месяц. Доставка бесплатно. Выбираете сорта — мы обжариваем к ближайшему четвергу.</p>
          <p className="mt-6 font-display text-5xl">{SUBSCRIPTION_PRICE} BYN <span className="text-xl">/ мес</span></p>
          <a href="#order" className="mt-6 inline-block rounded bg-ember px-5 py-3 font-medium text-white">Оставить заявку</a>
        </Reveal>
      </section>

      {/* ДОСТАВКА / САМОВЫВОЗ */}
      <section className="mx-auto grid max-w-5xl gap-8 px-5 py-14 md:grid-cols-2">
        <Reveal>
          <h2 className="font-display text-3xl font-bold">Доставка</h2>
          <p className="mt-3">По Минску — по пятницам. От {FREE_DELIVERY_FROM} BYN бесплатно.</p>
        </Reveal>
        <Reveal>
          <h2 className="font-display text-3xl font-bold">Самовывоз</h2>
          <p className="mt-3">Минск, ул. Короля, 9<br />пн–пт 8:00–20:00<br />сб–вс 10:00–18:00</p>
        </Reveal>
      </section>

      {/* О НАС */}
      <section className="bg-paper-2 py-14">
        <Reveal className="mx-auto max-w-3xl px-5">
          <h2 className="font-display text-3xl font-bold">Кто мы</h2>
          <p className="mt-4">
            Мы — Аня и Дмитрий, раньше работали бариста. С 2019 года обжариваем сами, партиями по 5 кг,
            чтобы каждую пачку можно было проследить до конкретной четверговой обжарки.
          </p>
        </Reveal>
      </section>

      {/* ФОРМА */}
      <section id="order" className="mx-auto max-w-xl scroll-mt-6 px-5 py-14">
        <h2 className="font-display text-3xl font-bold">Оставить заявку</h2>
        <p className="mt-2">Менеджер перезвонит и всё оформит. Оплата сейчас не нужна.</p>
        <div className="mt-6"><LeadForm phone={PHONE} tg={TG} /></div>
      </section>

      <footer className="border-t border-roast/30 px-5 py-8 text-sm">
        <div className="mx-auto flex max-w-5xl flex-wrap justify-between gap-3">
          <span>© Кварта, Минск</span>
          <a href={`tel:${PHONE}`}>{PHONE}</a>
          <a href={`https://t.me/${TG}`}>Telegram</a>
        </div>
      </footer>

      {/* STICKY CTA (моб.) */}
      <a href="#order" className="fixed inset-x-4 bottom-4 z-10 rounded bg-ember py-3 text-center font-medium text-white shadow md:hidden">
        Заказать кофе
      </a>
    </main>
  );
}
```

Фото (поиск на Unsplash/Pexels, лицензия на странице фото):

```text
Hero/OG:   "coffee roasting small batch", "coffee beans kraft paper bag"
Эфиопия:   "pour over coffee bloom"
Колумбия:  "coffee beans bag handwritten label"
Бразилия:  "espresso shot crema"
```

Скачать ≤1600px по ширине, сохранить в `public/img/`. Авторов записать в README.

Коммиты:

```bash
git commit -am "feat: hero and freshness section"
git commit -am "feat: products, subscription, delivery sections"
git commit -am "feat: about section, footer, sticky cta"
```

---

## 6. Шаг 5 — валидация телефона (общая для клиента и сервера)

`lib/validation.ts`

```ts
import { z } from "zod";

/** Принимает: +375 29 123-45-67 · 375291234567 · 80291234567 · 291234567 */
export function normalizeBYPhone(input: string): string | null {
  const d = input.replace(/\D/g, "");
  let n: string | null = null;
  if (d.length === 12 && d.startsWith("375")) n = d;
  else if (d.length === 11 && d.startsWith("80")) n = "375" + d.slice(2);
  else if (d.length === 9) n = "375" + d;
  if (!n) return null;
  // мобильные A1/МТС/life:) + Минск (17)
  return /^375(25|29|33|44|17)\d{7}$/.test(n) ? "+" + n : null;
}

export const INTERESTS = ["subscription", "one-time", "question"] as const;

export const attributionSchema = z
  .object({
    utm_source: z.string().max(200),
    utm_medium: z.string().max(200),
    utm_campaign: z.string().max(200),
    utm_content: z.string().max(200),
    utm_term: z.string().max(200),
    yclid: z.string().max(200),
    fbclid: z.string().max(200),
    ad_id: z.string().max(200),
    adset_id: z.string().max(200),
    campaign_id: z.string().max(200),
    referrer: z.string().max(500),
    landing: z.string().max(500),
    page: z.string().max(500),
  })
  .partial();

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Как к вам обращаться?").max(60),
  phone: z.string().trim().min(1, "Введите телефон").max(30),
  interest: z.enum(INTERESTS),
  comment: z.string().trim().max(500).optional().default(""),
  website: z.string().optional(), // honeypot
  attribution: attributionSchema.optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
```

Тест-кейсы (проверить руками или vitest):

```text
+375 29 123-45-67   → +375291234567  ✔
80291234567         → +375291234567  ✔
29 123 45 67        → +375291234567  ✔
+375 17 123-45-67   → +375171234567  ✔
+7 916 123-45-67    → null ✘
+375 99 123-45-67   → null ✘
12345               → null ✘
```

Коммит: `git commit -am "feat: BY phone validation and lead schema"`

---

## 7. Шаг 6 — источник заявки (UTM / реклама)

`lib/attribution.ts`

```ts
const KEY = "kvarta_attr";
const PARAMS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
  "yclid", "fbclid", "ad_id", "adset_id", "campaign_id",
] as const;

export type Attribution = Partial<Record<(typeof PARAMS)[number] | "referrer" | "landing" | "page", string>>;

/** Вызывается при загрузке. Новые метки перезаписывают старые, иначе сохраняем прежние. */
export function captureAttribution() {
  try {
    const url = new URL(location.href);
    const found: Attribution = {};
    for (const p of PARAMS) {
      const v = url.searchParams.get(p);
      if (v) found[p] = v.slice(0, 200);
    }
    const saved = localStorage.getItem(KEY);
    if (saved && Object.keys(found).length === 0) return;
    found.referrer = document.referrer.slice(0, 500);
    found.landing = (location.pathname + location.search).slice(0, 500);
    localStorage.setItem(KEY, JSON.stringify(found));
  } catch {
    /* storage недоступен — не критично */
  }
}

export function getAttribution(): Attribution {
  let saved: Attribution = {};
  try {
    saved = JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {}
  return { ...saved, page: (location.pathname + location.search).slice(0, 500) };
}
```

`components/AttributionCapture.tsx`

```tsx
"use client";
import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

export default function AttributionCapture() {
  useEffect(() => { captureAttribution(); }, []);
  return null;
}
```

Шаблон рекламных ссылок (для проверки и README):

```text
Instagram: https://kvarta.vercel.app/?utm_source=instagram&utm_medium=cpc&utm_campaign=autumn&utm_content={{ad.name}}&ad_id={{ad.id}}
Яндекс:    https://kvarta.vercel.app/?utm_source=yandex&utm_medium=cpc&utm_campaign={campaign_id}&utm_content={ad_id}&utm_term={keyword}&yclid={yclid}
```

Коммит: `git commit -am "feat: capture ad attribution (utm, click ids, referrer)"`

---

## 8. Шаг 7 — Telegram

Подготовка:

```text
1. @BotFather → /newbot → получить TELEGRAM_BOT_TOKEN
2. Написать боту любое сообщение (или добавить в рабочий чат)
3. Открыть https://api.telegram.org/bot<TOKEN>/getUpdates → взять chat.id → TELEGRAM_CHAT_ID
```

`lib/telegram.ts`

```ts
export type Lead = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  interest: string;
  comment: string;
  attribution?: Record<string, string | undefined>;
};

const esc = (s: string) =>
  s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c] as string));

const INTEREST_RU: Record<string, string> = {
  subscription: "Подписка",
  "one-time": "Разовый заказ",
  question: "Вопрос",
};

export async function notifyTelegram(lead: Lead) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return;

  const a = lead.attribution ?? {};
  const source = [a.utm_source, a.utm_medium, a.utm_campaign].filter(Boolean).join(" / ") || "прямой / неизвестно";
  const text = [
    `<b>Новая заявка: ${INTEREST_RU[lead.interest] ?? lead.interest}</b>`,
    `Имя: ${esc(lead.name)}`,
    `Телефон: ${esc(lead.phone)}`,
    lead.comment ? `Комментарий: ${esc(lead.comment)}` : "",
    "",
    `Источник: ${esc(source)}`,
    a.utm_content ? `Объявление: ${esc(a.utm_content)}` : "",
    a.ad_id ? `ad_id: ${esc(a.ad_id)}` : "",
    a.yclid ? `yclid: ${esc(a.yclid)}` : "",
    a.fbclid ? `fbclid: ${esc(a.fbclid)}` : "",
    `Страница: ${esc(a.page ?? a.landing ?? "-")}`,
    a.referrer ? `Referrer: ${esc(a.referrer)}` : "",
  ]
    .filter((l) => l !== "")
    .join("\n");

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chat, text, parse_mode: "HTML", disable_web_page_preview: true }),
    signal: AbortSignal.timeout(4000),
  });
}
```

---

## 9. Шаг 8 — бэкенд `/api/lead`

**Хранение:** Upstash Redis (бесплатный план).
Почему не файл/SQLite: на Vercel файловая система serverless — только для чтения/временная, данные пропадут.
Почему Redis: атомарный `SET NX EX 600` = дедупликация за 10 минут без гонок (двойной клик, два запроса одновременно).

Подключение: Vercel → Storage / Marketplace → Upstash Redis → Connect to project (переменные добавятся сами; при необходимости продублировать как `UPSTASH_REDIS_REST_URL/TOKEN`).

`app/api/lead/route.ts`

```ts
import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { leadSchema, normalizeBYPhone } from "@/lib/validation";
import { notifyTelegram, type Lead } from "@/lib/telegram";

export const runtime = "nodejs";

const redis = Redis.fromEnv();
const DEDUPE_TTL_SEC = 600; // 10 минут

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0] ?? "form");
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
      { ok: false, errors: { phone: "Введите белорусский номер, например +375 29 123-45-67" } },
      { status: 422 }
    );
  }

  // дедупликация: атомарно занимаем ключ на 10 минут
  const dedupeKey = `lead:dedupe:${phone}`;
  try {
    const fresh = await redis.set(dedupeKey, "1", { nx: true, ex: DEDUPE_TTL_SEC });
    if (fresh === null) {
      return NextResponse.json({ ok: true, duplicate: true }); // для пользователя — тот же успех
    }
  } catch {
    return NextResponse.json({ ok: false, error: "storage" }, { status: 503 });
  }

  const lead: Lead = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    name: data.name,
    phone,
    interest: data.interest,
    comment: data.comment ?? "",
    attribution: data.attribution,
  };

  try {
    await redis.lpush("leads", JSON.stringify(lead));
  } catch {
    await redis.del(dedupeKey).catch(() => {}); // не блокируем повторную попытку
    return NextResponse.json({ ok: false, error: "storage" }, { status: 503 });
  }

  // Telegram — дополнительно; сбой не должен ронять заявку
  try {
    await notifyTelegram(lead);
  } catch (e) {
    console.error("telegram failed", e);
  }

  return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
}
```

Просмотр заявок: Upstash Console → Data Browser → ключ `leads` (или `LRANGE leads 0 -1`).

Проверка curl:

```bash
URL=http://localhost:3000   # или боевой домен

# 1. успех (201)
curl -i -X POST $URL/api/lead -H 'content-type: application/json' \
  -d '{"name":"Аня","phone":"+375 29 123-45-67","interest":"subscription","comment":"","attribution":{"utm_source":"instagram","utm_content":"ad-42"}}'

# 2. повтор того же номера (200, duplicate:true, новой записи нет)
curl -i -X POST $URL/api/lead -H 'content-type: application/json' \
  -d '{"name":"Аня","phone":"80291234567","interest":"subscription"}'

# 3. неверный номер (422)
curl -i -X POST $URL/api/lead -H 'content-type: application/json' \
  -d '{"name":"Аня","phone":"+7 916 123-45-67","interest":"question"}'

# 4. гонка: 5 параллельных запросов → ровно одна запись
for i in 1 2 3 4 5; do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST $URL/api/lead -H 'content-type: application/json' \
    -d '{"name":"Тест","phone":"+375 44 555-66-77","interest":"one-time"}' &
done; wait
```

Коммит: `git commit -am "feat: /api/lead with validation, dedupe and redis storage"`

---

## 10. Шаг 9 — форма

`components/LeadForm.tsx`

```tsx
"use client";
import { useRef, useState } from "react";
import { normalizeBYPhone } from "@/lib/validation";
import { getAttribution } from "@/lib/attribution";

type Status = "idle" | "submitting" | "success" | "error";
type Errors = Partial<Record<"name" | "phone" | "interest", string>>;

export default function LeadForm({ phone: contactPhone, tg }: { phone: string; tg: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const lock = useRef(false); // защита от двойного клика (state обновляется асинхронно)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (lock.current) return;

    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const phone = String(fd.get("phone") ?? "");

    const next: Errors = {};
    if (name.length < 2) next.name = "Как к вам обращаться?";
    if (!normalizeBYPhone(phone)) next.phone = "Введите белорусский номер, например +375 29 123-45-67";
    setErrors(next);
    if (Object.keys(next).length) return;

    lock.current = true;
    setStatus("submitting");
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10_000);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          interest: fd.get("interest"),
          comment: fd.get("comment"),
          website: fd.get("website"),
          attribution: getAttribution(),
        }),
        signal: ctrl.signal,
      });

      if (res.status === 422) {
        const j = await res.json();
        setErrors(j.errors ?? {});
        setStatus("idle");
        return;
      }
      if (!res.ok) throw new Error(String(res.status));

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    } finally {
      clearTimeout(timer);
      lock.current = false;
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="label-card p-5">
        <p className="font-display text-2xl font-bold">Заявка принята</p>
        <p className="mt-2">Перезвоним в рабочее время.</p>
      </div>
    );
  }

  const busy = status === "submitting";
  const input = "mt-1 w-full rounded border border-roast/50 bg-white/70 px-3 py-3 text-base";

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      {/* honeypot */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute left-[-9999px]" />

      <label>
        Имя
        <input name="name" autoComplete="given-name" className={input}
          aria-invalid={!!errors.name} aria-describedby={errors.name ? "e-name" : undefined} />
        {errors.name && <span id="e-name" className="text-sm text-ember">{errors.name}</span>}
      </label>

      <label>
        Телефон
        <input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+375 29 123-45-67"
          className={input} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "e-phone" : undefined} />
        {errors.phone && <span id="e-phone" className="text-sm text-ember">{errors.phone}</span>}
      </label>

      <fieldset>
        <legend>Что интересует</legend>
        <div className="mt-2 flex flex-wrap gap-4">
          <label><input type="radio" name="interest" value="subscription" defaultChecked /> Подписка</label>
          <label><input type="radio" name="interest" value="one-time" /> Разовый заказ</label>
          <label><input type="radio" name="interest" value="question" /> Вопрос</label>
        </div>
      </fieldset>

      <label>
        Комментарий
        <textarea name="comment" rows={3} maxLength={500} className={input} />
      </label>

      {status === "error" && (
        <div role="alert" className="rounded border border-ember p-3 text-sm">
          Не получилось отправить заявку. Проверьте интернет и нажмите ещё раз — или позвоните{" "}
          <a className="underline" href={`tel:${contactPhone}`}>{contactPhone}</a> / напишите в{" "}
          <a className="underline" href={`https://t.me/${tg}`}>Telegram</a>.
        </div>
      )}

      <button type="submit" disabled={busy}
        className="rounded bg-ember px-5 py-3 font-medium text-white disabled:opacity-60">
        {busy ? "Отправляем…" : status === "error" ? "Повторить отправку" : "Отправить заявку"}
      </button>
    </form>
  );
}
```

Коммит: `git commit -am "feat: lead form with client validation, error states, double-submit lock"`

---

## 11. Шаг 10 — превью ссылки (OG)

- Мета-теги уже в `layout.tsx` (см. шаг 2).
- Сделать `public/og.jpg` 1200×630: фото пачки + «Кварта · Обжарили в четверг — у вас в пятницу».
- Проверить: Telegram (отправить ссылку себе в «Избранное»), WhatsApp, [opengraph.xyz](https://www.opengraph.xyz).
- Если превью старое — Telegram: бот `@WebpageBot` → отправить ссылку.

Коммит: `git commit -am "feat: og image and link preview meta"`

---

## 12. Шаг 11 — деплой и переменные

```bash
# Vercel → Project → Settings → Environment Variables:
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_CONTACT_PHONE
NEXT_PUBLIC_CONTACT_TG

git push            # авто-деплой
# после добавления env → Redeploy
```

Чек после деплоя (на боевой ссылке, с телефона):

```text
[ ] открывается по HTTPS
[ ] форма отправляется, заявка видна в Redis и приходит в Telegram
[ ] повторный номер в течение 10 минут → без второй записи
[ ] двойной тап по кнопке → одна запись
[ ] неверный номер → понятная подсказка
[ ] режим «Офлайн» в DevTools → видна ошибка и контакты
[ ] ?utm_source=instagram&utm_content=test → источник в Telegram
```

---

## 13. Шаг 12 — Lighthouse (мобильная версия)

```bash
npx lighthouse https://kvarta.vercel.app \
  --form-factor=mobile --screenEmulation.mobile \
  --output=html --output-path=./docs/lighthouse-mobile.html --view
```

Цели: Performance ≥ 90 · Accessibility ≥ 95 · Best Practices ≥ 95 · SEO ≥ 95.

Что чинить, если ниже:

```text
LCP        → priority на hero-картинку, размеры width/height, sizes, AVIF/WebP
CLS        → задать размеры изображений, font-display: swap
TBT        → меньше клиентских компонентов, без тяжёлых библиотек
A11y       → контраст ember на paper, label у полей, alt у фото
```

Коммит: `git add docs && git commit -m "docs: lighthouse mobile report"`

---

## 14. ИИ-процесс (что прислать)

Работать в Claude Code, коммитить по шагам. В конце:

```text
/export docs/ai-session.md
```

Промпты по этапам (короткие, свои правки — в лог):

```text
1. «Прочитай brief. Предложи дизайн-направление для обжарки «Кварта», которое не похоже на типовой
   ИИ-лендинг. Дай 3 варианта с аргументами, без градиентов и стоковых паттернов.»
2. «Сверстай секции по структуре [список]. Мобильный первый. Tailwind, токены в @theme.»
3. «Напиши /api/lead: zod, BY-телефон, дедуп 10 мин через Redis SET NX, UTM в заявке.»
4. «Найди в коде ошибки гонки и крайние случаи для дедупликации и двойного клика.»
5. «Добавь Telegram-уведомление, сбой Telegram не должен ломать заявку.»
6. «Проверь доступность и Lighthouse mobile, предложи конкретные правки.»
```

Фиксировать по ходу (для README, только реальное):

```text
- где ИИ выдал шаблонный дизайн, и что я изменил
- где ИИ ошибся (кандидаты для проверки: SQLite/файл на Vercel, regex телефона, гидрация даты,
  гонка при дедупликации) и как я это заметил
- что осталось недоделанным
```

---

## 15. README (на полстраницы)

```md
# Кварта — лендинг обжарки

**Сайт:** <ссылка> · **Репозиторий:** <ссылка>

## Стек
Next.js 15, Tailwind v4, zod, Upstash Redis, Telegram Bot API, Vercel.

## Хранение заявок
Upstash Redis (список `leads`). Файл/SQLite на Vercel не сохраняются (serverless).
Дедупликация: `SET NX EX 600` по нормализованному номеру.

## Что делал сам / что ИИ
- Сам: <дизайн-направление, тексты, подбор фото, архитектура хранения, проверки>
- ИИ: <каркас компонентов, схема валидации, шаблоны кода>

## Где ИИ ошибся
- <ошибка 1 → как заметил → как исправил>
- <ошибка 2 → …>

## Допущения
- Телефон и Telegram в футере — вымышленные.
- Принимаются мобильные коды 25/29/33/44 и Минск 17.
- Повтор заявки с того же номера за 10 минут показывается пользователю как успех, без новой записи.
- Время ответа менеджера: «в рабочее время».
- Атрибуция: последние рекламные метки перезаписывают прежние; без меток сохраняются старые.

## Не успел / сделал бы иначе
- <пункты>

## Фото
<автор, источник, лицензия>

## Запуск
npm i && cp .env.example .env.local && npm run dev
```

---

## 16. История коммитов (ориентир)

```text
chore: init next.js project
feat: design tokens, fonts, layout meta
feat: hero and freshness section
feat: products, subscription, delivery sections
feat: about section, footer, sticky cta
feat: BY phone validation and lead schema
feat: capture ad attribution (utm, click ids, referrer)
feat: /api/lead with validation, dedupe and redis storage
feat: lead form with client validation, error states, double-submit lock
feat: telegram notification
feat: og image and link preview meta
feat: reveal animations (reduced-motion safe)
perf: image sizes, priority hero, a11y fixes
docs: lighthouse mobile report, ai session export, readme
```

---

## 17. Финал — что отправить одним сообщением

```text
1. Ссылка на сайт
2. Ссылка на репозиторий (публичный)
3. Лог ИИ: docs/ai-session.md (экспорт /export) или скриншоты
4. Lighthouse mobile: docs/lighthouse-mobile.html или скриншот
5. README в репозитории (ссылка)
```

Предотправочный чек:

```text
[ ] отправлено до 19.10, 18:00 МСК (лучше за час до)
[ ] сайт открывается без входа, форма работает на боевом домене
[ ] репозиторий доступен, коммиты по шагам
[ ] в .env.example нет секретов, в репозитории нет .env.local
[ ] README честно описывает ошибки ИИ и недоделки
