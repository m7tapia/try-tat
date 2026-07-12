import type { ImageRole } from "./types";

export async function validateImageFile(file: File, role: ImageRole, image: HTMLImageElement): Promise<void> {
  if (role === "photo" && !isSupportedPhoto(file)) {
    throw new Error("Photos must be a JPG, PNG, HEIC, or HEIF file.");
  }

  if (role === "tattoo" && !isPng(file)) {
    throw new Error("Tattoo artwork must be a PNG file.");
  }

  if (!image.naturalWidth || !image.naturalHeight) {
    throw new Error("That image could not be decoded.");
  }

  if (role === "tattoo" && !(await hasTransparency(image))) {
    throw new Error("Tattoo artwork needs to be a transparent PNG.");
  }
}

export function isHeic(file: File) {
  return hasFileType(file, ["image/heic", "image/heif"], [".heic", ".heif"]);
}

function isSupportedPhoto(file: File) {
  return hasFileType(
    file,
    ["image/jpeg", "image/png", "image/heic", "image/heif"],
    [".jpg", ".jpeg", ".png", ".heic", ".heif"],
  );
}

function isPng(file: File) {
  return hasFileType(file, ["image/png"], [".png"]);
}

function hasFileType(file: File, mimeTypes: string[], extensions: string[]) {
  const normalizedType = file.type.toLowerCase();
  const normalizedName = file.name.toLowerCase();

  return (
    mimeTypes.includes(normalizedType) ||
    extensions.some((extension) => normalizedName.endsWith(extension))
  );
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
