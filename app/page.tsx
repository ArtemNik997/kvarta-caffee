import FreshnessBadge from '@/components/FreshnessBadge';
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
