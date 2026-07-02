'use client';

export default function StatCard({ value, label, tone = 'ink' }) {
  const tones = {
    ink: 'text-ink',
    primary: 'text-primary',
    danger: 'text-danger',
  };
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-card bg-surface py-4 shadow-card">
      <span className={`text-2xl font-bold ${tones[tone] || tones.ink}`}>{value}</span>
      <span className="mt-0.5 text-[12px] text-muted">{label}</span>
    </div>
  );
}
