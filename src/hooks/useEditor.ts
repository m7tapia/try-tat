import { useEffect, useRef, useState } from "react";
import { DEFAULT_TRANSFORM } from "../constants";
import { loadImageAsset } from "../image-assets";
import type { ImageAsset, ImageRole, Position, TattooTransform } from "../types";
import { usePhotoRect } from "./usePhotoRect";

export function useEditor() {
  const [photo, setPhoto] = useState<ImageAsset | null>(null);
  const [tattoo, setTattoo] = useState<ImageAsset | null>(null);
  const [transform, setTransform] = useState<TattooTransform>(DEFAULT_TRANSFORM);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const workspaceRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const tattooInputRef = useRef<HTMLInputElement>(null);
  const photoRect = usePhotoRect(photo, workspaceRef, photoRef);

  useEffect(() => () => revokeAsset(photo), [photo]);
  useEffect(() => () => revokeAsset(tattoo), [tattoo]);

  async function applyAsset(file: File, role: ImageRole) {
    setError(null);

    try {
      const nextAsset = await loadImageAsset(file, role);

      if (role === "photo") {
        revokeAsset(photo);
        setPhoto(nextAsset);
      } else {
        revokeAsset(tattoo);
        setTattoo(nextAsset);
        setTransform(DEFAULT_TRANSFORM);
      }

      return true;
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "That image could not be loaded.",
      );
      return false;
    }
  }

  async function chooseAsset(
    event: React.ChangeEvent<HTMLInputElement>,
    role: ImageRole,
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!(await applyAsset(file, role))) {
      event.target.value = "";
    }
  }

  function updateTransform(update: Partial<TattooTransform>) {
    setTransform((current) => ({ ...current, ...update }));
  }

  function updatePosition(clientX: number, clientY: number) {
    const workspaceBounds = workspaceRef.current?.getBoundingClientRect();
    if (!workspaceBounds || !photoRect) return;

    const position: Position = {
      x: clampPercent(
        ((clientX - workspaceBounds.left - photoRect.left) / photoRect.width) * 100,
      ),
      y: clampPercent(
        ((clientY - workspaceBounds.top - photoRect.top) / photoRect.height) * 100,
      ),
    };

    updateTransform({ position });
  }

  function startDragging(event: React.PointerEvent<HTMLImageElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    updatePosition(event.clientX, event.clientY);
  }

  function startOver() {
    revokeAsset(photo);
    revokeAsset(tattoo);
    setPhoto(null);
    setTattoo(null);
    setTransform(DEFAULT_TRANSFORM);
    setError(null);

    if (photoInputRef.current) photoInputRef.current.value = "";
    if (tattooInputRef.current) tattooInputRef.current.value = "";
  }

  return {
    photo,
    tattoo,
    transform,
    error,
    dragging,
    photoRect,
    workspaceRef,
    photoRef,
    photoInputRef,
    tattooInputRef,
    ready: Boolean(photo && tattoo),
    applyAsset,
    chooseAsset,
    updateTransform,
    updatePosition,
    startDragging,
    stopDragging: () => setDragging(false),
    startOver,
  };
}

function revokeAsset(asset: ImageAsset | null) {
  if (asset) URL.revokeObjectURL(asset.url);
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, value));
}
