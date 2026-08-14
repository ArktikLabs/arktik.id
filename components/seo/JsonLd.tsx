/* Server-rendered JSON-LD. One script tag per page carrying an @graph.
 *
 * JSON.stringify output is escaped for `<` so a string in the data can never
 * close the script element early — the standard XSS guard for inline JSON-LD. */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
