'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function Icon({ name, active }) {
  const color = active ? '#0B6E4F' : '#71797A';
  const common = { fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'home':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" {...common}>
          <path d="M3 11l9-8 9 8" />
          <path d="M5 10v10h14V10" />
        </svg>
      );
    case 'farm':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" {...common}>
          <path d="M3 21h18" />
          <path d="M4 21V9l4-4 4 4v12" />
          <path d="M12 21v-7l4-4 4 4v7" />
        </svg>
      );
    case 'products':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" {...common}>
          <path d="M6 8l1.5-4h9L18 8" />
          <path d="M4 8h16l-1.2 11.2A2 2 0 0 1 16.8 21H7.2a2 2 0 0 1-2-1.8L4 8z" />
        </svg>
      );
    case 'nearby':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" {...common}>
          <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
          <circle cx="12" cy="10" r="2.4" />
        </svg>
      );
    case 'settings':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.1.36.53 1 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function BottomNav() {
  const pathname = usePathname();
  const { isFarmer, user } = useAuth();

  if (!user) return null;

  const tabs = isFarmer
    ? [
        { href: '/home', label: 'Home', icon: 'home' },
        { href: '/my-farm', label: 'My Farm', icon: 'farm' },
        { href: '/nearby', label: 'Nearby', icon: 'nearby' },
        { href: '/settings', label: 'Settings', icon: 'settings' },
      ]
    : [
        { href: '/home', label: 'Home', icon: 'home' },
        { href: '/products', label: 'Products', icon: 'products' },
        { href: '/nearby', label: 'Nearby', icon: 'nearby' },
        { href: '/settings', label: 'Settings', icon: 'settings' },
      ];

  return (
    <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-app -translate-x-1/2 border-t border-line bg-surface px-2 pb-[calc(env(safe-area-inset-bottom)+6px)] pt-2">
      <div className="flex items-center justify-between">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-1 flex-col items-center gap-1 py-1"
            >
              <Icon name={tab.icon} active={active} />
              <span
                className={`text-[11px] font-medium ${active ? 'text-primary' : 'text-muted'}`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
