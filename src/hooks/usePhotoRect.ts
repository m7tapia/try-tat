import { useEffect, useState, type RefObject } from "react";
import type { ImageAsset, PhotoRect } from "../types";

export function usePhotoRect(
  photo: ImageAsset | null,
  workspaceRef: RefObject<HTMLDivElement | null>,
  photoRef: RefObject<HTMLImageElement | null>,
) {
  const [photoRect, setPhotoRect] = useState<PhotoRect | null>(null);

  useEffect(() => {
    function measurePhoto() {
      const workspaceBounds = workspaceRef.current?.getBoundingClientRect();
      const photoBounds = photoRef.current?.getBoundingClientRect();

      if (!workspaceBounds || !photoBounds) {
        setPhotoRect(null);
        return;
      }

      setPhotoRect({
        left: photoBounds.left - workspaceBounds.left,
        top: photoBounds.top - workspaceBounds.top,
        width: photoBounds.width,
        height: photoBounds.height,
      });
    }

    measurePhoto();
    window.addEventListener("resize", measurePhoto);

    return () => window.removeEventListener("resize", measurePhoto);
  }, [photo, photoRef, workspaceRef]);

  return photoRect;
}
