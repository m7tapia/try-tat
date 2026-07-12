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
}: UploadFieldProps) {
  return (
    <div className="upload-row">
      <span className="step-number">{number}</span>
      <div>
        <strong>{label}</strong>
        <small>{filename ?? hint}</small>
      </div>
      <label className="file-button" htmlFor={id}>
        {filename ? "Replace" : "Choose file"}
      </label>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        onChange={onChange}
      />
    </div>
  );
}
