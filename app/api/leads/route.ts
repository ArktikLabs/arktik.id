import { NextResponse } from "next/server";

type LeadPayload = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  source?: string;
  page?: string;
  referrer?: string;
  userAgent?: string;
  eventId?: string;
  locale?: string;
};

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as LeadPayload;
    const receivedAt = new Date().toISOString();

    // Minimal validation: ensure payload is an object
    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON" },
        { status: 400 }
      );
    }

    // Determine environment: production uses the prod webhook; otherwise staging
    const vercelEnv = process.env.VERCEL_ENV; // 'production' | 'preview' | 'development'
    const nodeEnv = process.env.NODE_ENV; // 'production' | 'development' | 'test'
    const isProd = vercelEnv
      ? vercelEnv === "production"
      : nodeEnv === "production";

    const webhookUrl = process.env.LEAD_WEBHOOK_URL?.trim();
    if (!webhookUrl) {
      return NextResponse.json(
        { ok: false, error: "Webhook URL not configured" },
        { status: 500 }
      );
    }
    // Build payload with server-side metadata for observability
    const headers = Object.fromEntries(request.headers.entries());
    const ip = headers["x-forwarded-for"]?.split(",")[0]?.trim();
    const userAgent = headers["user-agent"] ?? data.userAgent;
    const page = data.page;
    const referrer = headers["referer"] ?? data.referrer;

    const forwardPayload = {
      ...data,
      receivedAt,
      env: isProd ? "production" : vercelEnv ?? nodeEnv ?? "unknown",
      ip,
      userAgent,
      page,
      referrer,
    } as const;

    // Forward to n8n; don't block user on network errors
    let forwarded = false;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(forwardPayload),
        signal: controller.signal,
        // cache: 'no-store' // not necessary, but explicitness ok
      });
      clearTimeout(timeout);
      forwarded = res.ok;
    } catch (e) {
      // swallow network errors; surface in response for observability
      forwarded = false;
    }

    return NextResponse.json(
      { ok: true, receivedAt, forwarded },
      { status: 202 }
    );
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Failed to parse request" },
      { status: 400 }
    );
  }
}
