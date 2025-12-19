export enum DeviceType {
  IPHONE_15_PRO = 'iPhone 15 Pro',
  IPHONE_14_PLUS = 'iPhone 14 Plus',
  IPHONE_SE = 'iPhone SE',
  SAMSUNG_S24 = 'Samsung S24 Ultra',
  SAMSUNG_S23 = 'Samsung S23',
  ANDROID_PIXEL = 'Pixel 8 Pro',
  PIXEL_7 = 'Pixel 7',
  TABLET = 'iPad Pro',
}

export interface TextConfig {
  title: string;
  subtitle: string;
  titleColor: string;
  subtitleColor: string;
  fontFamily: string;
  alignment: 'left' | 'center' | 'right';
  position: 'top' | 'bottom';
}

export interface BackgroundConfig {
  type: 'solid' | 'gradient';
  color1: string;
  color2: string;
  direction: string;
}

export interface ShadowConfig {
  enabled: boolean;
  color: string;
  blur: number;
  opacity: number;
  offsetY: number;
}

export interface DeviceConfig {
  id: string;
  type: DeviceType;
  image: string | null;
  x: number;
  y: number;
  rotation: number;
  rotateX: number;
  rotateY: number;
  scale: number;
  shadow: ShadowConfig;
  zIndex: number;
}

export interface ScreenConfig {
  id: string;
  devices: DeviceConfig[];
  text: TextConfig;
  background: BackgroundConfig;
}

export interface Template {
  name: string;
  description: string;
  config: Partial<ScreenConfig>; // Configuration to merge
}