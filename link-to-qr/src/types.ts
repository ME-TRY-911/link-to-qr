export type QrType = 
  | 'url' 
  | 'text' 
  | 'wifi' 
  | 'email' 
  | 'phone' 
  | 'sms' 
  | 'vcard' 
  | 'event' 
  | 'appstore' 
  | 'pdf';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type QrDotStyle = 'square' | 'dots' | 'rounded' | 'classy';
export type QrEyeStyle = 'square' | 'rounded' | 'circle' | 'leaf';
export type QrFrameStyle = 'none' | 'banner' | 'badge' | 'card';

export interface WifiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  mobile: string;
  email: string;
  website: string;
  address: string;
}

export interface EmailData {
  address: string;
  subject: string;
  body: string;
}

export interface SmsData {
  phone: string;
  message: string;
}

export interface EventData {
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface AppStoreData {
  iosUrl: string;
  androidUrl: string;
}

export interface QrConfig {
  type: QrType;
  url: string;
  text: string;
  wifi: WifiData;
  vcard: VCardData;
  email: EmailData;
  phone: string;
  sms: SmsData;
  event: EventData;
  appstore: AppStoreData;
  pdfName: string;
  pdfUrl: string;
  // Customization
  dotStyle: QrDotStyle;
  eyeStyle: QrEyeStyle;
  frameStyle: QrFrameStyle;
  frameText: string;
  gradientFg: boolean;
  fgColorEnd: string;
  fgColor: string;
  bgColor: string;
  transparentBg: boolean;
  logo: string | null; // Data URL or preset key
  logoSizePercent?: number; // 10 to 25% (default 16%)
  logoShape?: 'circle' | 'rounded' | 'square' | 'none';
  errorCorrectionLevel: ErrorCorrectionLevel;
  size: number; // 256, 512, 1024, 2048
  isDynamic: boolean;
  includeBranding?: boolean; // When true (default), adds Link to QR website name and logo badge on downloaded QR
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  createdAt: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
}

export interface StatItem {
  label: string;
  value: string;
  subtext: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export interface RelatedToolItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  typeLink?: QrType;
}
