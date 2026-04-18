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

export function formatCurrency(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "N/A";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatTradeExchange(value) {
  const text = String(value || "").trim();
  if (!text) return "N/A";

  if (/^\d+(\.\d+)?$/.test(text)) {
    return formatCurrency(text);
  }

  return text.replace(/(\d+(?:\.\d+)?)\s*(?:civic\s+)?credits?/gi, (_, amount) => formatCurrency(amount));
}

export function formatStatusLabel(value) {
  return String(value || "Unknown")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}
