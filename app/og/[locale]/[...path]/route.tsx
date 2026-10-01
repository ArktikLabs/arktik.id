import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { ogCards } from "@/lib/seo/og-cards";

export const dynamic = "force-static";
export const dynamicParams = false;

const LOCALES = ["id", "en"] as const;

export async function generateStaticParams() {
  const params: { locale: string; path: string[] }[] = [];
  for (const locale of LOCALES) {
    for (const key of (await ogCards(locale)).keys()) {
      params.push({ locale, path: key.split("/") });
    }
  }
  return params;
}

const font = (f: string) => readFile(path.join(process.cwd(), "assets/fonts", f));

const CARBON = "#090E0A";
const INK = "#F2F6F3";
const INK2 = "#B4BDB6";
const LIME = "#DDFE55";
const RULE = "#262E28";

function titleSize(t: string) {
  if (t.length <= 34) return 78;
  if (t.length <= 52) return 66;
  if (t.length <= 72) return 56;
  return 48;
}

const clip = (s: string | undefined, n: number) =>
  !s ? undefined : s.length <= n ? s : `${s.slice(0, n).replace(/\s+\S*$/, "")}…`;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string; path: string[] }> },
) {
  const { locale, path: parts } = await params;
  const card = (await ogCards(locale)).get(parts.join("/"));
  if (!card) return new Response("Not found", { status: 404 });

  const [archivo, instrument, logo] = await Promise.all([
    font("Archivo-Bold.ttf"),
    font("InstrumentSans-Regular.ttf"),
    readFile(path.join(process.cwd(), "public/assets/logo.svg")),
  ]);
  const logoSrc = `data:image/svg+xml;base64,${logo.toString("base64")}`;
  const subtitle = clip(card.subtitle, 130);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: CARBON,
          padding: "72px 88px",
          border: `1px solid ${RULE}`,
          fontFamily: "Instrument Sans",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={120} height={36} alt="" />
          <span style={{ color: INK2, fontSize: 22 }}>arktik.id</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              color: LIME,
              fontSize: 22,
              letterSpacing: 2.5,
              textTransform: "uppercase",
              marginBottom: 22,
            }}
          >
            {card.label}
          </span>
          <span
            style={{
              color: INK,
              fontFamily: "Archivo",
              fontSize: titleSize(card.title),
              lineHeight: 1.02,
              letterSpacing: -1.5,
              maxWidth: 1000,
            }}
          >
            {card.title}
          </span>
          <div style={{ width: 160, height: 6, background: LIME, marginTop: 30 }} />
        </div>

        <span style={{ color: INK2, fontSize: 26, lineHeight: 1.4, maxWidth: 960, minHeight: 36 }}>
          {subtitle ?? ""}
        </span>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Archivo", data: archivo, weight: 700, style: "normal" },
        { name: "Instrument Sans", data: instrument, weight: 400, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800" },
    },
  );
}
