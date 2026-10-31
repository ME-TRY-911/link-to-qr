# Product Requirements Document (PRD)

## Project Title: Link to QR (linktoqr.in)
**Official Domain:** `https://linktoqr.in/`  
**Version:** 1.2.0  
**Target Audience:** Businesses, Marketers, Developers, Designers, Event Organizers, Restaurants, and General Users looking for free, high-resolution, branded vector QR codes.

---

## 1. Executive Summary & Value Proposition

**Link to QR** is an all-in-one, enterprise-grade, privacy-first QR code generator and management platform. It empowers users to instantly convert web links (URLs), Wi-Fi credentials, digital business cards (vCard), plain text, SMS messages, phone numbers, calendar events, mobile app store links, and PDF documents into beautifully customized QR codes.

### Core Differentiators & Key Strengths:
- **100% Free & Unlimited Static QR Code Generation:** No mandatory sign-up, subscription fees, hidden paywalls, or scan limits.
- **High-Resolution Vector SVG & PNG Export:** Crisp PNG downloads (up to 1024px+) and scalable vector SVG files suitable for billboard and packaging print runs.
- **Custom Branding & Logo Engine:** Center logo badge overlays with shape cropping (round, square, shield), Google Drive image URL auto-conversion, and official brand presets (WhatsApp, Instagram, Google Reviews, Wi-Fi).
- **Dynamic QR Code Engine:** Powered by Firebase Firestore for real-time target URL updates and scan tracking without re-printing physical materials.
- **Client-Side Privacy & Offline Capability:** Static QR codes are generated 100% locally in the user's browser canvas without transmitting sensitive payload data to external servers.
- **Comprehensive SEO & Meta Infrastructure:** Built-in Schema.org JSON-LD structured data, OpenGraph / Twitter preview cards, XML Sitemap (`/sitemap.xml`), Robots (`/robots.txt`), and rich knowledge base content.

---

## 2. Technical Stack & Architecture

| Layer | Technologies & Frameworks |
| :--- | :--- |
| **Frontend Framework** | React 18+ with TypeScript & Vite |
| **Styling & UI** | Tailwind CSS v4, Lucide React Icons, Plus Jakarta Sans & Outfit Fonts |
| **State & Local Storage** | React Hooks, LocalStorage Draft Caching, Recent Downloads Cache |
| **Backend & Database** | Firebase Firestore (Dynamic QR Code metadata & Analytics), Firebase Auth |
| **Image Hosting** | Cloudinary CDN (OpenGraph previews & static assets) |
| **SEO & Crawling** | Canonical Tags, OpenGraph Protocol, Schema.org JSON-LD, XML Sitemap, Robots.txt |
| **PWA & Offline** | Service Worker (`sw.js`) with stale-while-revalidate strategy |

---

## 3. Detailed Functional Requirements

### 3.1 QR Code Content Types (10 Supported Modes)
1. **URL / Website Link (`/url`):** Converts any web address into a QR code with automatic protocol (`https://`) validation.
2. **Wi-Fi Network (`/wifi`):** Encrypts SSID, Password, and Network Security mode (WPA/WPA2/WPA3, WEP, or Open/None).
3. **vCard Digital Business Card (`/vcard`):** Encodes full contact info (First/Last Name, Organization, Title, Phone, Email, Address, Website) that prompts 1-click phonebook saving on smartphones.
4. **Plain Text (`/text`):** Encodes multi-line text snippets, keys, notes, or instructions.
5. **Email Address (`/email`):** Pre-fills recipient email address, subject line, and body content.
6. **Phone Number:** Dial-ready payload launching native phone app (`tel:`).
7. **SMS Payload:** Pre-filled destination number and message text.
8. **Calendar Event:** Includes event title, venue location, start/end dates/times, and event notes.
9. **App Store Router:** Consolidates Apple App Store and Google Play links into a unified scannable code.
10. **PDF / Document Link:** Connects users directly to online hosted PDF files, menus, or catalogs.

### 3.2 Visual Customization Engine
- **Dot Matrix Patterns:** Square, Rounded Dots, Smooth Curves, Classy Diamonds.
- **Finder Eyes (Corners):** Square, Rounded Corners, Circular Ring Finder Eyes.
- **Foreground Colors:** Solid Custom Hex Code or 2-Color Linear Gradients.
- **Background Control:** Solid Color or Transparent Background (`#00000000`).
- **CTA Frames:** Custom outer frames featuring labels like "SCAN ME", "DISCOVER", "CONNECT", with editable background and text colors.
- **Logo Integration:** Upload custom image, paste image URL, or auto-convert Google Drive shareable links. Includes preset logos for WhatsApp, Instagram, Google Reviews, and Wi-Fi.
- **Error Correction Levels:** L (7%), M (15%), Q (25%), H (30%) data restoration capacity.

