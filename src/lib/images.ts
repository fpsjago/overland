/* OVERLAND — build-time responsive images
   ============================================================
   Every photograph lives in src/assets/images/. Content files keep
   referring to them with short strings like "_assets/dest-alaska.jpg"
   (no schema change needed): this helper resolves the FILE NAME against
   src/assets/images, then has Astro emit resized WebP variants.

   Server-only: call it from .astro frontmatter and pass the result to
   components as props. A missing file fails the build with the name of
   the file, instead of shipping a broken image.
   ============================================================ */
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import type { ResponsiveImage } from '../types';

const sources = import.meta.glob<{ default: ImageMetadata }>('/src/assets/images/*.{jpg,jpeg,png,webp}', {
  eager: true,
});

const byName = new Map<string, ImageMetadata>(
  Object.entries(sources).map(([path, mod]) => [path.slice(path.lastIndexOf('/') + 1), mod.default]),
);

/**
 * @param path    Content-style path, e.g. "_assets/dest-alaska.jpg".
 * @param widths  Candidate widths in px; anything above the source width is
 *                clamped, so asking for 1600 on an 800px photo is safe.
 * @param quality WebP quality, 1–100.
 */
export async function responsiveImage(path: string, widths: number[], quality = 62): Promise<ResponsiveImage> {
  const name = path.slice(path.lastIndexOf('/') + 1);
  const meta = byName.get(name);
  if (!meta) {
    throw new Error(`[images] "${name}" is not in src/assets/images (referenced as "${path}")`);
  }
  const usable = [...new Set(widths.map((w) => Math.min(w, meta.width)))].sort((a, b) => a - b);
  const variants = await Promise.all(
    usable.map((width) => getImage({ src: meta, width, format: 'webp', quality })),
  );
  const largest = variants[variants.length - 1];
  if (!largest) throw new Error(`[images] no widths requested for "${name}"`);
  return {
    src: largest.src,
    srcset: variants.map((img, i) => `${img.src} ${usable[i]}w`).join(', '),
    width: meta.width,
    height: meta.height,
  };
}

/** A single JPEG URL sized for Open Graph / Twitter cards (1200px wide). */
export async function socialImage(path: string): Promise<string> {
  const name = path.slice(path.lastIndexOf('/') + 1);
  const meta = byName.get(name);
  if (!meta) throw new Error(`[images] "${name}" is not in src/assets/images (referenced as "${path}")`);
  const img = await getImage({ src: meta, width: Math.min(1200, meta.width), format: 'jpg', quality: 80 });
  return img.src;
}
