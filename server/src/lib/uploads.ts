import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

// Uploaded images are re-encoded as WebP (small for slow networks) and stored on disk.
// They're served by app/uploads/[...file]/route.ts because files added after build aren't served from public/.

export function uploadDir() {
  return path.resolve(process.env.UPLOAD_DIR ?? "./uploads");
}

const PRESETS = {
  // Product images: transparent square, prize fills the frame.
  prize: { width: 600, height: 600, fit: "contain" as const, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  // Winner photos: square crop.
  photo: { width: 400, height: 400, fit: "cover" as const, background: { r: 255, g: 255, b: 255, alpha: 1 } },
};

/** Saves an uploaded image and returns its public path, or null if no file was chosen. */
export async function saveImage(file: File | null, kind: keyof typeof PRESETS): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (!file.type.startsWith("image/")) throw new Error("Please upload an image file.");
  const p = PRESETS[kind];
  const input = Buffer.from(await file.arrayBuffer());
  const output = await sharp(input).rotate().resize(p.width, p.height, { fit: p.fit, background: p.background }).webp({ quality: 82 }).toBuffer();
  const name = `${kind}-${Date.now()}-${randomBytes(4).toString("hex")}.webp`;
  await mkdir(uploadDir(), { recursive: true });
  await writeFile(path.join(uploadDir(), name), output);
  return `/uploads/${name}`;
}
