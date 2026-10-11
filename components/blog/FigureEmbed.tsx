"use client";
/* Hallmark · design-system: design.md
 * An interactive explainer figure inside an article. Markdown writes it as an
 * image whose src is a self-contained page under /assets/figures/:
 *   ![What the figure shows](/assets/figures/<name>.html)
 * The page posts { type: "arktik-figure-height", height } to its parent, so
 * the frame grows to fit and never scrolls or clips. The alt text stays as the
 * frame's title, and the article text carries the argument, so nothing is lost
 * to readers or crawlers that skip the frame. */
import { useEffect, useRef, useState } from "react";

export function FigureEmbed({ src, title }: { src: string; title: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(560);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.source !== frame.current?.contentWindow) return;
      const data = event.data as { type?: string; height?: number };
      if (data?.type !== "arktik-figure-height" || typeof data.height !== "number") return;
      setHeight(Math.min(Math.max(Math.ceil(data.height), 200), 2000));
    };
    window.addEventListener("message", onMessage);
    /* The figure may post its first height before this page hydrates, so also
     * measure it directly once it has loaded (same origin). */
    const measure = () => {
      const main = frame.current?.contentDocument?.querySelector("main");
      if (main) setHeight(Math.min(Math.max(Math.ceil(main.getBoundingClientRect().height) + 2, 200), 2000));
    };
    const el = frame.current;
    if (el?.contentDocument?.readyState === "complete") measure();
    el?.addEventListener("load", measure);
    return () => {
      window.removeEventListener("message", onMessage);
      el?.removeEventListener("load", measure);
    };
  }, []);

  return (
    <iframe
      ref={frame}
      src={src}
      title={title}
      loading="lazy"
      scrolling="no"
      sandbox="allow-scripts allow-same-origin"
      className="my-8 block w-full border-0"
      style={{ height }}
    />
  );
}
