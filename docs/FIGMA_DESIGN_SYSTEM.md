# YouthConnect Figma Design System & UI Kit

This repository provides a complete Figma design package for the **YouthConnect Hyperlocal Collegiate Campus Hub** web application.

---

## 📦 What’s Included in This Package

1. **`figma-ui-kit.svg`** — Ready-to-use vector canvas containing:
   - **Design System Tokens & Palette Frame**: Colors, typography scales, glassmorphic layer properties, shadow values.
   - **Desktop Landing Hero Frame**: Full 1440px+ frame with navigation bar, floating prize/credit badges, glow emblem, hero headline, CTA, and 4-column metric pillars.
   - **Interactive Event Card Component**: Verified badges, category pills, price tags, title in The Seasons, description in Gotham, and action buttons.
   - **Digital Ticket QR Pass Component**: Cut-line dashed border, VIP ribbon, dynamic QR matrix, PRN student details, and ticket ID badge.
2. **`figma-tokens.json`** — Standard W3C / Tokens Studio JSON design tokens for Figma Variables & Tokens Studio plugin.
3. **`index.html`** — Production single-file web app ready for 1-click import using Figma HTML importer plugins.

---

## 🚀 3 Ways to Import Into Figma

### Method 1: Instant Drag & Drop (Recommended)
1. Open [Figma](https://www.figma.com/) and create a **New Design File**.
2. Simply drag and drop [`figma-ui-kit.svg`](../figma-ui-kit.svg) directly onto your Figma canvas.
3. Figma will immediately generate fully editable vector layers, gradients, text blocks, and component frames!

---

### Method 2: Import Design Tokens & Variables via Tokens Studio
1. In Figma, open the **Tokens Studio for Figma** plugin (or Figma Variables).
2. Go to **Settings / Load Token Set** and select [`figma-tokens.json`](../figma-tokens.json).
3. All design tokens (Colors, The Seasons / Gotham typography styles, glassmorphism border radii, and cosmic box-shadows) will sync to your Figma local variables.

---

### Method 3: 1-Click Live HTML-to-Figma Conversion (Full Responsive Auto-Layout)
If you want the entire dynamic web app converted directly to Auto-Layout frames:
1. In Figma, open the **html.to.design** or **Builder.io HTML to Figma** plugin.
2. Choose **"Import Local HTML"** or serve `index.html` locally via Live Server / Vite (`http://localhost:5173`).
3. Select screen presets (**Desktop 1440px**, **Tablet 768px**, **Mobile 390px**).
4. Click **Import** — the plugin creates pixel-perfect Auto Layout Figma components with editable typography, forms, modals, and hover states.

---

## 🎨 Design Tokens Summary

### Typography
* **Main Headers, Section Titles & Highlight Metrics**:
  * Font Family: `The Seasons` (Fallback: `Playfair Display`, `Bodoni MT`, `Georgia`)
  * `H1 Hero Headline`: 56px / 64px, Bold
  * `H2 Section Title`: 32px / 40px, Bold
  * `H4 Card Title`: 18px / 24px, Bold
  * `Stat Highlight`: 28px–32px, Bold
* **Descriptions, Body Copy & Form Elements**:
  * Font Family: `Gotham` (Fallback: `Gotham Pro`, `Montserrat`, `Inter`, `sans-serif`)
  * `Lead Description`: 18px / 28px, Regular
  * `Body Text`: 14px / 22px, Regular
  * `Caption / Micro`: 12px / 18px, Medium
  * `Pill Badges`: 11px / 14px, Bold

### Core Color Palette
| Token Name | Hex / Value | Description |
| :--- | :--- | :--- |
| `bg-canvas` | `#070913` | Deep Space Cosmic Background |
| `bg-surface` | `#181126` | Modal & Dropdown Dark Surface |
| `brand-primary` | `#8B7CB6` | YouthConnect Lavender Purple |
| `brand-primary-dark`| `#7C6BA6` | Active Primary State |
| `brand-pink` | `#EC4899` | High-energy Neon Accent Pink |
| `status-emerald` | `#10B981` | Free Passes & Verified Credentials |
| `status-amber` | `#F59E0B` | Cash Grants & Trending Hackathons |
| `glass-surface` | `rgba(255, 255, 255, 0.10)` | 3D Cosmic Glassmorphic Panels |
| `glass-border` | `rgba(255, 255, 255, 0.18)` | Frosted Panel Borders |
