/** Card URL for a page path; "" (home) maps to the "home" key. Kept apart from
 * og-cards.ts so metadata code does not pull in the content loaders. */
export function ogCardPath(locale: string, path: string) {
  const key = path.replace(/^\/+|\/+$/g, "") || "home";
  return `/og/${locale === "en" ? "en" : "id"}/${key}/`;
}
