'use client';

export function Field({ label, required, children, hint }) {
  return (
    <div className="mb-5">
      {label && (
        <label className="mb-2 block text-[13px] font-semibold text-ink">
          {label} {required && <span className="text-ink">*</span>}
        </label>
      )}
      {children}
      {hint && <p className="mt-1 text-[12px] text-muted">{hint}</p>}
    </div>
  );
}

export function TextInput({ className = '', ...rest }) {
  return (
    <input
      className={`w-full rounded-2xl border border-transparent bg-surface px-4 py-3.5 text-[15px] text-ink placeholder:text-muted/70 outline-none focus:border-primary ${className}`}
      {...rest}
    />
  );
}

export function TextArea({ className = '', ...rest }) {
  return (
    <textarea
      className={`w-full min-h-[110px] rounded-2xl border border-transparent bg-surface px-4 py-3.5 text-[15px] text-ink placeholder:text-muted/70 outline-none focus:border-primary ${className}`}
      {...rest}
    />
  );
}

export function Select({ className = '', children, ...rest }) {
  return (
    <select
      className={`w-full rounded-2xl border border-transparent bg-surface px-4 py-3.5 text-[15px] text-ink outline-none focus:border-primary ${className}`}
      {...rest}
    >
      {children}
    </select>
  );
}
