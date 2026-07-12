import { useEffect, useState, type RefObject } from "react";
import type { ImageAsset, PhotoRect } from "../types";

export function usePhotoRect(
  photo: ImageAsset | null,
  workspaceRef: RefObject<HTMLDivElement | null>,
) {
  const [photoRect, setPhotoRect] = useState<PhotoRect | null>(null);

  useEffect(() => {
    function measurePhoto() {
      const workspaceBounds = workspaceRef.current?.getBoundingClientRect();

      if (!workspaceBounds || !photo) {
        setPhotoRect(null);
        return;
      }

      const fitScale = Math.min(
        workspaceBounds.width / photo.width,
        workspaceBounds.height / photo.height,
      );
      const width = photo.width * fitScale;
      const height = photo.height * fitScale;

      setPhotoRect({
        left: (workspaceBounds.width - width) / 2,
        top: (workspaceBounds.height - height) / 2,
        width,
        height,
      });
    }

    measurePhoto();
    const resizeObserver = new ResizeObserver(measurePhoto);
    if (workspaceRef.current) resizeObserver.observe(workspaceRef.current);
    window.addEventListener("resize", measurePhoto);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measurePhoto);
    };
  }, [photo, workspaceRef]);

  return photoRect;
}
