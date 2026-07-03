'use client';

import { useEffect, useState } from 'react';
import { categoryById } from '@/lib/categories';
import { resolveImageUrl } from '@/lib/api';

// Renders a product/profile image with a graceful fallback: resolves
// relative backend paths to full URLs, shows a spinner while it loads, and
// falls back to a category icon tile if the URL 404s or the field is empty
// — so a missing/broken image never shows the browser's broken-image icon.
export default function ProductImage({ src, categoryId, className = '', alt = '' }) {
  const resolved = resolveImageUrl(src);
  const [status, setStatus] = useState(resolved ? 'loading' : 'empty');

  useEffect(() => {
    setStatus(resolved ? 'loading' : 'empty');
  }, [resolved]);

  const category = categoryById(categoryId);
  const fallback = (
    <div className={`flex items-center justify-center bg-primary-light text-4xl ${className}`} aria-hidden>
      {category ? category.icon : '🌱'}
    </div>
  );

  if (!resolved) return fallback;

  return (
    <div className={`relative ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolved}
        alt={alt}
        loading="lazy"
        className={`h-full w-full object-cover ${status === 'error' ? 'hidden' : ''}`}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
      />
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary-light/60 text-2xl">
          {category ? category.icon : '🌱'}
        </div>
      )}
      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary-light text-4xl">
          {category ? category.icon : '🌱'}
        </div>
      )}
    </div>
  );
}
