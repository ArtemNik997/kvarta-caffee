import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f4ef] text-[#29291f]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#283b32] py-20 text-[#f5f0e4] sm:py-32">
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-24 h-96 w-96 rounded-full border border-white/10"
        />
        <div
          aria-hidden="true"
          className="absolute -right-10 -top-14 h-72 w-72 rounded-full border border-white/10"
        />

        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d5bd8b]">
            Уютное кафе & Кофейня · Минск
          </p>
          <h1 className="mt-6 max-w-2xl font-serif text-4xl leading-tight sm:text-6xl">
            Место, где кофе встречается с душой
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
            Свежеобжаренные зёрна, авторская выпечка и атмосфера, в которую
            хочется возвращаться каждый день.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/form"
              className="inline-flex items-center justify-center rounded-xl bg-[#d5bd8b] px-7 py-4 text-sm font-semibold text-[#283b32] transition hover:bg-[#c4ab79]"
            >
              Забронировать стол или сделать заказ
            </Link>
          </div>
        </div>
      </section>

      {/* О нас / Особенности */}
      <section className="mx-auto max-w-5xl px-6 py-20 sm:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78816e]">
            Почему выбирают нас
          </p>
          <h2 className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">
            Особенная атмосфера в каждой детали
          </h2>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-8 shadow-sm border border-[#e6e4dc]">
            <div className="mb-4 text-3xl">☕</div>
            <h3 className="font-serif text-xl font-medium">Спешелти кофе</h3>
            <p className="mt-2 text-sm leading-6 text-[#77776f]">
              Используем только 100% арабику свежей обжарки от лучших обжарщиков.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm border border-[#e6e4dc]">
            <div className="mb-4 text-3xl">🥐</div>
            <h3 className="font-serif text-xl font-medium">Свежая выпечка</h3>
            <p className="mt-2 text-sm leading-6 text-[#77776f]">
              Выпекаем круассаны, тарты и десерты каждое утро собственными руками.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm border border-[#e6e4dc]">
            <div className="mb-4 text-3xl">🌿</div>
            <h3 className="font-serif text-xl font-medium">Уютный интерьер</h3>
            <p className="mt-2 text-sm leading-6 text-[#77776f]">
              Идеальное место для встреч с друзьями, работы с ноутбуком или отдыха.
            </p>
          </div>
        </div>
      </section>

      {/* Популярные позиции меню */}
      <section className="bg-white py-20 border-y border-[#e6e4dc]">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78816e]">
              Наше меню
            </p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">
              Любимые позиции гостей
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-xl border border-[#f0eee6] bg-[#fbfaf7] p-5">
              <div>
                <h4 className="font-medium text-lg">Фирменный Раф «Лаванда»</h4>
                <p className="text-xs text-[#77776f]">Нежный кофейный напиток с лавандовым сиропом</p>
              </div>
              <span className="font-serif text-lg font-semibold text-[#283b32]">9 BYN</span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-[#f0eee6] bg-[#fbfaf7] p-5">
              <div>
                <h4 className="font-medium text-lg">Миндальный круассан</h4>
                <p className="text-xs text-[#77776f]">Слепечён по классическому французскому рецепту</p>
              </div>
              <span className="font-serif text-lg font-semibold text-[#283b32]">7 BYN</span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-[#f0eee6] bg-[#fbfaf7] p-5">
              <div>
                <h4 className="font-medium text-lg">Флэт Уайт</h4>
                <p className="text-xs text-[#77776f]">Двойной эспрессо с шелковистой молочной пеной</p>
              </div>
              <span className="font-serif text-lg font-semibold text-[#283b32]">8 BYN</span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-[#f0eee6] bg-[#fbfaf7] p-5">
              <div>
                <h4 className="font-medium text-lg">Завтрак с авокадо и яйцом пашот</h4>
                <p className="text-xs text-[#77776f]">Подается на свежем тартин-хлебе</p>
              </div>
              <span className="font-serif text-lg font-semibold text-[#283b32]">16 BYN</span>
            </div>
          </div>
        </div>
      </section>

      {/* Призыв к действию (CTA Section) */}
      <section className="mx-auto max-w-5xl px-6 py-20 text-center sm:px-8">
        <div className="rounded-[2.5rem] bg-[#283b32] p-10 sm:p-16 text-[#f5f0e4] shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d5bd8b]">
            Ждем вас в гости
          </p>
          <h2 className="mt-4 font-serif text-3xl sm:text-5xl">
            Хотите забронировать столик или сделать предзаказ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
            Оставьте заявку, и мы свяжемся с вами для уточнения времени и всех деталей.
          </p>
          <div className="mt-8">
            <Link
              href="/form"
              className="inline-flex h-14 items-center justify-center rounded-xl bg-[#d5bd8b] px-8 text-base font-medium text-[#283b32] transition hover:bg-[#c4ab79] focus:outline-none focus:ring-2 focus:ring-[#d5bd8b] focus:ring-offset-2 focus:ring-offset-[#283b32]"
            >
              Связаться с нами
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}