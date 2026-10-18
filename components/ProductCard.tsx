import Image from 'next/image';
import type { Product } from '@/data/products';

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
        <h3 className="font-display text-xl font-bold leading-tight">
          {p.name}
        </h3>
        <span className="whitespace-nowrap font-display text-xl text-ember">
          {p.price} BYN
        </span>
      </div>
      <p>{p.notes}</p>
      <p className="text-sm text-roast">{p.meta}</p>
      <span className="mt-auto self-start rotate-[-3deg] border border-ember px-2 py-0.5 text-xs uppercase tracking-wide text-ember">
        Обжарка: чт
      </span>
    </article>
  );
}
