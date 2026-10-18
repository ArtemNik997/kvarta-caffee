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
