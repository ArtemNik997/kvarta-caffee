const KEY = 'kvarta_attr';
const PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'yclid',
  'fbclid',
  'ad_id',
  'adset_id',
  'campaign_id',
] as const;

export type Attribution = Partial<
  Record<(typeof PARAMS)[number] | 'referrer' | 'landing' | 'page', string>
>;

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
    saved = JSON.parse(localStorage.getItem(KEY) ?? '{}');
  } catch {}
  return {
    ...saved,
    page: (location.pathname + location.search).slice(0, 500),
  };
}
