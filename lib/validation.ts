import { z } from 'zod';

/** Принимает: +375 29 123-45-67 · 375291234567 · 80291234567 · 291234567 */
export function normalizeBYPhone(input: string): string | null {
  const d = input.replace(/\D/g, '');
  let n: string | null = null;
  if (d.length === 12 && d.startsWith('375')) n = d;
  else if (d.length === 11 && d.startsWith('80')) n = '375' + d.slice(2);
  else if (d.length === 9) n = '375' + d;
  if (!n) return null;
  // мобильные A1/МТС/life:) + Минск (17)
  return /^375(25|29|33|44|17)\d{7}$/.test(n) ? '+' + n : null;
}

export const INTERESTS = ['subscription', 'one-time', 'question'] as const;

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
  name: z.string().trim().min(2, 'Как к вам обращаться?').max(60),
  phone: z.string().trim().min(1, 'Введите телефон').max(30),
  interest: z.enum(INTERESTS),
  comment: z.string().trim().max(500).optional().default(''),
  website: z.string().optional(), // honeypot
  attribution: attributionSchema.optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
