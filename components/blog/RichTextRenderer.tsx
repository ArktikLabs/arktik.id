/* Hallmark · design-system: design.md */
import Image from "next/image";
import ReactMarkdown, { type Components } from "react-markdown";

interface RichTextRendererProps {
  content: string;
}

/* Class map keeps the typography consistent for markdown-sourced content. */
const components: Components = {
  h1: ({ children }) => (
    <h1 className="font-heading text-3xl font-bold mb-6 mt-10 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-heading text-2xl font-bold mb-4 mt-10">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-heading text-xl font-bold mb-3 mt-8">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="font-heading text-lg font-bold mb-3 mt-6">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="mb-5 leading-relaxed text-ink-2">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-5 ml-6 list-outside list-disc space-y-2 text-ink-2 marker:text-lime-green">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-5 ml-6 list-outside list-decimal space-y-2 text-ink-2 marker:text-lime-green">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-2">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-8 border-l-2 border-lime-green pl-5 italic text-ink">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-rule" />,
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-lime-green underline underline-offset-4 transition-colors duration-200 hover:text-lime-green/80"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  img: ({ src, alt }) =>
    src ? (
      /* ponytail: fixed 1200x675 intrinsic size as a fallback; h-auto keeps
       * the real ratio once loaded. Read dims from disk if CLS is ever
       * measured to matter. */
      <Image
        src={String(src)}
        alt={alt ?? ""}
        width={1200}
        height={675}
        sizes="(max-width: 768px) 100vw, 64ch"
        className="my-6 h-auto w-full rounded-card"
      />
    ) : null,
};

export function RichTextRenderer({ content }: RichTextRendererProps) {
  return (
    <div>
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
}
