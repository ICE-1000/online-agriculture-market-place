'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { initialsOf } from '@/lib/format';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppShell from '@/components/AppShell';
import BottomNav from '@/components/BottomNav';

const ACCOUNT_LINKS = [
  { href: '/settings/profile', icon: '👤', label: 'Edit Profile' },
  { href: '/settings/password', icon: '🔒', label: 'Change Password' },
  { href: '/settings/location', icon: '📍', label: 'Manage Location' },
  { href: '/settings/notifications', icon: '🔔', label: 'Notifications' },
];

const QUICK_LINKS = [
  { href: '/saved', icon: '🔖', label: 'Saved Products' },
  { href: '/compare', icon: '📊', label: 'Price Comparison' },
  { href: '/predictions', icon: '📈', label: 'Price Predictions' },
];

function Row({ href, icon, label }) {
  return (
    <Link href={href} className="flex items-center justify-between px-4 py-4">
      <span className="flex items-center gap-3">
        <span className="text-lg text-primary">{icon}</span>
        <span className="text-[14px] font-medium text-ink">{label}</span>
      </span>
      <span className="text-muted">→</span>
    </Link>
  );
}

function SettingsContent() {
  const { user, isFarmer, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace('/login');
  }

  return (
    <AppShell width="default">
      <div className="px-5 pb-3 pt-6 md:px-0 md:pt-8">
        <h1 className="text-[20px] font-extrabold text-ink">Settings</h1>
      </div>

      <div className="px-5">
        <div className="flex flex-col items-center rounded-card bg-surface px-5 py-6 text-center shadow-card">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-[20px] font-bold text-white">
            {initialsOf(user?.name)}
          </span>
          <p className="mt-3 text-[17px] font-bold text-ink">{user?.name}</p>
          {user?.email && <p className="text-[13px] text-muted">{user.email}</p>}
          {user?.location && (
            <p className="mt-1 flex items-center gap-1 text-[13px] text-muted">
              📍 {user.location}
              {user.province ? `, ${user.province}` : ''}
            </p>
          )}
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-pill bg-primary-light px-3 py-1 text-[12px] font-semibold text-primary">
            {isFarmer ? '🏪 Farmer / Supplier' : '🧺 Buyer / Consumer'}
          </span>
        </div>
      </div>

      <div className="mt-6 px-5">
        <p className="mb-2 text-[12px] font-bold uppercase tracking-wide text-muted">Account</p>
        <div className="divide-y divide-line rounded-card bg-surface shadow-card">
          {ACCOUNT_LINKS.map((link) => (
            <Row key={link.href} {...link} />
          ))}
        </div>
      </div>

      <div className="mt-6 px-5">
        <p className="mb-2 text-[12px] font-bold uppercase tracking-wide text-muted">Quick Links</p>
        <div className="divide-y divide-line rounded-card bg-surface shadow-card">
          {QUICK_LINKS.map((link) => (
            <Row key={link.href} {...link} />
          ))}
        </div>
      </div>

      <div className="mt-6 px-5">
        <button
          onClick={handleLogout}
          className="w-full rounded-2xl border-2 border-danger py-3.5 text-[15px] font-bold text-danger"
        >
          Log Out
        </button>
        <p className="mt-4 text-center text-[12px] text-muted">AgriMart v1.0.0</p>
      </div>

      <BottomNav />
    </AppShell>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
