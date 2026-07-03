'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { initialsOf } from '@/lib/format';

export default function DesktopNav() {
  const { user, isFarmer, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (!user) return null;

  const tabs = isFarmer
    ? [
        { href: '/home', label: 'Home' },
        { href: '/my-farm', label: 'My Farm' },
        { href: '/listings', label: 'My Listings' },
        { href: '/nearby', label: 'Nearby Farms' },
        { href: '/compare', label: 'Price Comparison' },
      ]
    : [
        { href: '/home', label: 'Home' },
        { href: '/products', label: 'Products' },
        { href: '/saved', label: 'Saved' },
        { href: '/nearby', label: 'Nearby Farms' },
        { href: '/compare', label: 'Price Comparison' },
      ];

  function handleLogout() {
    logout();
    router.replace('/login');
  }

  return (
    <div className="sticky top-0 z-30 hidden border-b border-line bg-surface/95 backdrop-blur md:block">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3">
        <Link href="/home" className="flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-light text-lg">
            🌾
          </span>
          <span className="text-[18px] font-extrabold text-ink">AgriMart</span>
        </Link>

        <nav className="flex flex-1 items-center gap-1">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`rounded-full px-4 py-2 text-[14px] font-semibold transition ${
                  active ? 'bg-primary-light text-primary' : 'text-muted hover:text-ink'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-4">
          <Link href="/settings" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-white">
              {initialsOf(user.name)}
            </span>
            <span className="text-[13px] font-medium text-ink">{user.name}</span>
          </Link>
          <button
            onClick={handleLogout}
            className="text-[13px] font-semibold text-danger hover:underline"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
