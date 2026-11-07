export const fmtPts = (n: number | null | undefined) =>
  n == null ? "" : Number(n).toLocaleString("de-DE");

export function fmtTime(seconds: number | null | undefined) {
  if (seconds == null) return "";
  const h = Math.floor(seconds / 3600);
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}
