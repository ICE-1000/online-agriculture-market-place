'use client';

import DesktopNav from './DesktopNav';
import {
  BACKGROUND_IMAGE_URL,
  BACKGROUND_IMAGE_OPACITY,
  BACKGROUND_READABILITY_SCRIM,
} from '@/lib/background';

// Full-width responsive shell: content spans the entire browser window on
// desktop (only sign-in/registration/short forms stay narrow, via
// width="narrow"), with a persistent top nav bar. On phones it behaves like
// a single-column app with a bottom tab bar rendered by each page.
//
// background="image" shows the configured photo (lib/background.js) — used
// only by Login/Register. Every other page uses the plain sage background
// (background="plain", the default) for a clean, professional look.
export default function AppShell({ children, nav = true, width = 'default', background = 'plain' }) {
  const narrow = width === 'narrow';
  const showImage = background === 'image' && BACKGROUND_IMAGE_URL;

  return (
    <div className="relative min-h-screen bg-bg">
      {showImage && (
        <>
          <div
            className="fixed inset-0 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: `url(${BACKGROUND_IMAGE_URL})`, opacity: BACKGROUND_IMAGE_OPACITY }}
            aria-hidden
          />
          <div
            className="fixed inset-0 bg-bg"
            style={{ opacity: BACKGROUND_READABILITY_SCRIM }}
            aria-hidden
          />
        </>
      )}

      <div className="relative">
        <DesktopNav />
        <div
          className={`w-full ${nav ? 'pb-24 md:pb-12' : 'pb-6'} ${
            narrow ? 'max-w-md mx-auto md:px-6' : 'px-0 md:px-8 lg:px-12 xl:px-16'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
