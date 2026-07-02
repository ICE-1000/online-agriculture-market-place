'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import Badge from '@/components/Badge';
import Spinner from '@/components/Spinner';
import { EmptyState, ErrorNote } from '@/components/Spinner';
import { formatPrice } from '@/lib/format';

function ListingsContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api
      .listProducts({ supplier: user.id, limit: 100 })
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSoldOut(id) {
    setBusyId(id);
    try {
      await api.markSoldOut(id);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this listing? This cannot be undone.')) return;
    setBusyId(id);
    try {
      await api.deleteProduct(id);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <AppShell nav={false}>
      <TopBar title="My Listings" />
      <div className="px-5 py-4">
        <p className="mb-4 text-[13px] text-muted">{products.length} listings</p>
        <ErrorNote message={error} />

        {loading ? (
          <div className="flex justify-center py-14">
            <Spinner />
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No listings yet"
            message="Add your first product to start selling."
          />
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p.id} className="rounded-card bg-surface shadow-card">
                <div className="flex items-start justify-between p-4">
                  <div>
                    <p className="text-[16px] font-bold text-ink">{p.name}</p>
                    <p className="text-[14px] font-semibold text-primary">
                      {formatPrice(p.price)} / {p.unit}
                    </p>
                    <p className="text-[12px] text-muted">
                      Qty: {p.quantity} - {p.location}
                    </p>
                  </div>
                  <Badge status={p.availability} />
                </div>
                <div className="grid grid-cols-3 divide-x divide-line border-t border-line">
                  <button
                    onClick={() => router.push(`/products/${p.id}/edit`)}
                    className="flex items-center justify-center gap-1.5 py-3 text-[13px] font-semibold text-primary"
                  >
                    ✎ Edit
                  </button>
                  <button
                    onClick={() => handleSoldOut(p.id)}
                    disabled={busyId === p.id || p.availability === 'sold_out'}
                    className="flex items-center justify-center gap-1.5 py-3 text-[13px] font-semibold text-accent disabled:opacity-50"
                  >
                    ⊘ Sold Out
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={busyId === p.id}
                    className="flex items-center justify-center gap-1.5 py-3 text-[13px] font-semibold text-danger disabled:opacity-50"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function ListingsPage() {
  return (
    <ProtectedRoute>
      <ListingsContent />
    </ProtectedRoute>
  );
}
