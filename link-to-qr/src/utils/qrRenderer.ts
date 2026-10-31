import QRCode from 'qrcode';
import { QrConfig } from '../types';
import { getCachedImage } from './cacheManager';
import { BRAND_LOGO_DATA_URI } from './brandLogoData';

// Pre-instantiate brand logo in memory so it is ready immediately for canvas render
let preloadedBrandLogo: HTMLImageElement | null = null;
if (typeof window !== 'undefined') {
  try {
    preloadedBrandLogo = new Image();
    preloadedBrandLogo.src = BRAND_LOGO_DATA_URI;
  } catch {
    // Ignore in non-browser environments
  }
}

/**
 * Path helper to construct a rounded rectangle path without filling or stroking
 */
function pathRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radii: number | number[]
) {
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, width, height, radii);
    return;
  }

  // Fallback for older canvas implementations
  const r = typeof radii === 'number' ? radii : radii[0] || 0;
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function fillRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radii: number | number[]
) {
  pathRoundRect(ctx, x, y, width, height, radii);
  ctx.fill();
}

function strokeRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radii: number | number[]
) {
  pathRoundRect(ctx, x, y, width, height, radii);
  ctx.stroke();
}

/**
 * Helper to draw filled rounded rectangle with cross-browser safety fallback
 */
function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radii: number | number[]
) {
  fillRoundRect(ctx, x, y, width, height, radii);
}

function pathBadgeShape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  shape: 'circle' | 'rounded' | 'square' | 'none'
) {
  ctx.beginPath();
  if (shape === 'circle') {
    const cx = x + size / 2;
    const cy = y + size / 2;
    ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
  } else if (shape === 'rounded') {
    const r = size * 0.22;
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x, y, size, size, r);
    } else {
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + size - r, y);
      ctx.quadraticCurveTo(x + size, y, x + size, y + r);
      ctx.lineTo(x + size, y + size - r);
      ctx.quadraticCurveTo(x + size, y + size, x + size - r, y + size);
      ctx.lineTo(x + r, y + size);
      ctx.quadraticCurveTo(x, y + size, x, y + size - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }
  } else if (shape === 'square') {
    ctx.rect(x, y, size, size);
  }
}

/**
 * Check if module coordinate belongs to one of the 3 corner finder patterns (7x7)
 */
function isFinderPattern(row: number, col: number, size: number): boolean {
  // Top-Left
  if (row < 7 && col < 7) return true;
  // Top-Right
  if (row < 7 && col >= size - 7) return true;
  // Bottom-Left
  if (row >= size - 7 && col < 7) return true;
  return false;
}

function isColorDark(hexColor: string): boolean {
  if (!hexColor || hexColor === 'transparent') return false;
  let hex = hexColor.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map((c) => c + c).join('');
  }
  if (hex.length < 6) return false;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 135;
}

export function convertGoogleDriveUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  const driveRegex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)|lh3\.googleusercontent\.com\/d\/)([a-zA-Z0-9_-]+)/;
  const match = trimmed.match(driveRegex);
  if (match && match[1]) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  return trimmed;
}

/**
 * Main QR Canvas Renderer supporting all dot styles, eye shapes, gradient fill, frame banners, and Link to QR branding footer
 */
