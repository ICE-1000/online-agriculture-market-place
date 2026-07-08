'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Avatar from './Avatar';

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
    <div className="sticky top-0 z-30 hidden border-b border-primary-dark bg-primary md:block">
      <div className="flex w-full items-center justify-between gap-6 px-6 py-3 md:px-8 lg:px-12 xl:px-16">
        <Link href="/home" className="flex shrink-0 items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-icon.png" alt="AgriMart" className="h-10 w-10 object-contain" />
          <span className="text-[18px] font-extrabold text-white">AgriMart</span>
        </Link>

        <nav className="flex flex-1 items-center gap-1">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`rounded-full px-4 py-2 text-[14px] font-semibold transition ${
                  active ? 'bg-primary-light text-primary' : 'text-white/85 hover:text-white'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-4">
          <Link href="/settings" title={user.name} className="flex flex-col items-center gap-0.5">
            <Avatar
              src={user.profilePicture}
              name={user.name}
              size={34}
              className="ring-1 ring-white/50"
            />
            <span className="text-[11px] font-semibold text-white">Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="text-[13px] font-semibold text-red-200 hover:text-white hover:underline"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
