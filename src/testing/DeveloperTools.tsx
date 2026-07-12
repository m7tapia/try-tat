import type { ImageRole } from "../types";

type DeveloperToolsProps = {
  onLoadAsset: (file: File, role: ImageRole) => Promise<boolean>;
};

export function DeveloperTools({ onLoadAsset }: DeveloperToolsProps) {
  if (!import.meta.env.DEV || !new URLSearchParams(location.search).has("e2e")) {
    return null;
  }

  return (
    <div className="developer-tools" aria-label="Developer test fixtures">
      <button
        type="button"
        onClick={() => void onLoadAsset(makeFixture("photo"), "photo")}
      >
        Load test photo
      </button>
      <button
        type="button"
        onClick={() => void onLoadAsset(makeFixture("tattoo"), "tattoo")}
      >
        Load test tattoo
      </button>
      <button
        type="button"
        onClick={() => void onLoadAsset(makeFixture("opaque"), "tattoo")}
      >
        Load invalid tattoo
      </button>
    </div>
  );
}

function makeFixture(kind: "photo" | "tattoo" | "opaque") {
  const canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 240;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not create a test image.");

  if (kind !== "tattoo") {
    context.fillStyle = kind === "photo" ? "#b8866b" : "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  context.strokeStyle = "#18120f";
  context.lineWidth = 12;
  context.lineCap = "round";
  context.beginPath();
  context.arc(160, 120, 70, 0.4, 5.3);
  context.stroke();

  const encodedImage = canvas.toDataURL("image/png").split(",")[1];
  const binary = atob(encodedImage);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));

  return new File([bytes], `${kind}.png`, { type: "image/png" });
}
