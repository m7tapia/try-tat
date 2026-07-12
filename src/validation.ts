import type { ImageRole } from "./types";

const MAX_PIXELS =30_000_000;

export async function validateImageFile(file: File, role: ImageRole, image: HTMLImageElement): Promise<void> {
  if (file.type !== "image/png") {
    const subject = role === "photo" ? "Photos" : "Tattoo artwork";
    throw new Error(`${subject} must be a PNG file.`);
  }

  if (!image.naturalWidth || !image.naturalHeight) {
    throw new Error("That PNG could not be decoded.");
  }

  const pixelCount = image.naturalWidth * image.naturalHeight;
  if (role === "photo" && pixelCount > MAX_PIXELS) {
    throw new Error("That photo is over 20 megapixels. Choose a smaller PNG.");
  }

  if (role === "tattoo" && !(await hasTransparency(image))) {
    throw new Error("Tattoo artwork needs a transparent background.");
  }
}

async function hasTransparency(image: HTMLImageElement): Promise<boolean> {
  const canvas = document.createElement("canvas");
  const ratio = Math.min(1, 256 / Math.max(image.naturalWidth, image.naturalHeight));
  canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio));
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    throw new Error("Your browser could not inspect that PNG.");
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;

  for (let index = 3; index < pixels.length; index += 4) {
    if (pixels[index] < 250) return true;
  }

  return false;
}
