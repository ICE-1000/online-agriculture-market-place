'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { api } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppShell from '@/components/AppShell';
import BottomNav from '@/components/BottomNav';
import Spinner from '@/components/Spinner';

const FarmsMap = dynamic(() => import('@/components/FarmsMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <Spinner />
    </div>
  ),
});

const LUSAKA = [-15.4167, 28.2833];

function NearbyContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .listProducts({ limit: 100 })
      .then((data) => active && setProducts(data))
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const points = useMemo(() => {
    const bySupplier = new Map();
    products.forEach((p) => {
      if (p.latitude == null || p.longitude == null) return;
      if (!bySupplier.has(p.supplierId)) {
        bySupplier.set(p.supplierId, {
          id: p.supplierId,
          name: p.location || 'Farm',
          location: `${p.location || ''}${p.province ? `, ${p.province}` : ''}`,
          lat: p.latitude,
          lng: p.longitude,
        });
      }
    });
    return Array.from(bySupplier.values());
  }, [products]);

  return (
    <AppShell width="wide">
      <div className="px-5 pb-3 pt-6 md:px-0 md:pt-8">
        <h1 className="text-[20px] font-extrabold text-ink">Nearby Farms</h1>
      </div>

      <div className="relative mx-5 h-[420px] overflow-hidden rounded-card shadow-card">
        <div className="absolute left-3 top-3 z-[400] rounded-2xl bg-white/95 px-4 py-3 shadow-card">
          <p className="text-[12px] font-medium text-muted">Using your current location</p>
          <p className="text-[14px] font-bold text-primary">{points.length} farms</p>
        </div>
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Spinner />
          </div>
        ) : points.length === 0 ? (
          <div className="flex h-full items-center justify-center px-8 text-center text-[13px] text-muted">
            No farms with location data yet.
          </div>
        ) : (
          <FarmsMap center={LUSAKA} points={points} />
        )}
      </div>

      {points.length > 0 && (
        <div className="mt-4 space-y-2 px-5">
          {points.map((point) => (
            <Link
              key={point.id}
              href={`/suppliers/${point.id}`}
              className="flex items-center justify-between rounded-card bg-surface px-4 py-3 shadow-card"
            >
              <span className="text-[14px] font-semibold text-ink">{point.name}</span>
              <span className="text-[13px] text-muted">{point.location}</span>
            </Link>
          ))}
        </div>
      )}

      <BottomNav />
    </AppShell>
  );
}

export default function NearbyPage() {
  return (
    <ProtectedRoute>
      <NearbyContent />
    </ProtectedRoute>
  );
}
