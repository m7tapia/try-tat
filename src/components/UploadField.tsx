import type React from "react";

type UploadFieldProps = {
  number: string;
  label: string;
  hint: string;
  accept: string;
  id: string;
  filename?: string;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function UploadField({
  number,
  label,
  hint,
  accept,
  id,
  filename,
  isLoading,
  inputRef,
  onChange,
}: UploadFieldProps) {
  return (
    <div className="upload-row">
      <span className="step-number">{number}</span>
      <div>
        <strong>{label}</strong>
        <small aria-live="polite">
          {isLoading ? "Converting your HEIC photo…" : filename ?? hint}
        </small>
      </div>
      <div className="file-actions">
        <label className={`file-button ${isLoading ? "is-loading" : ""}`} htmlFor={id}>
          {isLoading ? "Converting…" : "Choose file"}
        </label>
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
        disabled={isLoading}
      />
    </div>
  );
}
