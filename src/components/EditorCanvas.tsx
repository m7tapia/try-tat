import type React from "react";
import type { ImageAsset, PhotoRect, TattooTransform } from "../types";

type EditorCanvasProps = {
  photo: ImageAsset | null;
  tattoo: ImageAsset | null;
  transform: TattooTransform;
  photoRect: PhotoRect | null;
  ready: boolean;
  dragging: boolean;
  workspaceRef: React.RefObject<HTMLDivElement | null>;
  photoRef: React.RefObject<HTMLImageElement | null>;
  onDragStart: (event: React.PointerEvent<HTMLImageElement>) => void;
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
  return (
    <div className="canvas-column">
      <div
        className={`workspace ${photo ? "has-photo" : ""}`}
        ref={workspaceRef}
        data-testid="workspace"
      >
        {photo ? (
          <img
            ref={photoRef}
            className="photo"
            src={photo.url}
            alt="Your uploaded placement photo"
            draggable={false}
            onLoad={() => window.dispatchEvent(new Event("resize"))}
          />
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
      </div>

      <p className="canvas-note">
        {ready
          ? "Drag the tattoo directly on the photo."
          : "Your composition stays on this device."}
      </p>
    </div>
  );
}

function EmptyCanvas() {
  return (
    <div className="empty-state">
      <span className="empty-mark" aria-hidden="true">✦</span>
      <h2>Your canvas is waiting</h2>
      <p>Choose a PNG photo from the panel to begin.</p>
    </div>
  );
}

function getTattooStyle(
  photoRect: PhotoRect,
  transform: TattooTransform,
): React.CSSProperties {
  return {
    left: photoRect.left + (photoRect.width * transform.position.x) / 100,
    top: photoRect.top + (photoRect.height * transform.position.y) / 100,
    width: (photoRect.width * transform.scale) / 100,
    opacity: transform.opacity / 100,
    transform: `translate(-50%, -50%) rotate(${transform.rotation}deg)`,
  };
}
