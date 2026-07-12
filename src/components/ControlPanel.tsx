import type React from "react";
import type { ImageAsset, ImageRole, TattooTransform } from "../types";
import { RangeControl } from "./RangeControl";
import { UploadField } from "./UploadField";

type ControlPanelProps = {
  photo: ImageAsset | null;
  tattoo: ImageAsset | null;
  transform: TattooTransform;
  error: string | null;
  ready: boolean;
  photoInputRef: React.RefObject<HTMLInputElement | null>;
  tattooInputRef: React.RefObject<HTMLInputElement | null>;
  onChooseAsset: (
    event: React.ChangeEvent<HTMLInputElement>,
    role: ImageRole,
  ) => void;
  onTransformChange: (update: Partial<TattooTransform>) => void;
  onStartOver: () => void;
};

export function ControlPanel({
  photo,
  tattoo,
  transform,
  error,
  ready,
  photoInputRef,
  tattooInputRef,
  onChooseAsset,
  onTransformChange,
  onStartOver,
}: ControlPanelProps) {
  return (
    <aside className="control-panel">
      <div className="panel-heading">
        <span>01</span>
        <div>
          <p>Build your preview</p>
          <h2>Studio controls</h2>
        </div>
      </div>

      <UploadField
        number="1"
        label="Placement photo"
        hint="PNG · up to 20 megapixels"
        id="photo-upload"
        inputRef={photoInputRef}
        filename={photo?.file.name}
        onChange={(event) => onChooseAsset(event, "photo")}
      />

      <UploadField
        number="2"
        label="Tattoo artwork"
        hint="Transparent PNG required"
        id="tattoo-upload"
        inputRef={tattooInputRef}
        filename={tattoo?.file.name}
        onChange={(event) => onChooseAsset(event, "tattoo")}
      />

      {error && (
        <p className="error" role="alert">{error}</p>
      )}

      <fieldset disabled={!ready} className="adjustments">
        <legend><span>3</span> Fine-tune placement</legend>
        <RangeControl
          label="Scale"
          value={transform.scale}
          min={10}
          max={300}
          suffix="%"
          onChange={(scale) => onTransformChange({ scale })}
        />
        <RangeControl
          label="Rotation"
          value={transform.rotation}
          min={-180}
          max={180}
          suffix="°"
          onChange={(rotation) => onTransformChange({ rotation })}
        />
        <RangeControl
          label="Opacity"
          value={transform.opacity}
          min={10}
          max={100}
          suffix="%"
          onChange={(opacity) => onTransformChange({ opacity })}
        />
      </fieldset>

      <div className="actions">
        <button
          className="reset"
          type="button"
          onClick={onStartOver}
          disabled={!photo && !tattoo}
        >
          Start over
        </button>
        <p>
          <strong>Ready to keep it?</strong>
          Use your device’s screenshot shortcut to capture the canvas.
        </p>
      </div>
    </aside>
  );
}
