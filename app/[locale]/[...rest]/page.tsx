/* Any path no other route matches (e.g. /xyz/, /en/xyz/) lands here and renders [locale]/not-found.tsx, which has
 * the site header and footer. Without this catch-all Next shows its bare built-in 404 (no menu, English). */
import { notFound } from "next/navigation";

export default function CatchAll() {
  notFound();
}
