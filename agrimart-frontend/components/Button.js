'use client';

export default function Button({
  children,
  variant = 'primary',
  className = '',
  disabled,
  loading,
  ...rest
}) {
  const base =
    'w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-[15px] font-semibold transition active:scale-[0.99] disabled:opacity-60 disabled:active:scale-100';
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    outline: 'bg-surface text-ink border border-line',
    danger: 'bg-surface text-danger border border-danger/40',
    ghost: 'bg-transparent text-primary',
  };

  return (
    <button
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? 'Please wait…' : children}
    </button>
  );
}
