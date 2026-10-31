/**
 * Cache Manager Utility for Link to QR
 * Provides high-performance in-memory and local persistent caching
 * for images, QR renders, user draft forms, and QR history.
 */

import { QrConfig } from '../types';

// ---------------------------------------------------------------------------
// 1. In-Memory Image Cache
// ---------------------------------------------------------------------------
const imageCacheMap = new Map<string, HTMLImageElement>();
const imagePendingMap = new Map<string, Promise<HTMLImageElement | null>>();

/**
 * Preloads and caches an image element in memory by URL.
 */
export function getCachedImage(url: string): Promise<HTMLImageElement | null> {
  if (!url) return Promise.resolve(null);
  
  const trimmed = url.trim();
  if (imageCacheMap.has(trimmed)) {
    return Promise.resolve(imageCacheMap.get(trimmed)!);
  }

  if (imagePendingMap.has(trimmed)) {
    return imagePendingMap.get(trimmed)!;
  }

  const loadPromise = new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    if (!trimmed.startsWith('data:') && !trimmed.startsWith('blob:')) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      imageCacheMap.set(trimmed, img);
      imagePendingMap.delete(trimmed);
      resolve(img);
    };

    img.onerror = () => {
      // Retry without crossOrigin CORS requirement
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        imageCacheMap.set(trimmed, fallbackImg);
        imagePendingMap.delete(trimmed);
        resolve(fallbackImg);
      };
      fallbackImg.onerror = () => {
        imagePendingMap.delete(trimmed);
        resolve(null);
      };
      fallbackImg.src = trimmed;
    };

    img.src = trimmed;
  });

  imagePendingMap.set(trimmed, loadPromise);
  return loadPromise;
}

// ---------------------------------------------------------------------------
// 2. In-Memory QR Render Cache (DataURL Memoization)
// ---------------------------------------------------------------------------
const renderCacheMap = new Map<string, string>();
const MAX_RENDER_CACHE = 50;

/**
 * Creates a unique string hash from payload & QrConfig
 */
export function createQrCacheKey(payload: string, config: QrConfig): string {
  return JSON.stringify({
    payload,
    type: config.type,
    fgColor: config.fgColor,
    fgColorEnd: config.fgColorEnd,
    gradientFg: config.gradientFg,
    bgColor: config.bgColor,
    transparentBg: config.transparentBg,
    dotStyle: config.dotStyle,
    eyeStyle: config.eyeStyle,
    frameStyle: config.frameStyle,
    frameText: config.frameText,
    logo: config.logo,
    logoSizePercent: config.logoSizePercent,
    logoShape: config.logoShape,
    errorCorrectionLevel: config.errorCorrectionLevel,
  });
}

export function getCachedQrDataUrl(cacheKey: string): string | null {
  return renderCacheMap.get(cacheKey) || null;
}

export function setCachedQrDataUrl(cacheKey: string, dataUrl: string): void {
  if (renderCacheMap.size >= MAX_RENDER_CACHE) {
    const firstKey = renderCacheMap.keys().next().value;
    if (firstKey) renderCacheMap.delete(firstKey);
  }
  renderCacheMap.set(cacheKey, dataUrl);
}

// ---------------------------------------------------------------------------
// 3. Persistent Draft Form Cache (LocalStorage)
// ---------------------------------------------------------------------------
const DRAFT_CACHE_KEY = 'linktoqr_draft_cache';

export function saveDraftConfigCache(config: QrConfig): void {
  try {
    localStorage.setItem(DRAFT_CACHE_KEY, JSON.stringify({
      config,
      updatedAt: Date.now(),
    }));
  } catch {
    // Graceful fallback if storage full or restricted
  }
}

export function loadDraftConfigCache(): QrConfig | null {
  try {
    const raw = localStorage.getItem(DRAFT_CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data?.config || null;
  } catch {
    return null;
  }
}

export function clearDraftConfigCache(): void {
  try {
    localStorage.removeItem(DRAFT_CACHE_KEY);
  } catch {
    // Ignore error
  }
}

// ---------------------------------------------------------------------------
// 4. Persistent Recent History Cache (LocalStorage)
// ---------------------------------------------------------------------------
const HISTORY_CACHE_KEY = 'linktoqr_history_cache';
const MAX_HISTORY_ITEMS = 20;

export interface CachedHistoryItem {
  id: string;
  title: string;
  type: string;
  dataUrl: string;
  payload: string;
  config: QrConfig;
  createdAt: string;
}

export function saveToHistoryCache(item: Omit<CachedHistoryItem, 'id' | 'createdAt'>): CachedHistoryItem[] {
  try {
    const existing = getHistoryCache();
    const newItem: CachedHistoryItem = {
      ...item,
      id: `cache_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };

    // Prevent duplicate entries for exact same payload & title
    const filtered = existing.filter(h => h.payload !== item.payload || h.title !== item.title);
    const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(HISTORY_CACHE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return getHistoryCache();
  }
}

export function getHistoryCache(): CachedHistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_CACHE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CachedHistoryItem[];
  } catch {
    return [];
  }
}

export function clearHistoryCache(): void {
  try {
    localStorage.removeItem(HISTORY_CACHE_KEY);
  } catch {
    // Ignore error
  }
}
