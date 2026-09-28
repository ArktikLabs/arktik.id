import { NextResponse } from "next/server";

// Contact-form leads. Forwards to the lead receiver on Arktik's VPS (https://hooks.arktik.id/leads), which stores the
// lead first and then notifies the team on Telegram, retrying until it gets through. The old n8n webhook
// (LEAD_WEBHOOK_URL) is retired and deliberately NOT read here, so a stale Vercel env can't send leads to a dead host.
// Unlike the old fire-and-forget version this answers honestly: the form shows "sent" only when the lead was stored.
const ENDPOINT = process.env.LEAD_RECEIVER_URL?.trim() || "https://hooks.arktik.id/leads";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = (await request.json()) as Record<string, unknown>;
    if (!data || typeof data !== "object") throw new Error("not an object");
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const lead = {
    name: str(data.name, 120),
    email: str(data.email, 200),
    phone: str(data.phone, 40),
    company: str(data.company, 160),
    message: str(data.message, 5000),
    website: str(data.website, 200), // honeypot; the receiver drops the lead when it is filled
    locale: str(data.locale, 5),
    page: str(data.page, 300),
    eventId: str(data.eventId, 64),
    source: "contact_form",
    referrer: str(data.referrer, 500),
    userAgent: str(request.headers.get("user-agent"), 400),
    ip: str(request.headers.get("x-forwarded-for")?.split(",")[0], 64),
  };
  if (!lead.name || !EMAIL.test(lead.email) || lead.message.length < 5) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.LEAD_WEBHOOK_SECRET
          ? { "x-lead-secret": process.env.LEAD_WEBHOOK_SECRET }
          : {}),
      },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (res.status === 429 || res.status === 422) {
      return NextResponse.json(
        { ok: false, error: res.status === 429 ? "rate_limited" : "invalid" },
        { status: res.status },
      );
    }
    if (!res.ok) return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
    return NextResponse.json({ ok: true }, { status: 202 });
  } catch {
    return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
  }
}
