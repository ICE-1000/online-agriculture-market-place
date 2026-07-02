'use client';

export default function CategoryPill({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-pill px-4 py-2 text-[13px] font-semibold transition ${
        active ? 'bg-primary text-white' : 'bg-surface text-ink'
      }`}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
}
