'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useSupplierMap } from '@/lib/hooks';
import { formatPrice } from '@/lib/format';
import { categoryById } from '@/lib/categories';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import Spinner from '@/components/Spinner';
import { EmptyState, ErrorNote } from '@/components/Spinner';

function ComparisonContent() {
  const { suppliers } = useSupplierMap();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .listProducts({ limit: 100 })
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Tight match: same category AND same product name AND same unit. Category
  // keeps unrelated items from ever mixing (two different "Beans" in two
  // different categories are not the same product); unit keeps the price
  // comparison honest (a per-kg price and a per-50kg-bag price for the same
  // crop are not comparable numbers, even if the name matches).
  const groups = useMemo(() => {
    const byKey = new Map();
    products
      .filter((p) => p.availability !== 'sold_out' && p.availability !== 'hidden')
      .forEach((p) => {
        const key = `${p.categoryId}::${p.name.trim().toLowerCase()}::${p.unit.trim().toLowerCase()}`;
        if (!byKey.has(key)) byKey.set(key, []);
        byKey.get(key).push(p);
      });

    return Array.from(byKey.values())
      .filter((items) => items.length > 1)
      .map((items) => items.slice().sort((a, b) => a.price - b.price));
  }, [products]);

  // Group the tight matches under category headers so comparisons read as
  // "similar products, within the same category" rather than one long
  // undifferentiated list.
  const sections = useMemo(() => {
    const byCategory = new Map();
    groups.forEach((items) => {
      const catId = items[0].categoryId;
      if (!byCategory.has(catId)) byCategory.set(catId, []);
      byCategory.get(catId).push(items);
    });

    return Array.from(byCategory.entries())
      .map(([categoryId, groupList]) => ({
        categoryId,
        category: categoryById(categoryId),
        groups: groupList.sort((a, b) => a[0].name.localeCompare(b[0].name)),
      }))
      .sort((a, b) => (a.category?.name || '').localeCompare(b.category?.name || ''));
  }, [groups]);

  return (
    <AppShell nav={false} width="default">
      <TopBar title="Price Comparison" />
      <div className="px-5 py-4">
        <p className="mb-4 text-[13px] text-muted">
          Compare prices across suppliers for the same product, within the same category and unit.
        </p>

        {loading ? (
          <div className="flex justify-center py-14">
            <Spinner />
          </div>
        ) : error ? (
          <ErrorNote message={`Couldn't load products: ${error}`} />
        ) : sections.length === 0 ? (
          <EmptyState
            icon="⚖️"
            title="Nothing to compare yet"
            message="Once two or more suppliers list the same product (same category, name, and unit), they'll show up here."
          />
        ) : (
          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section.categoryId}>
                <h2 className="mb-3 flex items-center gap-2 text-[16px] font-bold text-ink">
                  <span>{section.category?.icon || '🌱'}</span>
                  {section.category?.name || section.categoryId}
                </h2>
                <div className="space-y-4">
                  {section.groups.map((items) => {
                    const min = items[0].price;
                    const max = items[items.length - 1].price;
                    return (
                      <div
                        key={`${items[0].name}-${items[0].unit}`}
                        className="overflow-hidden rounded-card shadow-card"
                      >
                        <div className="bg-primary-light px-4 py-3">
                          <p className="text-[15px] font-bold text-ink">{items[0].name}</p>
                          <p className="text-[12px] text-muted">
                            {items.length} suppliers - {formatPrice(min)} to {formatPrice(max)} per{' '}
                            {items[0].unit}
                          </p>
                        </div>
                        {items.map((item, idx) => (
                          <Link
                            key={item.id}
                            href={`/products/${item.id}`}
                            className={`flex items-center justify-between px-4 py-3 ${
                              idx === 0 ? 'border-l-4 border-primary bg-primary-light/60' : 'bg-surface'
                            } ${idx > 0 ? 'border-t border-line' : ''}`}
                          >
                            <span>
                              <span className="block text-[14px] font-semibold text-ink">
                                {suppliers[item.supplierId]?.name || 'Supplier'}
                                {idx === 0 ? ' ⭐' : ''}
                              </span>
                              <span className="block text-[12px] text-muted">
                                {item.location}
                                {item.province ? `, ${item.province}` : ''}
                              </span>
                            </span>
                            <span
                              className={`text-[15px] font-bold ${idx === 0 ? 'text-primary' : 'text-ink'}`}
                            >
                              {formatPrice(item.price)}
                            </span>
                          </Link>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function ComparePage() {
  return (
    <ProtectedRoute>
      <ComparisonContent />
    </ProtectedRoute>
  );
}
