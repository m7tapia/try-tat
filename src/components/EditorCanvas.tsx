import {
  useState,
  type CSSProperties,
  type PointerEvent,
  type RefObject,
} from "react";
import type { ImageAsset, PhotoRect, TattooTransform } from "../types";
import { getRenderedScale } from "../transform";
import { FullPreview } from "./FullPreview";

type EditorCanvasProps = {
  photo: ImageAsset | null;
  tattoo: ImageAsset | null;
  transform: TattooTransform;
  photoRect: PhotoRect | null;
  ready: boolean;
  dragging: boolean;
  workspaceRef: RefObject<HTMLDivElement | null>;
  photoRef: RefObject<HTMLImageElement | null>;
  onDragStart: (event: PointerEvent<HTMLImageElement>) => void;
  onDragMove: (clientX: number, clientY: number) => void;
  onDragEnd: () => void;
};

export function EditorCanvas({
  photo,
  tattoo,
  transform,
  photoRect,
  ready,
  dragging,
  workspaceRef,
  photoRef,
  onDragStart,
  onDragMove,
  onDragEnd,
}: EditorCanvasProps) {
  const [showFullPreview, setShowFullPreview] = useState(false);

  return (
    <>
      <div className="canvas-column">
        <div
          className={`workspace ${photo ? "has-photo" : ""}`}
          ref={workspaceRef}
          data-testid="workspace"
        >
          {photo ? (
            <button
              className="photo-trigger"
              type="button"
              onClick={() => setShowFullPreview(true)}
              aria-label="Open the complete photo preview"
            >
              <img
                ref={photoRef}
                className="photo"
                src={photo.url}
                alt="Your uploaded placement photo"
                draggable={false}
                onLoad={() => window.dispatchEvent(new Event("resize"))}
              />
            </button>
          ) : (
            <EmptyCanvas />
          )}

          {ready && tattoo && photoRect && (
            <img
              className={`tattoo ${dragging ? "is-dragging" : ""}`}
              data-testid="tattoo-layer"
              src={tattoo.url}
              alt="Movable tattoo overlay"
              draggable={false}
              onPointerDown={onDragStart}
              onPointerMove={(event) => {
                if (dragging) onDragMove(event.clientX, event.clientY);
              }}
              onPointerUp={onDragEnd}
              onPointerCancel={onDragEnd}
              style={getTattooStyle(photoRect, transform)}
            />
          )}

          {photo && (
            <button
              className="full-preview-button"
              type="button"
              onClick={() => setShowFullPreview(true)}
            >
              View preview
            </button>
          )}
        </div>

      </div>

      {showFullPreview && photo && (
        <FullPreview
          photo={photo}
          tattoo={tattoo}
          transform={transform}
          onClose={() => setShowFullPreview(false)}
        />
      )}
    </>
  );
}

function EmptyCanvas() {
  return (
    <div className="empty-state">
      <span className="empty-mark" aria-hidden="true">✦</span>
      <h2>Your canvas is waiting</h2>
      <p>Choose a JPG, PNG, or HEIC photo from the panel to begin.</p>
    </div>
  );
}

function getTattooStyle(
  photoRect: PhotoRect,
  transform: TattooTransform,
): CSSProperties {
  return {
    left: photoRect.left + (photoRect.width * transform.position.x) / 100,
    top: photoRect.top + (photoRect.height * transform.position.y) / 100,
    width: (photoRect.width * getRenderedScale(transform.scale)) / 100,
    opacity: transform.opacity / 100,
    transform: `translate(-50%, -50%) rotate(${transform.rotation}deg)`,
  };
}
