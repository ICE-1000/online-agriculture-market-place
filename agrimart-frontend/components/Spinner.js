'use client';

export default function Spinner({ size = 24 }) {
  return (
    <div
      className="animate-spin rounded-full border-2 border-primary-light border-t-primary"
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );
}

export function EmptyState({ icon = '🌾', title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-card bg-surface px-6 py-14 text-center shadow-card">
      <span className="text-4xl">{icon}</span>
      <p className="text-[15px] font-semibold text-ink">{title}</p>
      {message && <p className="text-[13px] text-muted">{message}</p>}
      {action}
    </div>
  );
}

export function ErrorNote({ message }) {
  if (!message) return null;
  return (
    <div className="mb-4 rounded-2xl bg-danger-bg px-4 py-3 text-[13px] font-medium text-danger">
      {message}
    </div>
  );
}
