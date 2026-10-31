# Technical Requirements Document (TRD)

## Project Title: Link to QR Architecture & Tech Spec
**Framework:** React 18 + Vite + TypeScript  
**Styling:** Tailwind CSS v4 + Lucide Icons + Motion  
**Backend & Database:** Firebase Auth + Firestore  
**Deployment Runtime:** Cloud Run / Node.js Containerized Service  

---

## 1. System Architecture Overview

```
               +--------------------------------------------------+
               |                  Client Browser                  |
               |                                                  |
               |  +--------------------+  +--------------------+  |
               |  |  React UI Engine   |  | Service Worker SW  |  |
               |  +---------+----------+  +---------+----------+  |
               |            |                       |             |
               +------------|-----------------------|-------------+
                            |                       |
                            v                       v
               +-----------------------+  +--------------------+
               | Client Canvas Renderer|  | Static Assets Cache|
               | (qrRenderer.ts Engine)|  | (CacheManager API) |
               +------------+----------+  +--------------------+
                            |
                            v
               +-----------------------+
               | Firebase Firestore DB |
               | (Auth & Dynamic QRs)  |
               +-----------------------+
```

---

## 2. Technology Stack & Key Dependencies

| Component | Library / Service | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18, Vite | SPA rendering and ultra-fast dev compilation |
| **Language** | TypeScript 5.x | Strict type safety across encoder, renderer, and components |
| **Styling & UI** | Tailwind CSS v4, Lucide React | Utility-first styling & crisp vector iconography |
| **Animations** | Motion (`motion/react`) | Smooth modal popups and tab transition animations |
| **QR Code Encoding** | `qrcode` (npm) | Low-level QR matrix calculation |
| **Canvas Renderer** | Native HTML5 Canvas 2D API | Custom dot shapes, eye masks, frame text, and logo badge layering |
| **Database & Auth** | Firebase JS SDK (v10+) | User authentication and Firestore document persistence for dynamic QRs |
| **Cache Layer** | Service Worker (`sw.js`) & LocalStorage | Offline asset caching, draft state, and render memoization |

---

## 3. Core Technical Modules

### 3.1 QR Rendering Pipeline (`src/utils/qrRenderer.ts`)
1. **Matrix Generation:** Receives payload string and error correction level (`L`, `M`, `Q`, `H`) to generate numeric QR matrix modules.
2. **Canvas Setup:** Allocates high-DPI Canvas (`1024x1024` resolution) with smooth anti-aliasing disabled for crisp module edges.
3. **Background & Frame Draw:** Renders background color or transparent clearing, followed by selected frame outer shape and call-to-action text ("SCAN ME").
4. **Custom Module Styling:**
   - **Dots (`dotStyle`):** Standard squares, rounded rects, circular dots, or classy diamonds.
   - **Eye Finder Patterns (`eyeStyle`):** Custom outer rings and inner pupil shapes.
   - **Gradients (`gradientFg`):** Dual-color linear gradient along diagonal or vertical axes.
5. **Logo Overlay Layering:**
   - Preloads logo via `cacheManager.ts` with cross-origin CORS fallback handling.
   - Converts Google Drive sharing URLs automatically to direct image stream links.
   - Crops background badge according to selected shape (`rounded`, `circle`, `square`, `none`).
   - Draws aspect-ratio compliant logo over center module region.
6. **Website Branding Footer Badge (`includeBranding`):**
   - Automatically appends official **Link to QR** logo, platform title, and domain link (`linktoqr.in • Free QR Code`) to downloaded PNG, clipboard blob, and vector SVG files.
   - User toggle available in both Live Stage card and Customization panel (default enabled).

### 3.2 Caching Strategy (`src/utils/cacheManager.ts` & `public/sw.js`)
- **In-Memory Image Cache:** WeakMap/Map-backed `getCachedImage()` prevents re-fetching logos during real-time slider updates.
- **Render Memoization:** Hashes QR payload and visual configuration to cache rendered Canvas Data URLs (`getCachedQrDataUrl()`).
- **Draft Persistence:** Automatically serializes user state into `linktoqr_draft_cache` in LocalStorage on every input change.
- **Service Worker (`public/sw.js`):** Stale-While-Revalidate caching strategy for HTML, icons, CSS, JS, and static assets with bypass guards for Firebase/Firestore APIs.

### 3.3 Dynamic QR Data Schema (Firestore)

#### Collection: `dynamic_qrs`
```typescript
interface DynamicQrDocument {
  id: string;            // Unique short code / Firestore doc ID
  ownerUid: string;      // Firebase Auth User ID
  title: string;         // Descriptive title (e.g. "Summer Promo Flyer")
  targetUrl: string;     // Active destination URL
  shortUrl: string;      // Dynamic redirect URL (e.g. https://linktoqr.in/r/xyz123)
  scanCount: number;     // Total scan metric counter
  config: QrConfig;      // Visual style config snapshot
  createdAt: Timestamp;  // Document creation timestamp
  updatedAt: Timestamp;  // Last modified timestamp
}
```

---

## 4. Build, Lint & Quality Assurance Commands

- **Development Server:** `npm run dev` (Runs Vite on `0.0.0.0:3000`)
- **Linter Check:** `npm run lint` (`tsc --noEmit` type checking)
- **Production Build:** `npm run build` (Outputs optimized production bundle in `dist/`)
- **Production Preview:** `npm run preview`
