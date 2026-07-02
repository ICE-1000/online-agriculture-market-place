'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { CATEGORIES } from '@/lib/categories';
import { useSupplierMap, withSupplierNames } from '@/lib/hooks';
import ProductCard from '@/components/ProductCard';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppShell from '@/components/AppShell';
import BottomNav from '@/components/BottomNav';
import Spinner from '@/components/Spinner';

function QuickAction({ href, icon, label }) {
  return (
    <Link
      href={href}
      className="flex flex-1 flex-col items-center gap-2 rounded-2xl bg-white/15 px-2 py-4 text-center"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 text-lg">
        {icon}
      </span>
      <span className="text-[12px] font-semibold text-white">{label}</span>
    </Link>
  );
}

function HomeContent() {
  const { user, isFarmer } = useAuth();
  const { suppliers } = useSupplierMap();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .listProducts({ limit: 4 })
      .then((data) => active && setProducts(data))
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const enriched = withSupplierNames(products, suppliers);

  return (
    <AppShell>
      <div className="flex items-center justify-between px-5 pb-3 pt-5">
        <h1 className="text-[20px] font-extrabold text-ink">AgriMart</h1>
      </div>

      <div className="px-5">
        <div className="rounded-card bg-primary p-5 text-white">
          <p className="text-[13px] text-white/80">Welcome back,</p>
          <p className="flex items-center gap-2 text-[20px] font-extrabold">
            {user?.name} <span>👋</span>
          </p>
          <p className="mt-1 text-[13px] leading-snug text-white/85">
            {isFarmer
              ? 'Manage your produce listings and connect with buyers across Zambia.'
              : 'Discover fresh produce from verified farmers near you.'}
          </p>

          <div className="mt-4 flex gap-2">
            {isFarmer ? (
              <>
                <QuickAction href="/products/new" icon="＋" label="Add Product" />
                <QuickAction href="/nearby" icon="📍" label="Nearby" />
                <QuickAction href="/listings" icon="📋" label="Listings" />
              </>
            ) : (
              <>
                <QuickAction href="/products" icon="🔍" label="Browse" />
                <QuickAction href="/nearby" icon="📍" label="Nearby" />
                <QuickAction href="/saved" icon="❤" label="Saved" />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 px-5">
        <h2 className="mb-3 text-[16px] font-bold text-ink">Categories</h2>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.id}`}
              className="flex w-20 shrink-0 flex-col items-center gap-2 rounded-2xl bg-surface py-4 shadow-card"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-[12px] font-medium text-ink">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6 px-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-ink">Featured Products</h2>
          <Link href="/products" className="text-[13px] font-semibold text-primary">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : enriched.length === 0 ? (
          <p className="py-6 text-center text-[13px] text-muted">
            No products listed yet. Be the first!
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {enriched.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </AppShell>
  );
}

export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  );
}
