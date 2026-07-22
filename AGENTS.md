<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project architecture

- Use Bun for package commands. Do not introduce npm or yarn lockfiles.
- `app/` contains only Next.js route entry points, root layout and global CSS.
- Reusable UI belongs in `components/` (for example `Header`, `Footer`, `Button`).
- A page is assembled in `screens/<page>/<Page>Screen.tsx`; UI used by one screen only belongs in its `components/` directory.
- Put public static assets in `public/` and reference them with root-relative paths (for example `/images/hero.png`).
- Keep temporary data that will later be received from the backend in `mock/`; screen components consume mock data through imports instead of owning it inline.
- For horizontal, touch-friendly carousels use `swiper`; keep their slide data in `mock/` until the corresponding API is connected. Category tabs must filter their mock data and reset the carousel to its first slide.
- Typography uses Inter for interface text and the locally bundled Helvetica Neue where explicitly needed.
- Use Tailwind utility classes for component styling; keep `app/globals.css` limited to tokens and global reset rules.
- Section spacing is owned by `HomeScreen`: normal adjacent sections use the shared gap, while the benefits section adds the same amount as external margin to create a deliberate double interval.
- The home hero uses a desktop and a dedicated portrait mobile background (`public/images/hero.png` and `hero-mobile-v2.png`); keep the mobile copy and CTA in the lower contrast overlay rather than cropping the desktop artwork.
