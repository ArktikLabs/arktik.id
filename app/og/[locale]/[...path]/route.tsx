import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { ogCards, type OgCard } from "@/lib/seo/og-cards";

export const dynamic = "force-static";
export const dynamicParams = false;

const LOCALES = ["id", "en"] as const;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    [...ogCards(locale).keys()].map((key) => ({ locale, path: key.split("/") })),
  );
}

/* Site tokens (tokens.css, oklch -> sRGB). */
const PAPER = "#090E0A";
const PAPER2 = "#131914";
const INK = "#F2F6F3";
const INK2 = "#A7AFA8";
const INK3 = "#848B85";
const RULE = "#252C26";
const ACCENT = "#DDFE55";

const file = (...p: string[]) => readFile(path.join(process.cwd(), ...p));

/* Display size steps: Archivo 700 at 0.95 leading, -0.03em, like --text-display. */
function displaySize(t: string, wide: boolean) {
  const n = t.length;
  if (wide) return n <= 30 ? 84 : n <= 48 ? 72 : n <= 64 ? 62 : 54;
  return n <= 14 ? 84 : n <= 28 ? 66 : n <= 44 ? 56 : 48;
}

const clip = (s: string | undefined, n: number) =>
  !s ? "" : s.length <= n ? s : `${s.slice(0, n).replace(/[\s,.;:]+\S*$/, "")}…`;

function Label({ children }: { children: string }) {
  return (
    <span
      style={{
        fontFamily: "Geist Mono",
        fontSize: 21,
        letterSpacing: 2.1,
        textTransform: "uppercase",
        color: ACCENT,
      }}
    >
      {children}
    </span>
  );
}

function Title({ text, size }: { text: string; size: number }) {
  return (
    <span
      style={{
        fontFamily: "Archivo",
        fontSize: size,
        lineHeight: 0.95,
        letterSpacing: -0.03 * size,
        color: INK,
      }}
    >
      {text}
    </span>
  );
}

/* The drawn accent rule under the display line (section-head pattern). */
const Rule = () => <div style={{ width: 132, height: 6, background: ACCENT, marginTop: 34 }} />;

function Footer({ logo, right }: { logo: string; right?: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderTop: `1px solid ${RULE}`,
        paddingTop: 30,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo} width={110} height={33} alt="" />
      <span style={{ fontFamily: "Geist Mono", fontSize: 20, letterSpacing: 2, textTransform: "uppercase", color: INK3 }}>
        {right ? `${right}  ·  arktik.id` : "arktik.id"}
      </span>
    </div>
  );
}

function Card({ card, logo, shot }: { card: OgCard; logo: string; shot?: string }) {
  const frame = {
    width: "100%",
    height: "100%",
    display: "flex",
    background: PAPER,
    fontFamily: "Instrument Sans",
    color: INK,
  } as const;

  if (card.kind === "home") {
    return (
      <div style={{ ...frame, flexDirection: "column", justifyContent: "space-between", padding: "64px 72px 52px" }}>
        <Label>{card.label}</Label>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Title text={card.lead} size={104} />
          <div style={{ display: "flex", flexWrap: "wrap", marginTop: 6 }}>
            <span style={{ fontFamily: "Archivo", fontSize: 104, lineHeight: 0.95, letterSpacing: -3.1, color: INK }}>
              {card.connector}&nbsp;
            </span>
            <span style={{ fontFamily: "Archivo", fontSize: 104, lineHeight: 0.95, letterSpacing: -3.1, color: ACCENT }}>
              {card.accent}
            </span>
          </div>
          <Rule />
          <span style={{ marginTop: 30, fontFamily: "Geist Mono", fontSize: 21, letterSpacing: 1.2, color: INK2 }}>
            {card.subtitle}
          </span>
        </div>
        <Footer logo={logo} />
      </div>
    );
  }

  if (card.kind === "work" && shot) {
    return (
      <div style={frame}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 560, padding: "64px 0 56px 72px" }}>
          <Label>{card.label}</Label>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Title text={card.title} size={displaySize(card.title, false)} />
            <Rule />
            <span style={{ marginTop: 30, fontSize: 23, lineHeight: 1.4, color: INK2, maxWidth: 440 }}>
              {clip(card.subtitle, 150)}
            </span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={110} height={33} alt="" />
        </div>
        <div style={{ display: "flex", flex: 1, padding: "64px 0 64px 24px", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              width: 640,
              height: 502,
              borderRadius: 14,
              border: `1px solid ${RULE}`,
              background: PAPER2,
              overflow: "hidden",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={shot} width={640} height={502} alt="" style={{ objectFit: "cover", objectPosition: "top left" }} />
          </div>
        </div>
      </div>
    );
  }

  /* article, section, or a work card whose screenshot is missing (text-only
   * fallback so a new product/showcase never breaks the build). */
  const subtitle = card.kind === "section" || card.kind === "work" ? clip(card.subtitle, 120) : "";
  return (
    <div style={{ ...frame, flexDirection: "column", justifyContent: "space-between", padding: "64px 72px 52px" }}>
      <Label>{card.label}</Label>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 1020 }}>
        <Title text={card.title} size={displaySize(card.title, true)} />
        <Rule />
        {subtitle ? (
          <span style={{ marginTop: 30, fontSize: 27, lineHeight: 1.4, color: INK2, maxWidth: 900 }}>{subtitle}</span>
        ) : null}
      </div>
      <Footer logo={logo} right={card.kind === "article" ? card.meta : undefined} />
    </div>
  );
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string; path: string[] }> },
) {
  const { locale, path: parts } = await params;
  const card = ogCards(locale).get(parts.join("/"));
  if (!card) return new Response("Not found", { status: 404 });

  const [archivo, instrument, mono, logo, shot] = await Promise.all([
    file("assets/fonts/Archivo-Bold.ttf"),
    file("assets/fonts/InstrumentSans-Regular.ttf"),
    file("assets/fonts/GeistMono-Regular.ttf"),
    file("public/assets/logo.svg"),
    card.kind === "work"
      ? file("assets/og-shots", `${card.shot}.jpg`).catch(() => {
          console.warn(`[og] assets/og-shots/${card.shot}.jpg missing; using the text card`);
          return undefined;
        })
      : Promise.resolve(undefined),
  ]);

  return new ImageResponse(
    (
      <Card
        card={card}
        logo={`data:image/svg+xml;base64,${logo.toString("base64")}`}
        shot={shot ? `data:image/jpeg;base64,${shot.toString("base64")}` : undefined}
      />
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Archivo", data: archivo, weight: 700, style: "normal" },
        { name: "Instrument Sans", data: instrument, weight: 400, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
