'use client';
import { useEffect, useState } from 'react';
import { lastRoast } from '@/lib/freshness';

export default function FreshnessBadge() {
  const [info, setInfo] = useState<{ label: string; daysAgo: number } | null>(
    null,
  );

  useEffect(() => {
    const { date, daysAgo } = lastRoast();
    const label = date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
    });
    setInfo({ label, daysAgo });
  }, []);

  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-leaf px-3 py-1 text-sm text-leaf">
      <span className="h-2 w-2 rounded-full bg-leaf" aria-hidden />
      {info
        ? `Последняя обжарка: ${info.label}${info.daysAgo === 0 ? ' — сегодня' : ''}`
        : 'Обжариваем по четвергам'}
    </p>
  );
}
