# AgriMart Frontend (Next.js)

A Next.js 14 (App Router) web frontend for the AgriMart backend, built to match
the mobile app screenshots you provided — same colors, layout, and screens —
and wired directly to your existing Express/Postgres API (`agri-backend`).

## Quick start

`.env.local` is already included and pre-configured to point at your live
backend (`https://online-agriculture-market-place.onrender.com`), so this
works with zero setup:

```bash
npm install
npm run dev
```

Open http://localhost:3000. It will redirect to `/login`.

For production:

```bash
npm run build
npm start
```

## Configuration

`.env.local` (already included, pointing at your live backend):

```env
NEXT_PUBLIC_API_URL=https://online-agriculture-market-place.onrender.com
```

To point at a different backend (e.g. local dev), just edit that value and
restart `npm run dev`.

**CORS:** make sure `ALLOWED_ORIGINS` in the backend's `.env` includes
wherever this frontend is actually served from — e.g.
`http://localhost:3000` for local dev, plus your deployed frontend's URL
(Vercel/Netlify domain, etc.) once you host it. Without that, the browser
will block every request with a CORS error even though the URL is correct.

**Render free-tier cold starts:** if the backend has been idle, Render spins
it down and the first request after a while can take 30–60s to respond
(you'll see the loading spinner sit there longer than usual). That's the
backend waking up, not a frontend bug — subsequent requests are fast again.

**Image uploads:** `storage.js` on the backend only uses Supabase Storage if
`SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` are set; otherwise it falls back to
writing files to local disk and returns a relative-looking URL built from
`API_URL`. Two things to check on the backend for images to work correctly
in production:
- `API_URL` in the backend's `.env` should be set to
  `https://online-agriculture-market-place.onrender.com` (not
  `localhost:5000`) — otherwise uploaded image URLs will point at
  `localhost` and never load in the browser.
- Render's filesystem is ephemeral on the free tier — locally-stored uploads
  can disappear on redeploy/restart. If images vanish after a backend
  redeploy, that's this, and configuring Supabase Storage is the fix.

On the frontend side, every image goes through `resolveImageUrl()` in
`lib/api.js`, which turns any relative path the backend returns (e.g.
`/uploads/products/xyz.jpg`) into a full URL against `NEXT_PUBLIC_API_URL`,
and `ProductImage` shows a category-icon placeholder — not a broken-image
icon — if a URL is missing or fails to load.

## Screens included

Matches the screenshots 1:1 in layout/color, mapped to real API calls:

- Login / Register (`/login`, `/register`)
- Home — role-aware welcome card + categories + featured products (`/home`)
- My Farm — stats + recent listings (`/my-farm`, farmer view)
- My Listings — edit / mark sold out / delete (`/listings`)
- Add Product / Edit Product (`/products/new`, `/products/[id]/edit`)
- Products browse — search, category filters (`/products`)
- Product Details — description, supplier card, call/WhatsApp, price
  comparison (`/products/[id]`)
- Supplier Profile (`/suppliers/[id]`)
- Nearby Farms — Leaflet/OpenStreetMap map (`/nearby`)
- Saved Products (`/saved`)
- Price Comparison (`/compare`)
- Price Predictions — "Coming Soon" (`/predictions`)
- Settings + Edit Profile / Change Password / Manage Location / Notifications
  (`/settings/*`)

## Where this had to diverge slightly from the screenshots

I matched the visuals exactly but had to adjust a few fields so the UI
actually works against your real backend contract, rather than the demo/mock
data implied by the screenshots:

1. **Login uses "Username", not "Email".** Your backend's `loginSchema` and
   `authService.loginUser()` authenticate by `username`, not email, even
   though the screenshot's login field is labeled "Email". I relabeled it to
   avoid a broken login form. `authService.registerUser()` also requires a
   `username` (alphanumeric, 3–30 chars), so I added a **Username** field to
   the register form that wasn't in the screenshot — without it, no account
   could ever log in.

2. **Register doesn't auto-login.** `authService.registerUser()` only returns
   a success message (`"Registration successful. Please log in."`), not a
   token. So Create Account redirects to `/login` rather than straight into
   the app.

3. **Profile pictures use the real backend field.** `POST
   /api/users/profile-picture` and `toUser()`'s `profilePicture` field are
   fully supported server-side already. Uploading a photo in Edit Profile
   calls that endpoint directly, and the photo then shows up (via `Avatar`)
   in the desktop nav, bottom nav, Settings, Supplier Profile, and Product
   Details wherever that user appears — falling back to initials only when
   no photo has been uploaded. There's no `bio` field anywhere in the API
   (`userService.updateUserProfile` only persists `name`, `phone`,
   `location`, `province`), so that was left out rather than faked with
   something that wouldn't actually persist.

4. **My Listings won't show "Hidden" products.** `productService.listProducts`
   always filters out `availability = 'hidden'` rows, even for the owner
   viewing their own listings (`GET /api/products?supplier=...` uses the same
   query). So a farmer who hides a listing currently can't see it in "My
   Listings" either — that's a backend behavior, not a frontend bug.

5. **Price Comparison page aggregates client-side.** The backend's
   `/api/products/compare` endpoint only compares one product at a time (by
   `productId`), which the Product Details page uses correctly. The
   standalone "Price Comparison" screen from your screenshots (grouping many
   products by name at once) has no dedicated backend endpoint, so it's built
   by fetching `GET /api/products` and grouping by name in the browser.

6. **Price Predictions is intentionally static.** It mirrors your screenshot
   exactly ("Coming Soon"). The real `/api/products/predictions` endpoint
   exists and works, but it requires auth **and** the user's
   `price_predictions_enabled` notification setting, and currently returns
   `model: 'dummy'` data — so wiring it up would just show fake numbers
   behind a permission wall. Flip this on later once real predictions exist.

7. **Nearby Farms is now fully wired up, at the product level.** Your
   backend already had `latitude`/`longitude` columns on `products` and
   accepts them in `createProductSchema`/`updateProductSchema` — they just
   weren't being set by anything. Add/Edit Product now include a **"Farm
   Location on Map"** picker (tap to drop a pin, drag to adjust, or "Use My
   Location" for GPS), which saves straight into those existing columns. The
   Nearby Farms page then plots every supplier who has pinned at least one
   product, asks the buyer's browser for their own location, and — when
   granted — centers the map on the buyer, sorts the list by distance, and
   shows "X km away" per farm. There's still no *user-level* location field
   in the backend (only per-product), so a farmer's pin comes from whichever
   product they last set coordinates on — good enough for one farm per
   account, but worth a real `profiles.latitude/longitude` column if you
   want a dedicated "my farm's home base" location later.

## Project structure

```
app/                  Next.js App Router pages (one folder per route)
components/           Shared UI (Button, Fields, ProductCard, Avatar, DesktopNav, BottomNav, LocationPicker, ...)
context/AuthContext.js  Session state, JWT storage, current user
lib/api.js             Single fetch client — every backend route, plus resolveImageUrl()
lib/geo.js              Haversine distance helper used to sort Nearby Farms
lib/background.js       ← set an app-wide background image here
lib/categories.js       Category/unit/province constants (mirrors db.sql + Joi schemas)
lib/format.js           Price/date/phone/initials formatting helpers
lib/hooks.js            useSupplierMap — joins products to public user profiles client-side
```

## Background image

`lib/background.js` is the one place to set a background image for the whole
app:

```js
export const BACKGROUND_IMAGE_URL = '/background.jpg'; // or a full https:// URL
export const BACKGROUND_OVERLAY_OPACITY = 0.82; // 0 = image fully visible, 1 = fully hidden
```

Drop your image file into `public/` (e.g. `public/background.jpg`) and point
`BACKGROUND_IMAGE_URL` at it with a leading slash, or use any remote image
URL directly. Leave it as `''` (the default) to keep the plain sage
background color. The overlay keeps card text readable on top of busy
photos — lower the opacity if you want the image more visible, raise it if
text contrast gets hard to read.

## Design tokens

Colors live in `tailwind.config.js` (`primary`, `accent`, `danger`, `bg`,
`ink`, `muted`, `line`) — tuned to match the forest-green / sage-cream
palette from your screenshots. The layout fills the full browser window:
`AppShell` renders `DesktopNav` (a full-width sticky top bar) plus edge-to-
edge page content with generous side padding, on every page except the
short forms (Login, Register, Add/Edit Product, Settings sub-pages), which
stay centered at a readable form width (`width="narrow"`). On phones, the
same pages collapse to a single column with a bottom tab bar (`BottomNav`)
instead of the top nav.

## Notes

- All requests go through `lib/api.js`, which attaches the JWT from
  `localStorage` automatically for authenticated routes.
- Image uploads use real `multipart/form-data` (`FormData`) against
  `POST /api/products` and `POST /api/users/profile-picture`, matching your
  `multer` middleware exactly (field names `image` / `profilePicture`).
- No mock data — every screen fetches from your backend. If the backend
  isn't running, you'll see a clear "Could not reach the AgriMart backend…"
  error rather than a silent failure.
