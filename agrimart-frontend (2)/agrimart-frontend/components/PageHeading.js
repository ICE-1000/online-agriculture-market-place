'use client';

// A page-level <h1> that sits directly on the app background rather than
// inside a white card. Wrapped in a translucent chip so it stays crisp and
// readable no matter which part of the background photo happens to be
// behind it — cards elsewhere don't need this since they're already solid.
export default function PageHeading({ children, className = '' }) {
  return (
    <h1
      className={`inline-block rounded-xl bg-surface/90 px-3 py-1.5 text-[20px] font-extrabold text-ink shadow-sm backdrop-blur-sm ${className}`}
    >
      {children}
    </h1>
  );
}
