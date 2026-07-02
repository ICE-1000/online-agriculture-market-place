'use client';

import Link from 'next/link';
import Badge from './Badge';
import ProductImage from './ProductImage';
import { formatPrice } from '@/lib/format';

export default function ProductCard({ product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="block overflow-hidden rounded-card bg-surface shadow-card"
    >
      <ProductImage
        src={product.imageUrl}
        categoryId={product.categoryId}
        alt={product.name}
        className="h-32 w-full object-cover"
      />
      <div className="space-y-1 p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-[14px] font-semibold text-ink">{product.name}</p>
        </div>
        <Badge status={product.availability} />
        <p className="text-[15px] font-bold text-primary">
          {formatPrice(product.price)}{' '}
          <span className="text-[12px] font-medium text-muted">/ {product.unit}</span>
        </p>
        {product.supplierName && (
          <p className="truncate text-[12px] text-muted">{product.supplierName}</p>
        )}
        {product.location && (
          <p className="flex items-center gap-1 truncate text-[12px] text-muted">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
              <circle cx="12" cy="10" r="2.4" />
            </svg>
            {product.location}
            {product.province ? `, ${product.province}` : ''}
          </p>
        )}
      </div>
    </Link>
  );
}
