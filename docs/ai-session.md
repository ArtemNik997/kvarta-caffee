# Лог сессии: лендинг кофейни «Кварта»

Хронология работы с ИИ: какие промпты отправлялись и что получилось на каждом шаге.

## Содержание

| № | Этап | Результат |
|---|------|-----------|
| 1 | [Первый план (PostgreSQL)](#шаг-1-первый-план-с-использованием-postgresql) | `plans/kvarta-roadmap-deprecated.md` |
| 2 | [Новый план по брифу (ветка `restart`)](#шаг-2-новый-план-по-брифу-ветка-restart) | `plans/kvarta-roadmap.md` |
| 3 | [Адаптация плана под обычный чат](#шаг-3-адаптация-плана-под-работу-в-обычном-чате) | `plans/kvarta-plan-with-regular-chat.md` |
| 4 | [Сокращение плана до необходимого](#шаг-4-сокращение-плана-до-необходимого) | `plans/kvarta-plan` |
| 5 | [Редизайн лендинга](#шаг-5-редизайн-лендинга) | Новый внешний вид сайта |

**Условные обозначения:** блок «Промпт» это запрос к ИИ, блок «Результат» это то, что получено в ответ.

---

## Шаг 1. Первый план с использованием PostgreSQL

### Промпт

> У меня есть некоторое ТЗ по созданию лендинга. Вот основные требования:

<details>
<summary>Текст ТЗ (развернуть)</summary>

**1. Задача лендинга**

Главная цель — заявка на подписку или на разовый заказ. Менеджер перезванивает и оформляет. Корзина и онлайн-оплата не нужны. Обязательно должно быть: кто они и почему свежесть важна, ассортимент с ценами, подписка, доставка и самовывоз, контакты и форма заявки. Порядок, структура, дополнительные блоки и тексты — на ваше усмотрение. Тексты выше можно переписать.

**2. Форма и бэкенд**

Форма: имя, телефон, что интересует (подписка, разовый заказ, вопрос), комментарий. Заявку принимает ваш эндпоинт, например `POST /api/lead`. Требования:

- Телефон — белорусский номер. Неверный номер не принимается, человек видит понятную подсказку.
- Повторная отправка того же номера в течение 10 минут, в том числе двойное нажатие на кнопку, не создаёт вторую заявку.
- Заявки идут с рекламы. Менеджеру важно знать, откуда пришёл клиент: из какой рекламы, с какого объявления, с какой страницы.
- Если отправка не удалась, человек должен это увидеть и понять, что делать.
- Куда складывать заявки — выберите сами: файл, SQLite или что-то ещё. Объясните выбор в README.

**3. Стек технологий**

- Стек свободный. Next.js будет плюсом, у нас основной стек такой.
- ИИ-инструменты любые. Предпочтительно Claude Code: у него есть экспорт сессии.
- Хостинг бесплатный: Vercel, Netlify, Cloudflare Pages или аналог. Сайт должен открываться по ссылке, и форма должна работать прямо там.
- Фото подберите сами с бесплатной лицензией (Unsplash, Pexels) или сгенерируйте. Логотип можно сделать текстом.
- Вопросы можно задавать. Если решили что-то сами, просто запишите допущение в README.

</details>

> В качестве базы даннных используй PostgreSQL. Только самое необходимое для MVP - лендинг с формой отправки заявок с валидацией согласно ТЗ

### Результат

Файл плана: `plans/kvarta-roadmap-deprecated.md`

---

## Шаг 2. Новый план по брифу (ветка `restart`)

**Контекст:** в ходе работы вариант из шага 1 был отброшен из-за осложнений разработки. Разработка началась с нуля в ветке `restart`.

### Промпт

К промпту был прикреплён файл `kvarta-brief.pdf`.

> изучи данный файл. на его основе создай md файл в котором будет подробно и поэтапно расписана реализация данного проекта. каждый из пунктов должен полностью описывать что в нем требуется реализовать и как это делать

### Результат

Файл плана: `plans/kvarta-roadmap.md`

---

## Шаг 3. Адаптация плана под работу в обычном чате

**Контекст:** план из шага 2 подразумевал использование Claude Code. Из-за отсутствия подписки план был переделан в ChatGPT (для экономии токенов в Claude).

### Промпт

> Это план по выполенинию тестового задания - созданию лендинга кафе Kvarta с формой для создания заявки. В нем подробно расписаны этапы создания лендинга с использованием Claude Code. Прочитай данный план и перепиши его с учетом того, что у меня нет подписки и возможности использовать Claude Code, но я могу писать в обычные чаты

### Результат

Файл плана: `plans/kvarta-plan-with-regular-chat.md`

---

## Шаг 4. Сокращение плана до необходимого

**Контекст:** план из шага 3 получился подробным, но включал слишком много деталей. Следующий промпт в Claude сократил его до самого необходимого.

### Промпт

> Это план по выполенинию тестового задания - созданию лендинга кафе Kvarta с формой для создания заявки. В нем подробно расписаны этапы создания лендинга с использованием чатов нейронных сетей. Напиши мне все основные действия по реализации и созданию сайта по данному плану и структуру работы без подробных объяснений как в md файле. Я должен видеть все действия со всей информацией по коду

### Результат

Файл плана: `plans/kvarta-plan`

---

## Шаг 5. Редизайн лендинга

**Контекст:** после создания всего необходимого функционала нужно было переделать внешний вид лендинга.

Старый вид лендинга: `screenshots/kvarta-coffee-old-ui.jpg`

### Промпт

Запрос состоял из текста и трёх файлов с кодом (раскрываются по клику).

> Я создал рабочий лендинг с валидацией и деплоем. Теперь я хочу поменять внешний вид лендинга. Вот оригинальный вид `layout.tsx`:

<details>
<summary><code>layout.tsx</code> (развернуть)</summary>

```tsx
import type { Metadata, Viewport } from 'next';
import { Onest, Alegreya } from 'next/font/google';
import './globals.css';

const onest = Onest({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-onest',
  display: 'swap',
});
const alegreya = Alegreya({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-alegreya',
  display: 'swap',
  weight: ['500', '700'],
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kvarta.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: 'Кварта — обжарка кофе в Минске. Свежее зерно на 1–3 день',
  description:
    'Маленькая обжарка в Минске. Обжариваем в четверг, возим в пятницу. Подписка от 54 BYN в месяц, зерно на 1–3 день после обжарки.',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: SITE,
    siteName: 'Кварта',
    title: 'Кварта — обжарили в четверг, привезли в пятницу',
    description:
      'Свежий кофе из маленькой минской обжарки. Подписка и разовые заказы.',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Кофе Кварта' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og.jpg'] },
};

export const viewport: Viewport = { themeColor: '#f3eadb' };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

</details>

> Вот файл стиля `globals.css`:

<details>
<summary><code>globals.css</code> (развернуть)</summary>

```css
@import 'tailwindcss';

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

html {
  scroll-behavior: smooth;
}
body {
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-sans);
}

.label-card {
  border: 2px dashed var(--color-roast);
  border-radius: 6px;
  background: color-mix(in srgb, var(--color-paper) 70%, white);
}

[data-reveal] {
  opacity: 0;
  transform: translateY(12px);
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}
[data-reveal].is-in {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  [data-reveal] {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

</details>

> А это главная страница `page.tsx`:

<details>
<summary><code>page.tsx</code> (развернуть)</summary>

```tsx
import AttributionCapture from '@/components/AttributionCapture';
import FreshnessBadge from '@/components/FreshnessBadge';
import LeadForm from '@/components/LeadForm';
// import LeadForm from '@/components/LeadForm';
import ProductCard from '@/components/ProductCard';
import Reveal from '@/components/Reveal';
import {
  products,
  SUBSCRIPTION_PRICE,
  FREE_DELIVERY_FROM,
} from '@/data/products';

const PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE ?? '+375290000000';
const TG = process.env.NEXT_PUBLIC_CONTACT_TG ?? 'kvarta_roast';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CafeOrCoffeeShop',
  name: 'Кварта',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ул. Короля, 9',
    addressLocality: 'Минск',
    addressCountry: 'BY',
  },
  openingHours: ['Mo-Fr 08:00-20:00', 'Sa-Su 10:00-18:00'],
  telephone: PHONE,
};

export default function Home() {
  return (
    <main>
      <AttributionCapture />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <section className="mx-auto max-w-5xl px-5 pb-12 pt-10 md:pt-20">
        <p className="font-display text-lg text-roast">
          Кварта · обжарка кофе · Минск
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-[1.05] md:text-6xl">
          Обжарили в четверг —<br /> у вас в пятницу
        </h1>
        <p className="mt-5 max-w-xl text-lg">
          Маленькая обжарка в Минске. Партии по 5 кг, зерно у вас на 1–3 день
          после обжарки.
        </p>
        <div className="mt-6">
          <FreshnessBadge />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#order"
            className="rounded bg-ember px-5 py-3 font-medium text-white"
          >
            Оформить подписку
          </a>
          <a
            href="#order"
            className="rounded border-2 border-ink px-5 py-3 font-medium"
          >
            Заказать разово
          </a>
        </div>
      </section>

      {/* СВЕЖЕСТЬ */}
      <section className="bg-paper-2 py-12">
        <Reveal className="mx-auto grid max-w-5xl gap-8 px-5 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold">
              Почему мы не держим склад
            </h2>
            <p className="mt-4">
              Кофе лучше всего раскрывается в первые недели после обжарки.
              Поэтому обжариваем по четвергам и развозим по пятницам — без полок
              и залежавшихся пачек.
            </p>
          </div>
          <ol className="grid grid-cols-2 gap-3 text-center">
            <li className="label-card p-4">
              <b className="block font-display text-2xl">Чт</b>обжарка
            </li>
            <li className="label-card p-4">
              <b className="block font-display text-2xl">Пт</b>доставка по
              Минску
            </li>
            <li className="label-card col-span-2 p-4">
              <b className="block font-display text-2xl">1–3 день</b>зерно у вас
              после обжарки
            </li>
          </ol>
        </Reveal>
      </section>

      {/* АССОРТИМЕНТ */}
      <section id="coffee" className="mx-auto max-w-5xl px-5 py-14">
        <Reveal>
          <h2 className="font-display text-3xl font-bold">Что обжариваем</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* ПОДПИСКА */}
      <section className="bg-roast py-14 text-paper">
        <Reveal className="mx-auto max-w-5xl px-5">
          <h2 className="font-display text-3xl font-bold">Подписка</h2>
          <p className="mt-3 max-w-xl">
            Две пачки по 250 г раз в месяц. Доставка бесплатно. Выбираете сорта
            — мы обжариваем к ближайшему четвергу.
          </p>
          <p className="mt-6 font-display text-5xl">
            {SUBSCRIPTION_PRICE} BYN <span className="text-xl">/ мес</span>
          </p>
          <a
            href="#order"
            className="mt-6 inline-block rounded bg-ember px-5 py-3 font-medium text-white"
          >
            Оставить заявку
          </a>
        </Reveal>
      </section>

      {/* ДОСТАВКА / САМОВЫВОЗ */}
      <section className="mx-auto grid max-w-5xl gap-8 px-5 py-14 md:grid-cols-2">
        <Reveal>
          <h2 className="font-display text-3xl font-bold">Доставка</h2>
          <p className="mt-3">
            По Минску — по пятницам. От {FREE_DELIVERY_FROM} BYN бесплатно.
          </p>
        </Reveal>
        <Reveal>
          <h2 className="font-display text-3xl font-bold">Самовывоз</h2>
          <p className="mt-3">
            Минск, ул. Короля, 9<br />
            пн–пт 8:00–20:00
            <br />
            сб–вс 10:00–18:00
          </p>
        </Reveal>
      </section>

      {/* О НАС */}
      <section className="bg-paper-2 py-14">
        <Reveal className="mx-auto max-w-3xl px-5">
          <h2 className="font-display text-3xl font-bold">Кто мы</h2>
          <p className="mt-4">
            Мы — Аня и Дмитрий, раньше работали бариста. С 2019 года обжариваем
            сами, партиями по 5 кг, чтобы каждую пачку можно было проследить до
            конкретной четверговой обжарки.
          </p>
        </Reveal>
      </section>

      {/* ФОРМА */}
      <section id="order" className="mx-auto max-w-xl scroll-mt-6 px-5 py-14">
        <h2 className="font-display text-3xl font-bold">Оставить заявку</h2>
        <p className="mt-2">
          Менеджер перезвонит и всё оформит. Оплата сейчас не нужна.
        </p>
        <div className="mt-6">
          <LeadForm phone={PHONE} tg={TG} />
        </div>
      </section>

      <footer className="border-t border-roast/30 px-5 py-8 text-sm">
        <div className="mx-auto flex max-w-5xl flex-wrap justify-between gap-3">
          <span>© Кварта, Минск</span>
          <a href={`tel:${PHONE}`}>{PHONE}</a>
          <a href={`https://t.me/${TG}`}>Telegram</a>
        </div>
      </footer>

      {/* STICKY CTA (моб.) */}
      <a
        href="#order"
        className="fixed inset-x-4 bottom-4 z-10 rounded bg-ember py-3 text-center font-medium text-white shadow md:hidden"
      >
        Заказать кофе
      </a>
    </main>
  );
}
```

</details>

> Просмотри сайт https://stolle.by/. Переделай структуру страницы под этот сайт, но учитывай, что сайт должен соответсвовать тематике кофейни, все требования по наполнению сайта должны быть выполенены. Также сохрани текущую цветовую палитру

### Результат

После небольшой доработки сайт принял актуальный вид.
