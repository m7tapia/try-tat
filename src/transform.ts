const MINIMUM_RENDERED_SCALE = 1;
const MAXIMUM_RENDERED_SCALE = 50;

// The control uses a friendly 0–100 range while the tattoo grows from
// microscopic to half the photo width—the visual maximum chosen for the MVP.
export function getRenderedScale(scale: number) {
  const renderedScale = (scale / 100) * MAXIMUM_RENDERED_SCALE;
  return Math.max(MINIMUM_RENDERED_SCALE, renderedScale);
}
