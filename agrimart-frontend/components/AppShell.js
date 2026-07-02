'use client';

export default function AppShell({ children, nav = true }) {
  return (
    <div className="flex min-h-screen justify-center bg-[#DCE1D6] sm:py-6">
      <div
        className={`relative w-full max-w-app bg-bg sm:rounded-[28px] sm:shadow-phone ${
          nav ? 'pb-24' : 'pb-6'
        } min-h-screen sm:min-h-[812px]`}
      >
        {children}
      </div>
    </div>
  );
}
