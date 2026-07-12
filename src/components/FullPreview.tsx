import { useEffect, useState, type CSSProperties } from "react";
import { downloadComposition } from "../download-composition";
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
  const [downloadState, setDownloadState] = useState<"idle" | "saving" | "error">("idle");
  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousOverflow = document.body.style.overflow;
    const previousPosition = document.body.style.position;
    const previousWidth = document.body.style.width;
    const previousHeight = document.body.style.height;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.height = "100%";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousOverflow;
      document.body.style.position = previousPosition;
      document.body.style.width = previousWidth;
      document.body.style.height = previousHeight;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  const aspectRatio = photo.width / photo.height;
  const compositionStyle: CSSProperties = {
    aspectRatio: `${photo.width} / ${photo.height}`,
    width: `min(calc(100vw - var(--preview-gutter)), calc((100vh - var(--preview-vertical-space)) * ${aspectRatio}))`,
  };

  async function handleDownload() {
    setDownloadState("saving");

    try {
      await downloadComposition(photo, tattoo, transform);
      setDownloadState("idle");
    } catch {
      setDownloadState("error");
    }
  }

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
          <span>Download your preview</span>
        </div>
        <div className="full-preview-actions">
          <button
            type="button"
            className="download-button"
            onClick={() => void handleDownload()}
            disabled={downloadState === "saving"}
          >
            {downloadState === "saving" ? "Preparing…" : "Download JPEG"}
          </button>
          <button type="button" onClick={onClose} autoFocus>
            Close
          </button>
        </div>
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

      <p className="full-preview-hint" aria-live="polite">
        {downloadState === "error"
          ? "The download could not be created. Try again."
          : "Your JPEG includes the photo and tattoo only."}
      </p>
    </div>
  );
}
