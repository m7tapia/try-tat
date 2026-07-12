import { useEffect, type CSSProperties } from "react";
import { getRenderedScale } from "../transform";
import type { ImageAsset, TattooTransform } from "../types";

type FullPreviewProps = {
  photo: ImageAsset;
  tattoo: ImageAsset | null;
  transform: TattooTransform;
  onClose: () => void;
};

export function FullPreview({
  photo,
  tattoo,
  transform,
  onClose,
}: FullPreviewProps) {
  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  const aspectRatio = photo.width / photo.height;
  const compositionStyle: CSSProperties = {
    aspectRatio: `${photo.width} / ${photo.height}`,
    width: `min(calc(100vw - var(--preview-gutter)), calc((100vh - var(--preview-vertical-space)) * ${aspectRatio}))`,
  };

  return (
    <div
      className="full-preview"
      role="dialog"
      aria-modal="true"
      aria-label="Full photo preview"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="full-preview-header">
        <div>
          <strong>Full photo preview</strong>
          <span>Screenshot to save</span>
        </div>
        <button type="button" onClick={onClose} autoFocus>
          Close
        </button>
      </div>

      <div className="full-preview-composition" style={compositionStyle}>
        <img
          className="full-preview-photo"
          src={photo.url}
          alt="Your complete uploaded photo"
          draggable={false}
        />

        {tattoo && (
          <img
            className="full-preview-tattoo"
            src={tattoo.url}
            alt="Tattoo overlay"
            draggable={false}
            style={{
              left: `${transform.position.x}%`,
              top: `${transform.position.y}%`,
              width: `${getRenderedScale(transform.scale)}%`,
              opacity: transform.opacity / 100,
              transform: `translate(-50%, -50%) rotate(${transform.rotation}deg)`,
            }}
          />
        )}
      </div>

      <p className="full-preview-hint">
        Press Escape, click outside the photo, or use Close to return.
      </p>
    </div>
  );
}
