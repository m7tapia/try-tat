import type { ImageAsset, ImageRole } from "./types";
import { validateImageFile } from "./validation";

export async function loadImageAsset(
  file: File,
  role: ImageRole,
): Promise<ImageAsset> {
  const url = URL.createObjectURL(file);

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
