import AttributionCapture from '@/components/AttributionCapture';
import FreshnessBadge from '@/components/FreshnessBadge';
import LeadForm from '@/components/LeadForm';
import ProductCard from '@/components/ProductCard';
import Reveal from '@/components/Reveal';
import {
  products,
  SUBSCRIPTION_PRICE,
  FREE_DELIVERY_FROM,
} from '@/data/products';

const PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE ?? '+375290000000';
const TG = process.env.NEXT_PUBLIC_CONTACT_TG ?? 'kvarta_roast';

// Допущение: в data/products первые 3 позиции — зерно, остальные — дрип-пакеты.
const beans = products.slice(0, 3);
const drip = products.slice(3);

const NAV = [
  { href: '#subscription', label: 'Подписка' },
  { href: '#coffee', label: 'Зерно' },
  { href: '#drip', label: 'Дрип-пакеты' },
  { href: '#fresh', label: 'Свежесть' },
  { href: '#info', label: 'Доставка' },
  { href: '#about', label: 'О нас' },
];

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

function SectionHead({
  id,
  title,
  note,
}: {
  id: string;
  title: string;
  note?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1 border-b-2 border-ink pb-3">
      <h2 id={id} className="font-display text-3xl font-bold md:text-4xl">
        {title}
      </h2>
      {note && <p className="text-sm text-roast">{note}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <AttributionCapture />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ШАПКА + КАТЕГОРИИ (липкие) */}
      <header className="sticky top-0 z-20 border-b border-roast/30 bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <a href="#top" className="font-display text-2xl font-bold">
            Кварта
          </a>
          <div className="flex items-center gap-3">
            <a
              href={`tel:${PHONE}`}
              className="hidden font-medium sm:inline"
              aria-label="Позвонить"
            >
              {PHONE}
            </a>
            <a
              href="#order"
              className="rounded bg-ember px-4 py-2 text-sm font-medium text-white"
            >
              Заявка
            </a>
          </div>
        </div>
        <nav aria-label="Разделы страницы" className="border-t border-roast/20">
          <ul className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-5 py-2 [scrollbar-width:none]">
            {NAV.map((n) => (
              <li key={n.href} className="shrink-0">
                <a
                  href={n.href}
                  className="block rounded border border-roast/40 px-3 py-1.5 text-sm hover:bg-paper-2"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="top">
        {/* КОМПАКТНЫЙ ВСТУПЛЕНИЕ */}
        <section className="mx-auto grid max-w-6xl items-end gap-6 px-5 pb-8 pt-8 md:grid-cols-[1.4fr_1fr] md:pt-12">
          <div>
            <p className="font-display text-lg text-roast">
              Обжарка кофе · Минск
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold leading-[1.05] md:text-5xl">
              Обжарили в четверг — <br /> у вас в пятницу
            </h1>
            <p className="mt-4 max-w-xl text-lg">
              Маленькая обжарка в Минске. Партии по 5 кг, зерно у вас на 1–3
              день после обжарки.
            </p>
          </div>
          <div className="label-card p-4">
            <FreshnessBadge />
            <a
              href="#order"
              className="mt-4 block rounded bg-ember px-5 py-3 text-center font-medium text-white"
            >
              Оформить подписку
            </a>
          </div>
        </section>

        {/* ПОДПИСКА — как «сеты» в каталоге */}
        <section
          aria-labelledby="subscription"
          className="mx-auto max-w-6xl scroll-mt-28 px-5 py-8"
        >
          <SectionHead
            id="subscription"
            title="Подписка"
            note="Один сет — на месяц"
          />
          <Reveal className="mt-6">
            <div className="grid gap-6 bg-roast p-6 text-paper md:grid-cols-[1.5fr_1fr] md:items-center md:p-8">
              <div>
                <h3 className="font-display text-2xl font-bold">
                  Две пачки по 250 г раз в месяц
                </h3>
                <p className="mt-3 max-w-xl">
                  Доставка по Минску бесплатно. Выбираете сорта — мы обжариваем
                  к ближайшему четвергу.
                </p>
              </div>
              <div className="md:text-right">
                <p className="font-display text-5xl">
                  {SUBSCRIPTION_PRICE} BYN
                  <span className="text-xl"> / мес</span>
                </p>
                <a
                  href="#order"
                  className="mt-4 inline-block rounded bg-ember px-5 py-3 font-medium text-white"
                >
                  Оставить заявку
                </a>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ЗЕРНО */}
        <section
          aria-labelledby="coffee-title"
          id="coffee"
          className="mx-auto max-w-6xl scroll-mt-28 px-5 py-8"
        >
          <SectionHead
            id="coffee-title"
            title="Кофе в зёрнах"
            note="Обжариваем по четвергам"
          />
          <Reveal className="mt-6">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {beans.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </Reveal>
        </section>

        {/* ДРИП-ПАКЕТЫ */}
        {drip.length > 0 && (
          <section
            aria-labelledby="drip-title"
            id="drip"
            className="mx-auto max-w-6xl scroll-mt-28 px-5 py-8"
          >
            <SectionHead id="drip-title" title="Дрип-пакеты" />
            <Reveal className="mt-6">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {drip.map((p) => (
                  <ProductCard key={p.id} p={p} />
                ))}
              </div>
            </Reveal>
          </section>
        )}

        {/* СВЕЖЕСТЬ */}
        <section
          id="fresh"
          aria-labelledby="fresh-title"
          className="mt-8 scroll-mt-28 bg-paper-2 py-12"
        >
          <Reveal className="mx-auto grid max-w-6xl gap-8 px-5 md:grid-cols-2">
            <div>
              <h2
                id="fresh-title"
                className="font-display text-3xl font-bold md:text-4xl"
              >
                Почему мы не держим склад
              </h2>
              <p className="mt-4">
                Кофе лучше всего раскрывается в первые недели после обжарки.
                Поэтому обжариваем по четвергам и развозим по пятницам — без
                полок и залежавшихся пачек.
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
                <b className="block font-display text-2xl">1–3 день</b>зерно у
                вас после обжарки
              </li>
            </ol>
          </Reveal>
        </section>

        {/* ОПЛАТА / ДОСТАВКА / САМОВЫВОЗ — справочный блок */}
        <section
          id="info"
          aria-label="Доставка, самовывоз и оплата"
          className="mx-auto max-w-6xl scroll-mt-28 px-5 py-14"
        >
          <Reveal className="grid gap-8 md:grid-cols-3">
            <div className="border-t-2 border-ink pt-4">
              <h2 className="font-display text-2xl font-bold">Доставка</h2>
              <p className="mt-3">
                По Минску — по пятницам. От {FREE_DELIVERY_FROM} BYN бесплатно.
              </p>
            </div>
            <div className="border-t-2 border-ink pt-4">
              <h2 className="font-display text-2xl font-bold">Самовывоз</h2>
              <p className="mt-3">
                Минск, ул. Короля, 9
                <br />
                пн–пт 8:00–20:00
                <br />
                сб–вс 10:00–18:00
              </p>
            </div>
            <div className="border-t-2 border-ink pt-4">
              <h2 className="font-display text-2xl font-bold">Оплата</h2>
              <p className="mt-3">
                Онлайн-оплаты нет. Менеджер перезвонит и согласует способ оплаты
                при оформлении.
              </p>
            </div>
          </Reveal>
        </section>

        {/* О НАС */}
        <section
          id="about"
          aria-labelledby="about-title"
          className="scroll-mt-28 bg-paper-2 py-14"
        >
          <Reveal className="mx-auto max-w-3xl px-5">
            <h2
              id="about-title"
              className="font-display text-3xl font-bold md:text-4xl"
            >
              Кто мы
            </h2>
            <p className="mt-4">
              Мы — Аня и Дмитрий, раньше работали бариста. С 2019 года
              обжариваем сами, партиями по 5 кг, чтобы каждую пачку можно было
              проследить до конкретной четверговой обжарки.
            </p>
          </Reveal>
        </section>

        {/* ФОРМА */}
        <section
          id="order"
          aria-labelledby="order-title"
          className="mx-auto max-w-xl scroll-mt-28 px-5 py-14"
        >
          <h2
            id="order-title"
            className="font-display text-3xl font-bold md:text-4xl"
          >
            Оставить заявку
          </h2>
          <p className="mt-2">
            Менеджер перезвонит и всё оформит. Оплата сейчас не нужна.
          </p>
          <div className="mt-6">
            <LeadForm phone={PHONE} tg={TG} />
          </div>
        </section>
      </main>

      {/* ПОДВАЛ: контакты + справочные ссылки */}
      <footer className="border-t-2 border-ink bg-paper-2 px-5 pb-24 pt-10 text-sm md:pb-10">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl font-bold">Кварта</p>
            <p className="mt-2">Обжарка кофе, Минск, ул. Короля, 9</p>
          </div>
          <div>
            <p className="font-medium">Контакты</p>
            <p className="mt-2">
              <a href={`tel:${PHONE}`}>{PHONE}</a>
              <br />
              <a href={`https://t.me/${TG}`}>Telegram: @{TG}</a>
            </p>
          </div>
          <div>
            <p className="font-medium">Информация</p>
            <ul className="mt-2 space-y-1">
              <li>
                <a href="#info">Доставка и оплата</a>
              </li>
              <li>
                <a href="/privacy">Политика конфиденциальности</a>
              </li>
            </ul>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-6xl border-t border-roast/30 pt-4">
          © Кварта, Минск, 2019—2026
        </p>
      </footer>

      {/* STICKY CTA (моб.) */}
      <a
        href="#order"
        className="fixed inset-x-4 bottom-4 z-10 rounded bg-ember py-3 text-center font-medium text-white shadow md:hidden"
      >
        Заказать кофе
      </a>
    </>
  );
}
