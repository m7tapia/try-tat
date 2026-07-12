import { getRenderedScale } from "./transform";
import type { ImageAsset, TattooTransform } from "./types";

export async function downloadComposition(
  photo: ImageAsset,
  tattoo: ImageAsset | null,
  transform: TattooTransform,
) {
  const [photoImage, tattooImage] = await Promise.all([
    loadImage(photo.url),
    tattoo ? loadImage(tattoo.url) : Promise.resolve(null),
  ]);
  const canvas = document.createElement("canvas");
  canvas.width = photo.width;
  canvas.height = photo.height;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Your browser could not prepare the download.");

  context.drawImage(photoImage, 0, 0, canvas.width, canvas.height);

  if (tattoo && tattooImage) {
    const tattooWidth = (canvas.width * getRenderedScale(transform.scale)) / 100;
    const tattooHeight = tattooWidth * (tattoo.height / tattoo.width);

    context.save();
    context.globalAlpha = transform.opacity / 100;
    context.translate(
      (canvas.width * transform.position.x) / 100,
      (canvas.height * transform.position.y) / 100,
    );
    context.rotate((transform.rotation * Math.PI) / 180);
    context.drawImage(
      tattooImage,
      -tattooWidth / 2,
      -tattooHeight / 2,
      tattooWidth,
      tattooHeight,
    );
    context.restore();
  }

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => result
        ? resolve(result)
        : reject(new Error("Your browser could not create the JPEG file.")),
      "image/jpeg",
      0.92,
    );
  });
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = "trytat-preview.jpg";
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);
}

async function loadImage(url: string) {
  const image = new Image();
  image.src = url;
  await image.decode();
  return image;
}
