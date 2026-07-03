'use client';

import DesktopNav from './DesktopNav';

const WIDTHS = {
  narrow: 'max-w-md',
  default: 'max-w-3xl',
  wide: 'max-w-6xl',
};

// Full-width responsive shell: fills the browser window on desktop with a
// top navigation bar, and behaves like a single-column mobile app (with a
// bottom tab bar rendered by each page) on small screens.
export default function AppShell({ children, nav = true, width = 'default' }) {
  return (
    <div className="min-h-screen bg-bg">
      <DesktopNav />
      <div
        className={`mx-auto w-full ${WIDTHS[width] || WIDTHS.default} ${
          nav ? 'pb-24 md:pb-12' : 'pb-6'
        } md:px-6`}
      >
        {children}
      </div>
    </div>
  );
}