### 3.3 Dynamic QR & Analytics (Firebase Powered)
- User Authentication via Google OAuth and Email/Password.
- Dashboard to manage saved dynamic QR codes.
- Real-time destination URL redirection editing without changing printed QR graphics.
- Scan activity counters and timestamp logging.

### 3.4 Built-In Utilities
- **Webcam QR Scanner:** Real-time camera scanner and file drop box to decode QR images directly in the browser.
- **Draft Auto-Save:** Preserves current generator form configuration locally to prevent data loss upon page reload.
- **Download History:** Saves the last 20 generated QR codes locally for quick re-export.

---

## 4. Search Engine Optimization (SEO) & Search Console Architecture

### 4.1 Global SEO Meta Configuration
- **Title:** `Free QR Code Generator – Create Custom QR Codes Online | Link to QR`
- **Description:** `Create free custom QR codes for URLs, WiFi, vCards, text and email. Add logos, colors and custom styles, then download your QR code as PNG or SVG. No signup required.`
- **Canonical URL:** `https://linktoqr.in/`
- **OpenGraph & Twitter Cards:** Configured with Cloudinary-hosted 1200x630 high-resolution preview images (`WhatsApp_Image_2026-07-31_at_2.57.49_PM_yagerg.png`).
- **Structured Data (Schema.org):** Implements `@type: WebApplication` and `@type: Organization` JSON-LD scripts.

### 4.2 Sitemaps & Search Console Indexing Status
- **`sitemap.xml` Routes:**
  - `https://linktoqr.in/` (Homepage - Priority 1.0)
  - `https://linktoqr.in/url` (URL QR Code Generator - Priority 0.8)
  - `https://linktoqr.in/wifi` (Wi-Fi QR Code Generator - Priority 0.8)
  - `https://linktoqr.in/vcard` (vCard QR Code Generator - Priority 0.8)
  - `https://linktoqr.in/text` (Text QR Code Generator - Priority 0.8)
  - `https://linktoqr.in/email` (Email QR Code Generator - Priority 0.8)
  - `https://linktoqr.in/qr-code-seo-guide` (Complete QR Code SEO Guide - Priority 0.7)

- **Search Console Status:**
  - Homepage (`https://linktoqr.in/`) is successfully **Indexed**.
  - Subpage routes are discovered by Google crawlers and undergoing standard indexing progression via Search Console URL Inspection.

---

## 5. UI Component Hierarchy & Architecture

```
src/
├── App.tsx                     # Main layout controller, routing, and modal states
├── main.tsx                    # React DOM entry point
├── index.css                   # Tailwind CSS global styles
├── components/
│   ├── Navbar.tsx              # Sticky header with navigation links, scanner trigger, and auth trigger
│   ├── HeroSection.tsx         # Main heading badge and intro text
│   ├── QrGenerator/
│   │   ├── QrGeneratorCard.tsx # Main generator panel container
│   │   └── TypeForms.tsx       # Content input forms for URL, Wi-Fi, vCard, Text, Email, etc.
│   ├── TrustBadges.tsx         # Highlight badges (100% Free, Vector SVG, Local Privacy)
│   ├── FeaturesSection.tsx     # Feature grid highlighting customization options
│   ├── HowItWorks.tsx          # 3-step guide (Select Type -> Customize -> Download)
│   ├── UseCasesSection.tsx     # Industry use cases (Restaurants, Marketing, Events, Business)
│   ├── StatsSection.tsx        # Usage metrics and trust counters
│   ├── FaqSection.tsx          # Frequently Asked Questions with accordion UI
│   ├── SeoContentSection.tsx   # Knowledge base content & URL to QR guide
│   ├── RelatedToolsSection.tsx # Links to related QR utility modes
│   ├── CtaBanner.tsx           # Call-to-action banner for dynamic QR registration
│   ├── Footer.tsx              # Footer navigation, copyright, and modal triggers
│   ├── ScannerModal.tsx        # Webcam & image upload QR decoder modal
│   ├── AuthModal.tsx           # Firebase user login & registration modal
│   ├── UserDashboardModal.tsx  # Dynamic QR code management dashboard
│   ├── PrivacyPolicyModal.tsx # Privacy policy modal
│   ├── AboutUsModal.tsx        # About us modal
│   └── SitemapModal.tsx        # Interactive site structure modal
```

---

## 6. Non-Functional Requirements (NFRs)
- **Performance:** Sub-100ms client-side canvas render speed, Google PageSpeed score > 90.
- **Responsiveness:** Desktop-first precision with mobile-first code adapting seamlessly across smartphones, tablets, and desktop displays.
- **Accessibility:** Passes WCAG AA contrast standards, keyboard accessible forms, and high-visibility status badges.
- **Privacy & Security:** No server-side payload storage for static QR codes; dynamic links managed securely via Firebase security rules.

