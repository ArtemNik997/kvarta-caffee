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
  s.replace(
    /[&<>]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c] as string,
  );

const INTEREST_RU: Record<string, string> = {
  subscription: 'Подписка',
  'one-time': 'Разовый заказ',
  question: 'Вопрос',
};

export async function notifyTelegram(lead: Lead) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return;

  const a = lead.attribution ?? {};
  const source =
    [a.utm_source, a.utm_medium, a.utm_campaign].filter(Boolean).join(' / ') ||
    'прямой / неизвестно';
  const text = [
    `<b>Новая заявка: ${INTEREST_RU[lead.interest] ?? lead.interest}</b>`,
    `Имя: ${esc(lead.name)}`,
    `Телефон: ${esc(lead.phone)}`,
    lead.comment ? `Комментарий: ${esc(lead.comment)}` : '',
    '',
    `Источник: ${esc(source)}`,
    a.utm_content ? `Объявление: ${esc(a.utm_content)}` : '',
    a.ad_id ? `ad_id: ${esc(a.ad_id)}` : '',
    a.yclid ? `yclid: ${esc(a.yclid)}` : '',
    a.fbclid ? `fbclid: ${esc(a.fbclid)}` : '',
    `Страница: ${esc(a.page ?? a.landing ?? '-')}`,
    a.referrer ? `Referrer: ${esc(a.referrer)}` : '',
  ]
    .filter((l) => l !== '')
    .join('\n');

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chat,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
    signal: AbortSignal.timeout(4000),
  });
}