export async function renderQrToCanvas(
  canvas: HTMLCanvasElement,
  payload: string,
  config: QrConfig,
  targetSize: number = 600
): Promise<void> {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Generate QR matrix using QRCode.create (enforce 'H' when logo is present for scannability)
  const ecl = config.logo ? 'H' : (config.errorCorrectionLevel || 'M');
  const qr = QRCode.create(payload || 'https://linktoqr.in', {
    errorCorrectionLevel: ecl,
  });

  const matrixSize = qr.modules.size;
  const margin = 2; // module margin
  const totalModules = matrixSize + margin * 2;

  // Canvas size setup
  let canvasWidth = targetSize;
  let canvasHeight = targetSize;

  // Frame layout padding
  let qrTopOffset = 0;
  let qrBottomOffset = 0;
  let qrSideOffset = 0;

  // Website branding footer (default: true so exported QR carries website name & logo)
  const hasBranding = config.includeBranding !== false;
  const brandingHeight = hasBranding ? Math.round(targetSize * 0.135) : 0;

  const hasFrame = config.frameStyle && config.frameStyle !== 'none';
  const frameText = config.frameText || 'SCAN ME';

  if (hasFrame) {
    if (config.frameStyle === 'banner') {
      qrBottomOffset = targetSize * 0.16; // extra height for bottom banner
      canvasHeight += qrBottomOffset;
    } else if (config.frameStyle === 'badge') {
      qrTopOffset = targetSize * 0.14; // extra height for top header badge
      canvasHeight += qrTopOffset;
    } else if (config.frameStyle === 'card') {
      qrTopOffset = targetSize * 0.12;
      qrBottomOffset = targetSize * 0.16;
      qrSideOffset = targetSize * 0.08;
      canvasWidth += qrSideOffset * 2;
      canvasHeight += qrTopOffset + qrBottomOffset;
    }
  }

  // Add extra canvas height for the Link to QR branding footer
  canvasHeight += brandingHeight;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // Clear canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Background
  const bgColor = config.transparentBg ? '#00000000' : config.bgColor || '#ffffff';
  
  if (config.frameStyle === 'card') {
    // Outer frame card container
    if (!config.transparentBg) {
      ctx.fillStyle = bgColor;
      drawRoundRect(ctx, 0, 0, canvasWidth, canvasHeight, 32);
    }
  } else if (!config.transparentBg) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  // QR Module dimensions
  const availableQrWidth = canvasWidth - qrSideOffset * 2;
  const availableQrHeight = canvasHeight - qrTopOffset - qrBottomOffset - brandingHeight;
  const qrDimension = Math.min(availableQrWidth, availableQrHeight);

  const cellSize = qrDimension / totalModules;
  const startX = qrSideOffset + (availableQrWidth - qrDimension) / 2 + margin * cellSize;
  const startY = qrTopOffset + (availableQrHeight - qrDimension) / 2 + margin * cellSize;

  // Prepare Foreground Fill (Solid or Gradient)
  let fgStyle: string | CanvasGradient = config.fgColor || '#000000';
  if (config.gradientFg && config.fgColorEnd) {
    const grad = ctx.createLinearGradient(startX, startY, startX + qrDimension, startY + qrDimension);
    grad.addColorStop(0, config.fgColor);
    grad.addColorStop(1, config.fgColorEnd);
    fgStyle = grad;
  }

  // -------------------------------------------------------------
  // 1. Draw Body Modules (excluding Finder Patterns)
  // -------------------------------------------------------------
  ctx.fillStyle = fgStyle;

  for (let row = 0; row < matrixSize; row++) {
    for (let col = 0; col < matrixSize; col++) {
      if (isFinderPattern(row, col, matrixSize)) continue;

      const isDark = qr.modules.get(row, col);
      if (!isDark) continue;

      const cellX = startX + col * cellSize;
      const cellY = startY + row * cellSize;

      const style = config.dotStyle || 'square';

      if (style === 'dots') {
        ctx.beginPath();
        ctx.arc(cellX + cellSize / 2, cellY + cellSize / 2, cellSize * 0.42, 0, Math.PI * 2);
        ctx.fill();
      } else if (style === 'rounded') {
        drawRoundRect(ctx, cellX + 0.5, cellY + 0.5, cellSize - 1, cellSize - 1, cellSize * 0.35);
      } else if (style === 'classy') {
        drawRoundRect(ctx, cellX + 0.5, cellY + 0.5, cellSize - 1, cellSize - 1, [
          cellSize * 0.4,
          0,
          cellSize * 0.4,
          0,
        ]);
      } else {
        // 'square' default
        ctx.fillRect(cellX, cellY, cellSize, cellSize);
      }
    }
  }

  // -------------------------------------------------------------
  // 2. Draw Finder Patterns (Eyes) - TopLeft, TopRight, BottomLeft
  // -------------------------------------------------------------
  const eyePositions = [
    { row: 0, col: 0 },
    { row: 0, col: matrixSize - 7 },
    { row: matrixSize - 7, col: 0 },
  ];

  const eyeStyle = config.eyeStyle || 'square';

  eyePositions.forEach(({ row, col }) => {
    const eyeX = startX + col * cellSize;
    const eyeY = startY + row * cellSize;
    const eyeSize = 7 * cellSize;

    const outerR = eyeStyle === 'circle' ? eyeSize / 2 : eyeStyle === 'rounded' ? cellSize * 1.8 : cellSize * 0.5;
    const innerBgR = eyeStyle === 'circle' ? (5 * cellSize) / 2 : eyeStyle === 'rounded' ? cellSize * 1.2 : cellSize * 0.3;
    const centerR = eyeStyle === 'circle' ? (3 * cellSize) / 2 : eyeStyle === 'rounded' ? cellSize * 0.8 : cellSize * 0.2;

    // Outer Eye Box (7x7)
    ctx.fillStyle = fgStyle;
    if (eyeStyle === 'circle') {
      ctx.beginPath();
      ctx.arc(eyeX + eyeSize / 2, eyeY + eyeSize / 2, eyeSize / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (eyeStyle === 'leaf') {
      drawRoundRect(ctx, eyeX, eyeY, eyeSize, eyeSize, [eyeSize * 0.4, 0, eyeSize * 0.4, 0]);
    } else if (eyeStyle === 'rounded') {
      drawRoundRect(ctx, eyeX, eyeY, eyeSize, eyeSize, outerR);
    } else {
      ctx.fillRect(eyeX, eyeY, eyeSize, eyeSize);
    }

    // Inner Cutout Box (5x5)
    ctx.fillStyle = bgColor;
    const cutoutX = eyeX + cellSize;
    const cutoutY = eyeY + cellSize;
    const cutoutSize = 5 * cellSize;

    if (eyeStyle === 'circle') {
      ctx.beginPath();
      ctx.arc(eyeX + eyeSize / 2, eyeY + eyeSize / 2, (5 * cellSize) / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (eyeStyle === 'leaf') {
      drawRoundRect(ctx, cutoutX, cutoutY, cutoutSize, cutoutSize, [cutoutSize * 0.35, 0, cutoutSize * 0.35, 0]);
    } else if (eyeStyle === 'rounded') {
      drawRoundRect(ctx, cutoutX, cutoutY, cutoutSize, cutoutSize, innerBgR);
    } else {
      ctx.fillRect(cutoutX, cutoutY, cutoutSize, cutoutSize);
    }

    // Center Eye Dot (3x3)
    ctx.fillStyle = fgStyle;
    const centerX = eyeX + 2 * cellSize;
    const centerY = eyeY + 2 * cellSize;
    const centerDotSize = 3 * cellSize;

    if (eyeStyle === 'circle') {
      ctx.beginPath();
      ctx.arc(eyeX + eyeSize / 2, eyeY + eyeSize / 2, (3 * cellSize) / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (eyeStyle === 'leaf') {
      drawRoundRect(ctx, centerX, centerY, centerDotSize, centerDotSize, [centerDotSize * 0.3, 0, centerDotSize * 0.3, 0]);
    } else if (eyeStyle === 'rounded') {
      drawRoundRect(ctx, centerX, centerY, centerDotSize, centerDotSize, centerR);
    } else {
      ctx.fillRect(centerX, centerY, centerDotSize, centerDotSize);
    }
  });

  // -------------------------------------------------------------
  // 3. Draw Center Logo Overlay if present
  // -------------------------------------------------------------
  if (config.logo) {
    const convertedUrl = convertGoogleDriveUrl(config.logo);
    const logoImg = await getCachedImage(convertedUrl);
    
    if (logoImg) {
      const sizePercent = Math.min(Math.max(config.logoSizePercent || 22, 10), 35);
      const badgeSize = qrDimension * (sizePercent / 100);
      const badgeX = startX + (qrDimension - badgeSize) / 2;
      const badgeY = startY + (qrDimension - badgeSize) / 2;
      const shape = config.logoShape || 'rounded';

      ctx.save();

      if (shape !== 'none') {
        // Draw badge background
        ctx.fillStyle = bgColor === '#00000000' ? '#ffffff' : bgColor;
        pathBadgeShape(ctx, badgeX, badgeY, badgeSize, shape);
        ctx.fill();

        // Draw badge border
        ctx.lineWidth = Math.max(2, qrDimension * 0.005);
        ctx.strokeStyle = typeof fgStyle === 'string' ? fgStyle : config.fgColor;
        ctx.stroke();
      }

      // Determine image dimensions with aspect ratio preservation
      const innerPadding = shape === 'none' ? 0 : badgeSize * 0.08;
      const maxImgDim = badgeSize - innerPadding * 2;
      let imgW = maxImgDim;
      let imgH = maxImgDim;

      if (logoImg.width > 0 && logoImg.height > 0) {
        const aspect = logoImg.width / logoImg.height;
        if (aspect > 1) {
          imgH = maxImgDim / aspect;
        } else {
          imgW = maxImgDim * aspect;
        }
      }

      const imgX = badgeX + (badgeSize - imgW) / 2;
      const imgY = badgeY + (badgeSize - imgH) / 2;

      // Clip image inside badge bounds
      if (shape !== 'none') {
        ctx.save();
        pathBadgeShape(ctx, badgeX + 1, badgeY + 1, badgeSize - 2, shape);
        ctx.clip();
      }

      ctx.drawImage(logoImg, imgX, imgY, imgW, imgH);

      if (shape !== 'none') {
        ctx.restore();
      }

      ctx.restore();
    }
  }

  // -------------------------------------------------------------
  // 4. Draw Frames & CTA Text Banner
  // -------------------------------------------------------------
  if (hasFrame) {
    ctx.fillStyle = typeof fgStyle === 'string' ? fgStyle : config.fgColor;

    if (config.frameStyle === 'banner') {
      // Bottom pill banner
      const bannerHeight = qrBottomOffset * 0.7;
      const bannerY = canvasHeight - brandingHeight - qrBottomOffset + (qrBottomOffset - bannerHeight) / 2;
      const bannerWidth = canvasWidth * 0.75;
      const bannerX = (canvasWidth - bannerWidth) / 2;

      drawRoundRect(ctx, bannerX, bannerY, bannerWidth, bannerHeight, bannerHeight / 2);

      // Banner Text
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(bannerHeight * 0.45)}px 'Plus Jakarta Sans', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(frameText.toUpperCase(), canvasWidth / 2, bannerY + bannerHeight / 2);
    } else if (config.frameStyle === 'badge') {
      // Top header badge
      const badgeHeight = qrTopOffset * 0.65;
      const badgeY = (qrTopOffset - badgeHeight) / 2;
      const badgeWidth = canvasWidth * 0.65;
      const badgeX = (canvasWidth - badgeWidth) / 2;

      drawRoundRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, 12);

      // Badge Text
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(badgeHeight * 0.48)}px 'Plus Jakarta Sans', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(frameText.toUpperCase(), canvasWidth / 2, badgeY + badgeHeight / 2);
    } else if (config.frameStyle === 'card') {
      // Card Frame Label
      const bannerY = canvasHeight - brandingHeight - qrBottomOffset + 8;
      ctx.fillStyle = typeof fgStyle === 'string' ? fgStyle : config.fgColor;
      ctx.font = `800 ${Math.round(qrBottomOffset * 0.32)}px 'Outfit', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(frameText.toUpperCase(), canvasWidth / 2, bannerY);
    }
  }

  // -------------------------------------------------------------
  // 5. Draw Website Branding Badge ("Link to QR" + Logo + linktoqr.in)
  // -------------------------------------------------------------
  if (hasBranding) {
    const footerY = canvasHeight - brandingHeight;
    const footerH = brandingHeight;

    // Detect if background is dark
    const isDarkBg = !config.transparentBg && isColorDark(config.bgColor || '#ffffff');

    // Outer branding container pill
    const pillH = Math.round(footerH * 0.72);
    const pillW = Math.min(canvasWidth * 0.88, canvasWidth - 28);
    const pillX = (canvasWidth - pillW) / 2;
    const pillY = footerY + (footerH - pillH) / 2;
    const pillRadius = Math.round(pillH * 0.35);

    // Pill container styling
    if (!config.transparentBg) {
      ctx.fillStyle = isDarkBg ? 'rgba(255, 255, 255, 0.08)' : '#f8fafc';
      drawRoundRect(ctx, pillX, pillY, pillW, pillH, pillRadius);

      ctx.lineWidth = Math.max(1, Math.round(targetSize * 0.0018));
      ctx.strokeStyle = isDarkBg ? 'rgba(255, 255, 255, 0.16)' : '#e2e8f0';
      ctx.stroke();
    } else {
      // Semi-solid pill for transparent QR
      ctx.fillStyle = isDarkBg ? '#0f172a' : '#ffffff';
      drawRoundRect(ctx, pillX, pillY, pillW, pillH, pillRadius);

      ctx.lineWidth = Math.max(1, Math.round(targetSize * 0.002));
      ctx.strokeStyle = '#6366f1';
      ctx.stroke();
    }

    // Logo icon dimensions
    const iconSize = Math.round(pillH * 0.72);
    const iconX = pillX + Math.round((pillH - iconSize) / 2);
    const iconY = pillY + Math.round((pillH - iconSize) / 2);
    const iconRadius = Math.round(iconSize * 0.28);

    // Try loading website brand logo (instant preloaded image first, then fallbacks)
    let brandLogoImg: HTMLImageElement | null = null;
    if (preloadedBrandLogo && preloadedBrandLogo.complete && preloadedBrandLogo.naturalWidth > 0) {
      brandLogoImg = preloadedBrandLogo;
    } else {
      brandLogoImg = await getCachedImage(BRAND_LOGO_DATA_URI);
      if (!brandLogoImg) {
        brandLogoImg = await getCachedImage('/brand-logo.jpg');
      }
    }

    if (brandLogoImg && (brandLogoImg.naturalWidth > 0 || brandLogoImg.width > 0)) {
      ctx.save();
      // 1. White backing so transparent/dark elements stay crisp
      ctx.fillStyle = '#ffffff';
      fillRoundRect(ctx, iconX, iconY, iconSize, iconSize, iconRadius);

      // 2. Clip and draw image
      ctx.save();
      pathRoundRect(ctx, iconX, iconY, iconSize, iconSize, iconRadius);
      ctx.clip();
      ctx.drawImage(brandLogoImg, iconX, iconY, iconSize, iconSize);
      ctx.restore();

      // 3. Crisp border around logo (stroke only, without filling on top)
      ctx.lineWidth = Math.max(1.5, Math.round(iconSize * 0.05));
      ctx.strokeStyle = '#6366f1';
      strokeRoundRect(ctx, iconX, iconY, iconSize, iconSize, iconRadius);
      ctx.restore();
    } else {
      // Crisp vector fallback emblem if image not ready
      const iconGrad = ctx.createLinearGradient(iconX, iconY, iconX + iconSize, iconY + iconSize);
      iconGrad.addColorStop(0, '#4f46e5');
      iconGrad.addColorStop(1, '#7c3aed');
      ctx.fillStyle = iconGrad;
      fillRoundRect(ctx, iconX, iconY, iconSize, iconSize, iconRadius);

      ctx.fillStyle = '#ffffff';
      const mPad = iconSize * 0.2;
      const mSize = iconSize - mPad * 2;
      fillRoundRect(ctx, iconX + mPad, iconY + mPad, mSize, mSize, mSize * 0.25);
      ctx.fillStyle = '#4f46e5';
      const iPad = mPad + mSize * 0.25;
      const iSize = mSize * 0.5;
      fillRoundRect(ctx, iconX + iPad, iconY + iPad, iSize, iSize, iSize * 0.25);
    }

    // Text labels
    const textStartX = iconX + iconSize + Math.round(pillH * 0.22);
    const titleFontSize = Math.round(pillH * 0.36);
    const subtitleFontSize = Math.round(pillH * 0.22);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    // Primary Brand Text: "Link to QR"
    const titleY = pillY + pillH * 0.35;
    ctx.font = `800 ${titleFontSize}px 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif`;
    const textColor = isDarkBg ? '#ffffff' : '#0f172a';
    ctx.fillStyle = textColor;
    ctx.fillText('Link to ', textStartX, titleY);
    const brandPrefixWidth = ctx.measureText('Link to ').width;

    ctx.fillStyle = '#6366f1';
    ctx.fillText('QR', textStartX + brandPrefixWidth, titleY);

    // Subtitle URL: "linktoqr.in • Free QR Code"
    const subY = pillY + pillH * 0.72;
    ctx.font = `600 ${subtitleFontSize}px 'Plus Jakarta Sans', monospace, sans-serif`;
    ctx.fillStyle = isDarkBg ? '#94a3b8' : '#64748b';
    ctx.fillText('linktoqr.in  •  Free QR Code', textStartX, subY);

    // Right-aligned verification badge
    if (pillW > targetSize * 0.62) {
      const badgeText = '100% FREE';
      ctx.font = `bold ${Math.round(pillH * 0.18)}px 'Plus Jakarta Sans', sans-serif`;
      const badgeW = ctx.measureText(badgeText).width + 16;
      const badgeH = Math.round(pillH * 0.38);
      const badgeX = pillX + pillW - badgeW - Math.round(pillH * 0.2);
      const badgeY = pillY + (pillH - badgeH) / 2;

      ctx.fillStyle = isDarkBg ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)';
      drawRoundRect(ctx, badgeX, badgeY, badgeW, badgeH, 6);

      ctx.fillStyle = isDarkBg ? '#a5b4fc' : '#4f46e5';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeText, badgeX + badgeW / 2, badgeY + badgeH / 2);
    }
  }

  // Enforce 100% responsive display on DOM canvas
  canvas.style.width = '100%';
  canvas.style.height = '100%';
}
