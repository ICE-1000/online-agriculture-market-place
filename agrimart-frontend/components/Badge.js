'use client';

import { availabilityLabel, availabilityStyle } from '@/lib/categories';

export default function Badge({ status }) {
  const style = availabilityStyle(status);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-[12px] font-semibold"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: style.dot }} />
      {availabilityLabel(status)}
    </span>
  );
}
