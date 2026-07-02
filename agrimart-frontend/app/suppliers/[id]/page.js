'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { formatDateLong, initialsOf, phoneToTel, phoneToWhatsApp } from '@/lib/format';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import ProductCard from '@/components/ProductCard';
import StatCard from '@/components/StatCard';
import Spinner from '@/components/Spinner';
import { EmptyState, ErrorNote } from '@/components/Spinner';

export default function SupplierProfilePage() {
  const { id } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([api.getUser(id), api.listProducts({ supplier: id, limit: 100 })])
      .then(([u, p]) => {
        setSupplier(u);
        setProducts(p);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <AppShell nav={false}>
        <TopBar title="Supplier Profile" />
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      </AppShell>
    );
  }

  if (!supplier) {
    return (
      <AppShell nav={false}>
        <TopBar title="Supplier Profile" />
        <div className="px-5 py-8">
          <ErrorNote message={error || 'Supplier not found.'} />
        </div>
      </AppShell>
    );
  }

  const active = products.filter((p) => p.availability !== 'sold_out' && p.availability !== 'hidden').length;

  return (
    <AppShell nav={false}>
      <TopBar title="Supplier Profile" />

      <div className="flex flex-col items-center px-5 pt-6 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-[24px] font-bold text-white">
          {initialsOf(supplier.name)}
        </span>
        <h2 className="mt-3 text-[20px] font-extrabold text-ink">{supplier.name}</h2>
        {(supplier.location || supplier.province) && (
          <p className="mt-1 flex items-center gap-1 text-[13px] text-muted">
            📍 {supplier.location}
            {supplier.province ? `, ${supplier.province}` : ''}
          </p>
        )}
        {supplier.phone && <p className="mt-1 text-[13px] text-muted">📞 {supplier.phone}</p>}
        {supplier.joinedDate && (
          <p className="mt-1 text-[12px] text-muted">Joined {formatDateLong(supplier.joinedDate)}</p>
        )}

        <div className="mt-4 flex w-full gap-3">
          <a
            href={phoneToTel(supplier.phone)}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-surface py-3 text-[14px] font-semibold text-ink shadow-card"
          >
            📞 Call
          </a>
          <a
            href={phoneToWhatsApp(supplier.phone)}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-[14px] font-semibold text-white"
          >
            💬 WhatsApp
          </a>
        </div>
      </div>

      <div className="mt-5 flex gap-3 px-5">
        <StatCard value={products.length} label="Products" />
        <StatCard value={active} label="Active" tone="primary" />
      </div>

      <div className="mt-6 px-5">
        <h3 className="mb-3 text-[16px] font-bold text-ink">Products</h3>
        {products.length === 0 ? (
          <EmptyState icon="🌾" title="No products listed" />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
