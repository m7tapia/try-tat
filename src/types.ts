export type ImageRole = "photo" | "tattoo";

export type ImageAsset = {
  file: File;
  url: string;
  width: number;
  height: number;
};

export type Position = {
  x: number;
  y: number;
};

export type PhotoRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type TattooTransform = {
  position: Position;
  scale: number;
  rotation: number;
  opacity: number;
};
