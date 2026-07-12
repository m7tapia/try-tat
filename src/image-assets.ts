import type { ImageAsset, ImageRole } from "./types";
import { isHeic, validateImageFile } from "./validation";

export async function loadImageAsset(
  file: File,
  role: ImageRole,
): Promise<ImageAsset> {
  const displayBlob = await getDisplayBlob(file, role);
  const url = URL.createObjectURL(displayBlob);

  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    await validateImageFile(file, role, image);

    return {
      file,
      url,
      width: image.naturalWidth,
      height: image.naturalHeight,
    };
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
}

async function getDisplayBlob(file: File, role: ImageRole) {
  if (role !== "photo" || !isHeic(file)) return file;

  try {
    const { default: heic2any } = await import("heic2any");
    const converted = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.92,
    });

    return Array.isArray(converted) ? converted[0] : converted;
  } catch {
    throw new Error("That HEIC photo could not be converted. Try a JPG or PNG instead.");
  }
}
