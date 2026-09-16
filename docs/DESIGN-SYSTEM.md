# ScriptlyStore — Design System Specification

## 1. Design Philosophy: Restrained Technical Marketplace

ScriptlyStore rejects gamified cartoon visuals (3D block shadows, oversized pill radii, bright pastel novelty buttons). Instead, it adopts the aesthetic rigor of modern developer tools (Stripe, Linear, Vercel, Raycast):

- **Calm, High Information Density**: Generous structured spacing with tight, scannable data layouts.
- **Content-First**: Product screenshots, code frameworks, verifiable metrics, and price transparency dominate over decorative shapes.
- **Subtle Layering & Depth**: Refined 1px neutral borders (`border-border/60`), muted background elevations (`surface-muted`), and soft, realistic ambient shadows (`shadow-sm` / `shadow-md`).
- **Tactile, Purposeful Micro-interactions**: Fast 150ms transitions communicating focus, state changes, and feedback without layout thrashing.

---

## 2. Color Palette & Semantic Tokens

### Light Mode
- **Background (`--background`)**: `#FFFFFF` (Pure crisp white)
- **Surface Elevated (`--card`)**: `#FFFFFF`
- **Surface Muted (`--muted`)**: `#F8FAFC` (Slate 50)
- **Border Subtle (`--border`)**: `#E2E8F0` (Slate 200)
- **Border Strong (`--border-strong`)**: `#CBD5E1` (Slate 300)
- **Foreground Primary (`--foreground`)**: `#0F172A` (Slate 900)
- **Foreground Secondary (`--foreground-secondary`)**: `#334155` (Slate 700)
- **Foreground Muted (`--muted-foreground`)**: `#64748B` (Slate 500)
- **Brand Accent (`--primary`)**: `#0284C7` / `#0EA5E9` (Refined technical cyan/sky) or `#10B981` (Emerald for success/free)
- **Destructive (`--destructive`)**: `#EF4444` (Rose 500)

### Dark Mode
- **Background (`--background`)**: `#090D11` (Deep slate neutral, not jet black)
- **Surface Elevated (`--card`)**: `#111822` (Subtle lifted navy-slate)
- **Surface Muted (`--muted`)**: `#16202D`
- **Border Subtle (`--border`)**: `#1E293B` (Slate 800)
- **Border Strong (`--border-strong`)**: `#334155` (Slate 700)
- **Foreground Primary (`--foreground`)**: `#F8FAFC` (Slate 50)
- **Foreground Secondary (`--foreground-secondary`)**: `#CBD5E1` (Slate 300)
- **Foreground Muted (`--muted-foreground`)**: `#94A3B8` (Slate 400)

---

## 3. Typography Hierarchy

Primary Font: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `Roboto`, sans-serif.
Monospace Font: `JetBrains Mono`, `Fira Code`, `ui-monospace`, monospace.

| Scale | Size | Line Height | Tracking | Weight | Usage |
|---|---|---|---|---|---|
| Display | 2.5rem (40px) | 1.15 | -0.03em | 700 | Primary hero headline |
| H1 | 2.0rem (32px) | 1.2 | -0.025em | 600 | Page titles, major section headings |
| H2 | 1.5rem (24px) | 1.25 | -0.02em | 600 | Product title, dashboard card headers |
| H3 | 1.25rem (20px) | 1.3 | -0.015em | 600 | Section subtitles, card titles |
| Body-Lg | 1.125rem (18px)| 1.6 | normal | 400/500 | Hero lead text, overview summaries |
| Body | 0.9375rem (15px)| 1.55 | normal | 400/500 | Default UI text, descriptions, table cells |
| Body-Sm | 0.8125rem (13px)| 1.5 | normal | 400/500 | Metadata, helper text, timestamps |
| Caption | 0.75rem (12px) | 1.4 | +0.01em | 500 | Badges, tags, form field captions |
| Code | 0.8125rem (13px)| 1.5 | normal | 400 | Code snippets, CLI commands, parameters |

---

## 4. Radii & Spacing System

- **Corner Radius**:
  - `radius-sm`: `6px` (tags, small badges, tooltips)
  - `radius-md`: `8px` (inputs, buttons, select dropdowns)
  - `radius-lg`: `12px` (cards, modals, popovers)
  - `radius-xl`: `16px` (hero panels, preview containers)
  - *No more `rounded-[2rem]` or `30px` pill bubbles.*

- **Spacing Grid**: Standard 4px / 8px scale (`gap-1`, `gap-2`, `gap-4`, `gap-6`, `gap-8`, `gap-12`).

---

## 5. UI Primitives

### Buttons
- **Primary**: Solid accent background, crisp white text, subtle shadow, clean active press (`active:scale-[0.99]`).
- **Secondary**: Neutral surface (`bg-muted/80`), subtle border, high-contrast text.
- **Outline**: Clean 1px border (`border-border`), transparent background, hover subtle fill.
- **Ghost**: Transparent background, text highlight on hover.
- **Destructive**: Subdued rose/red surface with clear danger styling.

### Cards
- **Border**: Single 1px border `border-border/70`.
- **Hover**: Subtle border illumination (`hover:border-foreground/20`), minimal vertical lift (`-2px`).
- **No cartoon 3D bottom drops** (`box-shadow: 0 4px 0 #...` is strictly eliminated).

### Product Cards
- Aspect ratio: `16:10` clean media frame.
- Badges: Minimal category label, honest rating (only when reviews > 0), tech stack pills.
- Typography: Concise title (1-2 lines), short value proposition, clear USD/INR price, quick action.

---

## 6. Accessibility & Motion Guidelines

- All interactive controls have visible, high-contrast keyboard focus indicators (`focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none`).
- Minimum touch targets on mobile: 44px x 44px.
- `@media (prefers-reduced-motion: reduce)` respected globally across transitions.
- All SVG icons have `aria-hidden="true"` or accompanying screen-reader labels.
