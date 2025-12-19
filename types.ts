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

// Background Types
export type BackgroundType = 'solid' | 'gradient' | 'mesh' | 'pattern' | 'image';

export type PatternType = 'dots' | 'grid' | 'lines' | 'diagonal' | 'waves';

export interface MeshPoint {
  id: string;
  x: number;      // 0-100 percentage
  y: number;      // 0-100 percentage
  color: string;
}

export interface MeshGradientConfig {
  points: MeshPoint[];
  blur: number;   // 30-80
}

export interface PatternConfig {
  type: PatternType;
  color: string;
  backgroundColor: string;
  size: number;       // 10-50
  spacing: number;    // 10-100
  opacity: number;    // 0-1
}

export interface BackgroundImageConfig {
  src: string | null;
  blur: number;           // 0-20
  overlayColor: string;
  overlayOpacity: number; // 0-1
  fit: 'cover' | 'contain' | 'fill';
}

export interface BackgroundConfig {
  type: BackgroundType;
  // Solid/Gradient
  color1: string;
  color2: string;
  direction: string;
  // Mesh Gradient
  mesh?: MeshGradientConfig;
  // Pattern
  pattern?: PatternConfig;
  // Image
  image?: BackgroundImageConfig;
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

// Export Types
export interface ExportSize {
  id: string;
  name: string;
  platform: 'ios' | 'android';
  width: number;
  height: number;
  suffix: string;
}

export interface ExportConfig {
  selectedSizes: string[];  // IDs of ExportSize
  format: 'png' | 'jpg';
  quality: number;          // 0.8-1.0 for JPG
}

// Animation Types
export interface AnimationKeyframe {
  time: number;  // 0-1 (percentage of duration)
  properties: {
    x?: number;
    y?: number;
    rotation?: number;
    rotateX?: number;
    rotateY?: number;
    scale?: number;
    opacity?: number;
  };
}

export interface AnimationPreset {
  id: string;
  name: string;
  description: string;
  duration: number;  // ms
  keyframes: AnimationKeyframe[];
}

export interface AnimationConfig {
  enabled: boolean;
  presetId: string | null;
  duration: number;  // ms
  loop: boolean;
  playbackState: 'stopped' | 'playing' | 'paused';
  currentTime: number;  // 0-1
}

export interface GifExportConfig {
  fps: number;       // 10, 15, 20, 30
  quality: number;   // 1-10
  width: number;
  height: number;
}