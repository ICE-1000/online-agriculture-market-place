'use client';

import { useRouter } from 'next/navigation';

export default function TopBar({ title, back = true, right = null }) {
  const router = useRouter();
  return (
    <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-bg/95 px-5 py-4 backdrop-blur">
      {back && (
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          className="-ml-1 flex h-8 w-8 items-center justify-center text-ink"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      <h1 className="flex-1 truncate text-[19px] font-bold text-ink">{title}</h1>
      {right}
    </div>
  );
}
