// Small shared formatters/labels for the admin enquiry views.

/** MySQL timestamps arrive as ISO-ish strings; render a readable AU datetime. */
export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Short "3 hours ago" / "2 days ago" relative label. */
export function formatRelative(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const diffMs = Date.now() - d.getTime();
  const sec = Math.round(diffMs / 1000);
  const min = Math.round(sec / 60);
  const hr = Math.round(min / 60);
  const day = Math.round(hr / 24);
  if (sec < 60) return "just now";
  if (min < 60) return `${min} min ago`;
  if (hr < 24) return `${hr} hour${hr === 1 ? "" : "s"} ago`;
  if (day < 30) return `${day} day${day === 1 ? "" : "s"} ago`;
  return formatDateTime(value);
}

export const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  closed: "Closed",
};

export const TYPE_LABELS: Record<string, string> = {
  holiday: "Holiday",
  umrah: "Umrah",
  quote: "Quote",
};

export function statusClass(status: string): string {
  return `admin-badge status-${status}`;
}

export function typeClass(type: string): string {
  return `admin-badge type-${type}`;
}
