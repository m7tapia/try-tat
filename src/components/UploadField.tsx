import type React from "react";

type UploadFieldProps = {
  number: string;
  label: string;
  hint: string;
  accept: string;
  id: string;
  filename?: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove?: () => void;
  resetLabel?: string;
};

export function UploadField({
  number,
  label,
  hint,
  accept,
  id,
  filename,
  inputRef,
  onChange,
  onRemove,
  resetLabel,
}: UploadFieldProps) {
  return (
    <div className="upload-row">
      <span className="step-number">{number}</span>
      <div>
        <strong>{label}</strong>
        <small>{filename ?? hint}</small>
      </div>
      <div className="file-actions">
        <label className="file-button" htmlFor={id}>
          Choose file
        </label>
        {filename && onRemove && resetLabel && (
          <button className="file-remove" type="button" onClick={onRemove}>
            {resetLabel}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        onClick={(event) => {
          event.currentTarget.value = "";
        }}
        onChange={onChange}
      />
    </div>
  );
}
