import clsx from "clsx";

export function cn(...inputs) {
  return clsx(inputs);
}

export function formatDate(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleString();
}

export function formatCompactDate(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric"
  });
}

export function formatStatusLabel(value) {
  return String(value || "Unknown")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}
