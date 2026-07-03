'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import ProductCard from '@/components/ProductCard';
import Spinner from '@/components/Spinner';
import { EmptyState } from '@/components/Spinner';

function SavedContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .listSaved()
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell nav={false} width="wide">
      <TopBar title="Saved Products" />
      <div className="px-5 py-4">
        {loading ? (
          <div className="flex justify-center py-14">
            <Spinner />
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon="🤍"
            title="No saved products"
            message="Tap the heart on a product to save it for later."
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function SavedPage() {
  return (
    <ProtectedRoute>
      <SavedContent />
    </ProtectedRoute>
  );
}
