type RangeControlProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  onChange: (value: number) => void;
};

export function RangeControl({
  label,
  value,
  min,
  max,
  suffix,
  onChange,
}: RangeControlProps) {
  const id = `${label.toLowerCase()}-control`;

  return (
    <label className="range-row" htmlFor={id}>
      <span>
        {label}
        <output>{value}{suffix}</output>
      </span>
      <input
        id={id}
        data-testid={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onInput={(event) => onChange(Number(event.currentTarget.value))}
      />
    </label>
  );
}
