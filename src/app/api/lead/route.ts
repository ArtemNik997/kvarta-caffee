import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function normalizeBelarusianPhone(value: string): string | null {
  const compactPhone = value.trim().replace(/[\s()-]/g, "");

  if (!/^\+?\d+$/.test(compactPhone)) {
    return null;
  }

  const digits = compactPhone.startsWith("+") ? compactPhone.slice(1) : compactPhone;
  const nationalNumber = digits.startsWith("375")
    ? digits.slice(3)
    : digits.startsWith("80")
      ? digits.slice(2)
      : digits;

  if (!/^\d{9}$/.test(nationalNumber)) {
    return null;
  }

  return `+375${nationalNumber}`;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Проверьте данные формы." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return Response.json({ error: "Проверьте данные формы." }, { status: 400 });
  }

  const { name, phone } = body as Record<string, unknown>;

  if (typeof name !== "string" || typeof phone !== "string") {
    return Response.json({ error: "Укажите имя и номер телефона." }, { status: 400 });
  }

  const customerName = name.trim();
  const normalizedPhone = normalizeBelarusianPhone(phone);

  if (customerName.length === 0 || customerName.length > 100) {
    return Response.json(
      { error: "Имя должно содержать от 1 до 100 символов." },
      { status: 400 },
    );
  }

  if (!normalizedPhone) {
    return Response.json(
      { error: "Введите корректный белорусский номер телефона." },
      { status: 400 },
    );
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not configured.");
    return Response.json(
      { error: "Сервис временно недоступен. Попробуйте позже." },
      { status: 503 },
    );
  }

  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    const { error } = await supabase.from("leads").insert({
      customer_name: customerName,
      phone: normalizedPhone,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Failed to save lead in Supabase:", error);
    return Response.json(
      { error: "Не удалось сохранить заявку. Попробуйте ещё раз." },
      { status: 500 },
    );
  }

  return Response.json({ success: true }, { status: 201 });
}
