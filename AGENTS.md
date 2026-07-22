<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project architecture

- Use Bun for package commands. Do not introduce npm or yarn lockfiles.
- `app/` contains only Next.js route entry points, root layout and global CSS.
- Reusable UI belongs in `components/` (for example `Header`, `Footer`, `Button`).
- `Button` accepts a text `label`, optional `href`, `variant`, `icon="cart"`, and `showArrow`; do not pass nested markup into it.
- All `Button` variants share the base internal padding; only add local spacing overrides for a deliberate component-specific exception.
- A page is assembled in `screens/<page>/<Page>Screen.tsx`; UI used by one screen only belongs in its `components/` directory.
- Put public static assets in `public/` and reference them with root-relative paths (for example `/images/hero.png`).
- Keep temporary data that will later be received from the backend in `mock/`; screen components consume mock data through imports instead of owning it inline.
- For horizontal, touch-friendly carousels use `swiper`; keep their slide data in `mock/` until the corresponding API is connected. Category tabs must filter their mock data and reset the carousel to its first slide.
- Keep each home catalog product's presentational markup in `screens/home/components/ProductCard.tsx`; `Products.tsx` owns only the category tabs and carousel.
- Keep the desktop CTA heading and its parent container constrained to 1000px so it wraps naturally in two lines without manual breaks.
- The CTA uses `CAT.png` on desktop and the square `cta-mobile-v2.png` on mobile. Its mobile layout mirrors About: a square image above a `#f8f8f8` copy zone with the same divider, typography, and padding, without a CTA button.
- On mobile, product category tabs remain in one horizontal, touch-scrollable row rather than wrapping.
- Typography uses Inter for interface text and the locally bundled Helvetica Neue where explicitly needed.
- Use Tailwind utility classes for component styling; keep `app/globals.css` limited to tokens and global reset rules.
- Avoid fluid CSS sizing functions in component classes. Use readable Tailwind values (for example `text-xl`, `text-[42px]`, `p-10`) and explicit breakpoint utilities for responsive adjustments.
- Section spacing is owned by `HomeScreen`: normal adjacent sections use the shared gap, while the benefits section adds the same amount as external margin to create a deliberate double interval on desktop only.
- The home hero uses a desktop and a dedicated portrait mobile background (`public/images/hero-v3.png` and `hero-mobile-v2.png`); keep the left side of the desktop asset visually clear for the headline. On mobile, reserve the upper area for the product artwork and place the copy and CTA in the `#f8f8f8` lower zone, using the light button variant.
- The home hero presents an eyebrow, headline, supporting description, and CTA in the same order on desktop; on mobile, its lower copy zone follows the About section's title, divider, body, and 20px-horizontal/32px-vertical padding treatment.
- Keep the home hero headline as a single phrase: use a width constraint instead of manual `<br>` tags, allowing the browser to wrap naturally. On mobile, the hero is content-height based: a 435px product image (400px on narrow screens) sits above the lower copy zone.
