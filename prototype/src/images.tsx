import { cloneElement } from "react";
import type { ReactElement } from "react";
import manifest from "./image-manifest.json";

// Responsive image attributes for a source path under /images. The manifest is
// produced by scripts/build-images.mjs (run automatically before dev and
// build). Unknown paths fall back to the original file, so a missing variant
// degrades to the previous behaviour rather than a broken image.
type Manifest = Record<string, { widths: number[]; sourceWidth: number }>;
const variants = manifest as Manifest;

export interface ResponsiveImage {
  src: string;
  srcSet?: string;
  sizes?: string;
}

function variant(source: string, width: number): string {
  return source.replace(/\.(jpe?g|png)$/i, `.w${width}.webp`);
}

// `sizes` tells the browser how wide the image will render so it can pick the
// smallest adequate candidate, e.g. "(max-width: 850px) 50vw, 30vw".
export function responsive(source: string, sizes: string): ResponsiveImage {
  const entry = variants[source];
  if (!entry || entry.widths.length === 0) return { src: source };
  const widths = [...entry.widths].sort((a, b) => a - b);
  return {
    src: variant(source, widths[Math.min(1, widths.length - 1)]),
    srcSet: widths.map((w) => `${variant(source, w)} ${w}w`).join(", "),
    sizes,
  };
}

// Largest available variant, for lightbox previews.
export function fullSize(source: string): string {
  const entry = variants[source];
  if (!entry || entry.widths.length === 0) return source;
  return variant(source, Math.max(...entry.widths));
}

// Fixed-width thumbnail (table cells): the smallest variant at or above the
// requested CSS width times a 2x pixel ratio.
export function thumbnail(source: string, cssWidth: number): string {
  const entry = variants[source];
  if (!entry || entry.widths.length === 0) return source;
  const target = cssWidth * 2;
  const fit = [...entry.widths].sort((a, b) => a - b).find((w) => w >= target);
  return variant(source, fit ?? Math.max(...entry.widths));
}

// Ant Design's Image forwards srcSet and sizes to the lightbox image, so the
// browser would pick the small grid variant there too. Rendering the lightbox
// image without them lets its full-size src win. Pass as
// preview={{ imageRender: previewImageRender }} on Image or Image.PreviewGroup.
export function previewImageRender(node: ReactElement): ReactElement {
  return cloneElement(node as ReactElement<Record<string, unknown>>, {
    srcSet: undefined,
    sizes: undefined,
  });
}
