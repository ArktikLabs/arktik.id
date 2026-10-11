/* Server-safe: the renderer decides on the server whether an image src is an
 * interactive figure, before handing it to the client FigureEmbed. */
export const FIGURES = "/assets/figures/";

export const isFigureSrc = (src: string) =>
  src.startsWith(FIGURES) && src.endsWith(".html") && !src.includes("..");
