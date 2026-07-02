'use client';

import { categoryById } from '@/lib/categories';

export default function ProductImage({ src, categoryId, className = '', alt = 'supposed to be image components/produu...' }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={className} />;
  }
  const category = categoryById(categoryId);
  return (
    <div
      className={`flex items-center justify-center bg-primary-light text-4xl ${className}`}
      aria-hidden
    >
      {category ? category.icon : '🌱'}
    </div>
  );
}
