# בבושקה — Second-hand shop site

Static site (HTML + CSS + vanilla JS) for a second-hand shop, with a customer-facing catalog and an admin panel for managing listings.

## Files

- `index.html` — customer-facing catalog (browse + filter + item detail)
- `admin.html` — password-protected admin panel (add / edit / delete / mark sold)
- `css/style.css` — shared styles
- `js/data.js` — data layer (localStorage) + auth + seed items
- `js/customer.js` — customer page logic
- `js/admin.js` — admin page logic
- `assets/logo.png` — **save the babushka logo here** (see below)

## How to use

1. **Save the logo.** Save the babushka logo image as `assets/logo.png`. Without it the header just shows the text.
2. **Open `index.html`** in a browser to see the customer side.
3. **Open `admin.html`** to add/edit items. Default password: `babushka2026` — change it in `js/data.js` (line `const ADMIN_PASSWORD = ...`).

## Important: this is a single-device demo

All data lives in the browser's `localStorage`. That means:

- Items your friend adds in the admin panel are visible **only on the same browser on the same device**.
- A customer visiting from their phone will not see anything she uploaded from her laptop — they will see only the seed demo items baked into `js/data.js`.

This is fine for a design preview / prototype. To make it a real shop where uploads are visible to everyone, swap `js/data.js` for a real backend (Firebase, Supabase, or similar). The rest of the code stays the same — only the `Store` object needs to change.

## Categories

Defined in `js/data.js` under `CATEGORIES`. Edit there to add/remove/rename.

## Hosting

Any static host works: GitHub Pages, Netlify drop, Vercel, or just open the HTML files directly in a browser.
