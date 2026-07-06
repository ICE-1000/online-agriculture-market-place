'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { CATEGORIES } from '@/lib/categories';
import { useSupplierMap, withSupplierNames } from '@/lib/hooks';
import ProductCard from '@/components/ProductCard';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppShell from '@/components/AppShell';
import PageHeading from '@/components/PageHeading';
import BottomNav from '@/components/BottomNav';
import Spinner from '@/components/Spinner';
import { EmptyState, ErrorNote } from '@/components/Spinner';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const { suppliers } = useSupplierMap();
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    const timer = setTimeout(() => {
      api
        .listProducts({
          category: category === 'all' ? undefined : category,
          search: search || undefined,
          limit: 50,
        })
        .then(setProducts)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [category, search]);

  const enriched = useMemo(() => withSupplierNames(products, suppliers), [products, suppliers]);

  return (
    <AppShell width="wide">
      <div className="px-5 pb-3 pt-6 md:px-0 md:pt-8">
        <PageHeading>Products</PageHeading>
      </div>

      <div className="px-5">
        <div className="flex items-center gap-2 rounded-2xl bg-surface px-4 py-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71797A" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, suppliers, locations..."
            className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-muted"
          />
        </div>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto px-5 pb-1">
        <button
          onClick={() => setCategory('all')}
          className={`shrink-0 whitespace-nowrap rounded-pill px-4 py-2 text-[13px] font-semibold ${
            category === 'all' ? 'bg-primary text-white' : 'bg-surface text-ink'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-pill px-4 py-2 text-[13px] font-semibold ${
              category === cat.id ? 'bg-primary text-white' : 'bg-surface text-ink'
            }`}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between px-5">
        <p className="text-[13px] text-muted">{products.length} products</p>
        <p className="text-[13px] font-semibold text-primary">Newest First ⌄</p>
      </div>

      <div className="mt-3 px-5">
        {loading ? (
          <div className="flex justify-center py-14">
            <Spinner />
          </div>
        ) : error ? (
          <ErrorNote message={`Couldn't load products: ${error}`} />
        ) : enriched.length === 0 ? (
          <EmptyState icon="🔍" title="No products found" message="Try a different search or category." />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
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

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={null}>
        <ProductsContent />
      </Suspense>
    </ProtectedRoute>
  );
}
