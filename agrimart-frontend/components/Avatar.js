'use client';

import { useEffect, useState } from 'react';
import { resolveImageUrl } from '@/lib/api';
import { initialsOf } from '@/lib/format';

// Always prefers a real, resolved photo — rendered full-bleed and cropped
// (object-cover) so it looks sharp, never stretched or washed out. Only
// falls back to initials-on-a-solid-color when no picture exists at all.
export default function Avatar({ src, name, size = 40, className = '' }) {
  const resolved = resolveImageUrl(src);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [resolved]);

  const dim = { width: size, height: size, minWidth: size, minHeight: size };

  if (resolved && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolved}
        alt={name ? `${name}'s profile picture` : 'Profile picture'}
        style={dim}
        className={`rounded-full object-cover ${className}`}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      style={{ ...dim, fontSize: Math.max(11, Math.round(size * 0.38)) }}
      className={`flex items-center justify-center rounded-full bg-primary font-bold leading-none text-white ${className}`}
      aria-label={name ? `${name}'s initials` : 'Profile'}
    >
      {initialsOf(name)}
    </div>
  );
}
