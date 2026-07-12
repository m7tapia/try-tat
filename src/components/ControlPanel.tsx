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
      <div className="upload-section">
        <div className="panel-heading">
          <h2>Upload your images</h2>
        </div>

        <UploadField
          number="1"
          label="Placement photo"
          hint="JPG, PNG or HEIC"
          accept="image/jpeg,image/png,image/heic,image/heif,.jpg,.jpeg,.png,.heic,.heif"
          id="photo-upload"
          inputRef={photoInputRef}
          filename={photo?.file.name}
          onChange={(event) => onChooseAsset(event, "photo")}
        />

        <UploadField
          number="2"
          label="Tattoo artwork"
          hint="Transparent PNG"
          accept="image/png,.png"
          id="tattoo-upload"
          inputRef={tattooInputRef}
          filename={tattoo?.file.name}
          onChange={(event) => onChooseAsset(event, "tattoo")}
        />

        <p className="upload-tip">
          Need a transparent tattoo file? Try an online transparent PNG converter.
        </p>

        {error && (
          <p className="error" role="alert">{error}</p>
        )}

        <div className="upload-actions">
          <p>
            <strong>Ready to keep it?</strong>
            Screenshot to save.
          </p>
          <button
            className="reset"
            type="button"
            onClick={onStartOver}
            disabled={!photo && !tattoo}
          >
            Reset files
          </button>
        </div>
      </div>

      <fieldset disabled={!ready} className="adjustments">
        <legend><span>3</span> Fine-tune placement</legend>
        <RangeControl
          label="Scale"
          value={transform.scale}
          min={0}
          max={100}
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

    </aside>
  );
}
