'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { categoryById } from '@/lib/categories';
import { useSupplierMap } from '@/lib/hooks';
import { formatPrice, formatDateLong, phoneToTel, phoneToWhatsApp } from '@/lib/format';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import Badge from '@/components/Badge';
import ProductImage from '@/components/ProductImage';
import Avatar from '@/components/Avatar';
import Spinner from '@/components/Spinner';
import { ErrorNote } from '@/components/Spinner';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { suppliers } = useSupplierMap();
  const [product, setProduct] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    api
      .getProduct(id)
      .then(async (p) => {
        setProduct(p);
        api.getUser(p.supplierId).then(setSupplier).catch(() => {});
        api.compareProduct(id).then(setComparison).catch(() => {});
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!user) return;
    api
      .listSaved()
      .then((items) => setSaved(items.some((i) => i.id === id)))
      .catch(() => {});
  }, [user, id]);

  // The backend's /api/products/compare only filters by category, not by
  // product name or unit — so on its own it would show e.g. "Cabbage" as a
  // comparison for "White Maize" just because both are in the same
  // category. Tighten it client-side to only same name + same unit, which
  // is the only apples-to-apples comparison that actually makes sense.
  const tightComparable = useMemo(() => {
    if (!product || !comparison?.comparable) return [];
    const name = product.name.trim().toLowerCase();
    const unit = product.unit.trim().toLowerCase();
    return comparison.comparable.filter(
      (item) => item.name?.trim().toLowerCase() === name && item.unit?.trim().toLowerCase() === unit
    );
  }, [product, comparison]);

  async function toggleSave() {
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      const result = await api.toggleSaved(id);
      setSaved(result.saved);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <AppShell nav={false} width="default">
        <TopBar title="Product Details" />
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      </AppShell>
    );
  }

  if (!product) {
    return (
      <AppShell nav={false} width="default">
        <TopBar title="Product Details" />
        <div className="px-5 py-8">
          <ErrorNote message={error || 'Product not found.'} />
        </div>
      </AppShell>
    );
  }

  const category = categoryById(product.categoryId);
  const isOwner = user && user.id === product.supplierId;

  return (
    <AppShell nav={false} width="default">
      <TopBar title="Product Details" />

      <ProductImage
        src={product.imageUrl}
        categoryId={product.categoryId}
        alt={product.name}
        className="h-64 w-full object-cover"
      />

      <div className="px-5 py-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[22px] font-extrabold text-ink">{product.name}</h2>
            <p className="text-[13px] text-muted">
              {category ? `${category.icon} ${category.name}` : ''}
            </p>
          </div>
          <button
            onClick={toggleSave}
            aria-label="Save product"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface shadow-card"
          >
            <span className={saved ? 'text-danger' : 'text-muted'}>{saved ? '♥' : '♡'}</span>
          </button>
        </div>

        <p className="mt-3 text-[26px] font-extrabold text-primary">
          {formatPrice(product.price)}{' '}
          <span className="text-[14px] font-medium text-muted">per {product.unit}</span>
        </p>

        <div className="mt-2 flex items-center gap-3">
          <Badge status={product.availability} />
          <span className="text-[13px] text-muted">
            Qty: {product.quantity} {product.unit}
            {Number(product.quantity) === 1 ? '' : 's'}
          </span>
        </div>

        {product.description && (
          <div className="mt-4 rounded-card bg-surface p-4 shadow-card">
            <p className="mb-1 text-[13px] font-bold text-ink">Description</p>
            <p className="text-[14px] leading-relaxed text-muted">{product.description}</p>
          </div>
        )}

        {product.location && (
          <div className="mt-3 flex items-center gap-3 rounded-card bg-surface p-4 shadow-card">
            <span className="text-primary">📍</span>
            <div>
              <p className="text-[14px] font-semibold text-ink">{product.location}</p>
              {product.province && <p className="text-[12px] text-muted">{product.province} Province</p>}
            </div>
          </div>
        )}

        {supplier && (
          <Link
            href={`/suppliers/${supplier.id}`}
            className="mt-3 flex items-center justify-between rounded-card bg-surface p-4 shadow-card"
          >
            <span className="flex items-center gap-3">
              <Avatar src={supplier.profilePicture} name={supplier.name} size={40} className="text-[13px]" />
              <span>
                <span className="block text-[14px] font-semibold text-ink">{supplier.name}</span>
                <span className="block text-[12px] text-muted">
                  {supplier.location} - Joined {formatDateLong(supplier.joinedDate)}
                </span>
              </span>
            </span>
            <span className="text-[13px] font-semibold text-primary">View →</span>
          </Link>
        )}

        {!isOwner && supplier && (
          <div className="mt-3 flex gap-3">
            <a
              href={phoneToTel(supplier.phone)}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-surface py-3.5 text-[14px] font-semibold text-ink shadow-card"
            >
              📞 Call
            </a>
            <a
              href={phoneToWhatsApp(supplier.phone)}
              target="_blank"
              rel="noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-[14px] font-semibold text-white"
            >
              💬 WhatsApp
            </a>
          </div>
        )}

        {isOwner && (
          <Link
            href={`/products/${product.id}/edit`}
            className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-[14px] font-semibold text-white"
          >
            ✎ Edit this listing
          </Link>
        )}

        {tightComparable.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-1 text-[16px] font-bold text-ink">Price Comparison</h3>
            <p className="mb-3 text-[13px] text-muted">
              Other suppliers selling {product.name} ({product.unit})
            </p>
            <div className="overflow-hidden rounded-card shadow-card">
              <div className="flex items-center justify-between border-l-4 border-primary bg-primary-light px-4 py-3">
                <span>
                  <span className="block text-[14px] font-semibold text-ink">
                    {supplier?.name || 'This supplier'} ⭐
                  </span>
                  <span className="block text-[12px] text-muted">{product.location}</span>
                </span>
                <span className="text-[15px] font-bold text-primary">{formatPrice(product.price)}</span>
              </div>
              {tightComparable.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.id}`}
                  className="flex items-center justify-between border-t border-line bg-surface px-4 py-3"
                >
                  <span>
                    <span className="block text-[14px] font-semibold text-ink">
                      {suppliers[item.supplierId]?.name || 'Other supplier'}
                    </span>
                    <span className="block text-[12px] text-muted">{item.location}</span>
                  </span>
                  <span
                    className={`text-[15px] font-bold ${
                      Number(item.price) < Number(product.price) ? 'text-primary' : 'text-danger'
                    }`}
                  >
                    {formatPrice(item.price)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
