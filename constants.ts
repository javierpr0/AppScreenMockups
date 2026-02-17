import { DeviceType, ScreenConfig, Template, BackgroundConfig, ExportSize, ExportConfig, AnimationPreset, AnimationConfig, GifExportConfig } from './types';

// Animation Presets
export const ANIMATION_PRESETS: AnimationPreset[] = [
  {
    id: 'slide-in-bottom',
    name: 'Slide In',
    description: 'Device slides up from bottom',
    duration: 1500,
    keyframes: [
      { time: 0, properties: { y: 400, opacity: 0, scale: 0.8 } },
      { time: 0.6, properties: { y: -20, opacity: 1, scale: 0.92 } },
      { time: 1, properties: { y: 0, opacity: 1, scale: 0.9 } }
    ]
  },
  {
    id: 'rotate-3d',
    name: 'Rotate 3D',
    description: 'Smooth 3D rotation',
    duration: 2000,
    keyframes: [
      { time: 0, properties: { rotateY: -25, rotateX: 5 } },
      { time: 0.5, properties: { rotateY: 25, rotateX: -5 } },
      { time: 1, properties: { rotateY: 0, rotateX: 0 } }
    ]
  },
  {
    id: 'float',
    name: 'Float',
    description: 'Gentle floating motion',
    duration: 2500,
    keyframes: [
      { time: 0, properties: { y: 0, rotation: 0 } },
      { time: 0.25, properties: { y: -25, rotation: 1 } },
      { time: 0.5, properties: { y: 0, rotation: 0 } },
      { time: 0.75, properties: { y: -25, rotation: -1 } },
      { time: 1, properties: { y: 0, rotation: 0 } }
    ]
  },
  {
    id: 'zoom-in',
    name: 'Zoom In',
    description: 'Scale from small to normal',
    duration: 1200,
    keyframes: [
      { time: 0, properties: { scale: 0.5, opacity: 0 } },
      { time: 0.7, properties: { scale: 0.95, opacity: 1 } },
      { time: 1, properties: { scale: 0.9, opacity: 1 } }
    ]
  }
];

export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  enabled: false,
  presetId: null,
  duration: 2000,
  loop: true,
  playbackState: 'stopped',
  currentTime: 0
};

export const DEFAULT_GIF_CONFIG: GifExportConfig = {
  fps: 15,
  quality: 8,
  width: 621,
  height: 1104
};

// Export Sizes for App Store and Google Play
export const EXPORT_SIZES: ExportSize[] = [
  // iOS - App Store
  { id: 'ios-6.7', name: 'iPhone 6.7"', platform: 'ios', width: 1290, height: 2796, suffix: '6.7' },
  { id: 'ios-6.5', name: 'iPhone 6.5"', platform: 'ios', width: 1242, height: 2688, suffix: '6.5' },
  { id: 'ios-5.5', name: 'iPhone 5.5"', platform: 'ios', width: 1242, height: 2208, suffix: '5.5' },
  { id: 'ios-ipad-12.9', name: 'iPad Pro 12.9"', platform: 'ios', width: 2048, height: 2732, suffix: 'ipad-12.9' },

  // Android - Google Play
  { id: 'android-phone', name: 'Android Phone', platform: 'android', width: 1080, height: 1920, suffix: 'android' },
  { id: 'android-phone-hd', name: 'Android Phone HD', platform: 'android', width: 1440, height: 3040, suffix: 'android-hd' },
];

export const DEFAULT_EXPORT_CONFIG: ExportConfig = {
  selectedSizes: ['ios-6.7', 'ios-5.5', 'android-phone'],
  format: 'png',
  quality: 1,
};

// Background Presets
export interface BackgroundPreset {
  name: string;
  config: BackgroundConfig;
}

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  {
    name: 'Indigo Purple',
    config: {
      type: 'gradient',
      color1: '#4f46e5',
      color2: '#9333ea',
      direction: 'to bottom right'
    }
  },
  {
    name: 'Ocean Blue',
    config: {
      type: 'gradient',
      color1: '#0ea5e9',
      color2: '#2563eb',
      direction: 'to bottom'
    }
  },
  {
    name: 'Sunset',
    config: {
      type: 'gradient',
      color1: '#f97316',
      color2: '#ec4899',
      direction: 'to bottom right'
    }
  },
  {
    name: 'Emerald',
    config: {
      type: 'gradient',
      color1: '#10b981',
      color2: '#0d9488',
      direction: 'to bottom'
    }
  },
  {
    name: 'Dark Slate',
    config: {
      type: 'solid',
      color1: '#0f172a',
      color2: '#0f172a',
      direction: 'to bottom'
    }
  },
  {
    name: 'Midnight',
    config: {
      type: 'gradient',
      color1: '#1e1b4b',
      color2: '#0c0a09',
      direction: 'to bottom'
    }
  }
];

const DEFAULT_SHADOW = {
  enabled: true,
  color: '#000000',
  blur: 40,
  opacity: 0.4,
  offsetY: 20,
};

export const DEFAULT_SCREEN_CONFIG: ScreenConfig = {
  id: 'default',
  devices: [
    {
      id: 'dev_1',
      type: DeviceType.IPHONE_15_PRO,
      image: null,
      x: 0,
      y: 0,
      rotation: 0,
      rotateX: 0,
      rotateY: 0,
      scale: 0.9,
      shadow: DEFAULT_SHADOW,
      zIndex: 1,
    }
  ],
  text: {
    title: 'Your App Title',
    subtitle: 'Describe your best feature here',
    titleColor: '#ffffff',
    subtitleColor: '#e2e8f0',
    fontFamily: 'Inter',
    alignment: 'center',
    position: 'top',
    // Advanced text settings
    titleSize: 80,
    subtitleSize: 48,
    titleWeight: 700,
    subtitleWeight: 500,
    letterSpacing: 0,
    lineHeight: 1.2,
    textShadow: true,
    textShadowBlur: 12,
    textShadowColor: '#000000',
    maxWidth: 100,
  },
  background: {
    type: 'gradient',
    color1: '#4f46e5', // Indigo 600
    color2: '#9333ea', // Purple 600
    direction: 'to bottom right',
  },
};

export const DEVICE_ASPECT_RATIOS: Record<string, number> = {
  // Apple Modern
  [DeviceType.IPHONE_17_PRO]: 9 / 19.5,
  [DeviceType.IPHONE_17_PRO_MAX]: 9 / 19.5,
  [DeviceType.IPHONE_16_PRO]: 9 / 19.5,
  [DeviceType.IPHONE_16_PRO_MAX]: 9 / 19.5,
  [DeviceType.IPHONE_15_PRO]: 9 / 19.5,
  [DeviceType.IPHONE_15_PRO_MAX]: 9 / 19.5,
  [DeviceType.IPHONE_14_PRO]: 9 / 19.5,
  [DeviceType.IPHONE_SE]: 9 / 16,
  [DeviceType.IPAD_PRO_13]: 3 / 4,
  [DeviceType.IPAD_PRO_11]: 3 / 4,

  // Samsung
  [DeviceType.SAMSUNG_S24_ULTRA]: 9 / 19.5,
  [DeviceType.SAMSUNG_S24]: 9 / 19.5,
  [DeviceType.SAMSUNG_FOLD]: 9 / 22,

  // Google Pixel
  [DeviceType.PIXEL_9_PRO]: 9 / 20,
  [DeviceType.PIXEL_9]: 9 / 20,
  [DeviceType.PIXEL_8_PRO]: 9 / 20,

  // Legacy
  // ANDROID_PIXEL is omitted: its enum value ('Pixel 8 Pro') duplicates PIXEL_8_PRO above
  [DeviceType.IPHONE_14_PLUS]: 9 / 19.5,
  [DeviceType.SAMSUNG_S23]: 9 / 19.5,
  [DeviceType.PIXEL_7]: 9 / 20,
  [DeviceType.TABLET]: 3 / 4,
};

// Canvas Output Dimensions
export const CANVAS_WIDTH = 1242;
export const CANVAS_HEIGHT = 2208;

export const TEMPLATES: Template[] = [
  // === HERO DEVICE PATTERNS ===
  {
    name: 'Hero Centered',
    description: 'Single centered device, classic layout',
    config: {
      devices: [
        { id: 't1_d1', type: DeviceType.IPHONE_16_PRO, image: null, x: 0, y: 100, rotation: 0, rotateX: 0, rotateY: 0, scale: 0.95, shadow: DEFAULT_SHADOW, zIndex: 1 }
      ],
      text: { ...DEFAULT_SCREEN_CONFIG.text, position: 'top', alignment: 'center' }
    }
  },
  {
    name: 'Hero Large',
    description: 'Device dominant, minimal text',
    config: {
      devices: [
        { id: 't1b_d1', type: DeviceType.IPHONE_16_PRO_MAX, image: null, x: 0, y: 180, rotation: 0, rotateX: 0, rotateY: 0, scale: 1.05, shadow: DEFAULT_SHADOW, zIndex: 1 }
      ],
      text: { ...DEFAULT_SCREEN_CONFIG.text, position: 'top', alignment: 'center', titleSize: 72, subtitleSize: 40 }
    }
  },
  {
    name: 'Hero Floating',
    description: 'Device with elegant float',
    config: {
      devices: [
        { id: 't1c_d1', type: DeviceType.IPHONE_15_PRO, image: null, x: 0, y: 50, rotation: 2, rotateX: 0, rotateY: 0, scale: 0.9, shadow: { ...DEFAULT_SHADOW, blur: 60, offsetY: 40 }, zIndex: 1 }
      ],
      text: { ...DEFAULT_SCREEN_CONFIG.text, position: 'top', alignment: 'center' }
    }
  },

  // === DUAL DEVICE PATTERNS ===
  {
    name: 'Dual Angled 35°',
    description: 'Classic dual angled phones',
    config: {
      devices: [
        { id: 't2_d1', type: DeviceType.IPHONE_16_PRO, image: null, x: -280, y: 150, rotation: -35, rotateX: 0, rotateY: 0, scale: 0.75, shadow: DEFAULT_SHADOW, zIndex: 1 },
        { id: 't2_d2', type: DeviceType.IPHONE_16_PRO, image: null, x: 280, y: 150, rotation: 35, rotateX: 0, rotateY: 0, scale: 0.75, shadow: DEFAULT_SHADOW, zIndex: 2 }
      ],
      text: { ...DEFAULT_SCREEN_CONFIG.text, position: 'top' }
    }
  },
  {
    name: 'Dual Offset Depth',
    description: 'Layered depth effect',
    config: {
      devices: [
        { id: 't2b_d1', type: DeviceType.IPHONE_15_PRO, image: null, x: -150, y: 200, rotation: -20, rotateX: 0, rotateY: 0, scale: 0.7, shadow: { ...DEFAULT_SHADOW, opacity: 0.3 }, zIndex: 1 },
        { id: 't2b_d2', type: DeviceType.IPHONE_15_PRO, image: null, x: 150, y: 80, rotation: 15, rotateX: 0, rotateY: 0, scale: 0.85, shadow: DEFAULT_SHADOW, zIndex: 2 }
      ],
      text: { ...DEFAULT_SCREEN_CONFIG.text, position: 'top' }
    }
  },
  {
    name: 'Dual Symmetrical',
    description: 'Mirror symmetry layout',
    config: {
      devices: [
        { id: 't2c_d1', type: DeviceType.SAMSUNG_S24_ULTRA, image: null, x: -220, y: 120, rotation: -12, rotateX: 0, rotateY: 0, scale: 0.8, shadow: DEFAULT_SHADOW, zIndex: 1 },
        { id: 't2c_d2', type: DeviceType.SAMSUNG_S24_ULTRA, image: null, x: 220, y: 120, rotation: 12, rotateX: 0, rotateY: 0, scale: 0.8, shadow: DEFAULT_SHADOW, zIndex: 2 }
      ],
      text: { ...DEFAULT_SCREEN_CONFIG.text, position: 'top' }
    }
  },

  // === TRIPLE DEVICE PATTERNS ===
  {
    name: 'Triple Carousel',
    description: 'Three devices in a row',
    config: {
      devices: [
        { id: 't3_d1', type: DeviceType.IPHONE_16_PRO, image: null, x: -380, y: 180, rotation: -18, rotateX: 0, rotateY: 0, scale: 0.7, shadow: DEFAULT_SHADOW, zIndex: 1 },
        { id: 't3_d2', type: DeviceType.IPHONE_16_PRO, image: null, x: 0, y: 100, rotation: 0, rotateX: 0, rotateY: 0, scale: 0.85, shadow: DEFAULT_SHADOW, zIndex: 3 },
        { id: 't3_d3', type: DeviceType.IPHONE_16_PRO, image: null, x: 380, y: 180, rotation: 18, rotateX: 0, rotateY: 0, scale: 0.7, shadow: DEFAULT_SHADOW, zIndex: 2 }
      ],
      text: { ...DEFAULT_SCREEN_CONFIG.text, position: 'top' }
    }
  },
  {
    name: 'Triple Nested',
    description: 'Layered stack effect',
    config: {
      devices: [
        { id: 't3b_d1', type: DeviceType.IPHONE_15_PRO, image: null, x: -80, y: 180, rotation: -30, rotateX: 0, rotateY: 0, scale: 0.65, shadow: DEFAULT_SHADOW, zIndex: 1 },
        { id: 't3b_d2', type: DeviceType.IPHONE_15_PRO, image: null, x: 0, y: 120, rotation: -12, rotateX: 0, rotateY: 0, scale: 0.75, shadow: DEFAULT_SHADOW, zIndex: 2 },
        { id: 't3b_d3', type: DeviceType.IPHONE_15_PRO, image: null, x: 80, y: 60, rotation: 0, rotateX: 0, rotateY: 0, scale: 0.85, shadow: DEFAULT_SHADOW, zIndex: 3 }
      ],
      text: { ...DEFAULT_SCREEN_CONFIG.text, position: 'top' }
    }
  },
  {
    name: 'Triple Diagonal',
    description: 'Cascading diagonal layout',
    config: {
      devices: [
        { id: 't3c_d1', type: DeviceType.PIXEL_9_PRO, image: null, x: -350, y: 0, rotation: -25, rotateX: 0, rotateY: 0, scale: 0.75, shadow: DEFAULT_SHADOW, zIndex: 1 },
        { id: 't3c_d2', type: DeviceType.PIXEL_9_PRO, image: null, x: 0, y: 150, rotation: -8, rotateX: 0, rotateY: 0, scale: 0.8, shadow: DEFAULT_SHADOW, zIndex: 2 },
        { id: 't3c_d3', type: DeviceType.PIXEL_9_PRO, image: null, x: 350, y: 300, rotation: 10, rotateX: 0, rotateY: 0, scale: 0.7, shadow: DEFAULT_SHADOW, zIndex: 3 }
      ],
      text: { ...DEFAULT_SCREEN_CONFIG.text, position: 'top', alignment: 'left' }
    }
  },

  // === 3D PERSPECTIVE PATTERNS ===
  {
    name: '3D Isometric',
    description: 'Dramatic 3D angle',
    config: {
      devices: [
        { id: 't4_d1', type: DeviceType.IPHONE_16_PRO, image: null, x: 0, y: 80, rotation: 0, rotateX: 12, rotateY: -25, scale: 0.9, shadow: DEFAULT_SHADOW, zIndex: 1 }
      ],
      text: { ...DEFAULT_SCREEN_CONFIG.text, position: 'top', alignment: 'center' }
    }
  },
  {
    name: '3D Showcase Dual',
    description: 'Two devices in 3D space',
    config: {
      devices: [
        { id: 't4b_d1', type: DeviceType.IPHONE_16_PRO, image: null, x: -220, y: 80, rotation: 0, rotateX: 8, rotateY: 30, scale: 0.8, shadow: DEFAULT_SHADOW, zIndex: 1 },
        { id: 't4b_d2', type: DeviceType.IPHONE_16_PRO, image: null, x: 220, y: 80, rotation: 0, rotateX: 8, rotateY: -30, scale: 0.8, shadow: DEFAULT_SHADOW, zIndex: 2 }
      ],
      text: { ...DEFAULT_SCREEN_CONFIG.text, position: 'top' }
    }
  },
  {
    name: '3D Floating',
    description: 'Single device with tilt',
    config: {
      devices: [
        { id: 't4c_d1', type: DeviceType.SAMSUNG_S24_ULTRA, image: null, x: 50, y: 100, rotation: -5, rotateX: 15, rotateY: -20, scale: 0.88, shadow: { ...DEFAULT_SHADOW, blur: 50 }, zIndex: 1 }
      ],
      text: { ...DEFAULT_SCREEN_CONFIG.text, position: 'top', alignment: 'left' }
    }
  },

  // === MULTI-DEVICE & TABLET PATTERNS ===
  {
    name: 'iPad & iPhone',
    description: 'Show responsive design',
    config: {
      devices: [
        { id: 't5_d1', type: DeviceType.IPAD_PRO_13, image: null, x: -120, y: 80, rotation: 0, rotateX: 0, rotateY: 0, scale: 0.85, shadow: DEFAULT_SHADOW, zIndex: 1 },
        { id: 't5_d2', type: DeviceType.IPHONE_16_PRO, image: null, x: 380, y: 350, rotation: -8, rotateX: 0, rotateY: 0, scale: 0.6, shadow: DEFAULT_SHADOW, zIndex: 2 }
      ],
      text: { ...DEFAULT_SCREEN_CONFIG.text, position: 'top', alignment: 'left' }
    }
  },
  {
    name: 'Phone + Tablet Stack',
    description: 'Layered multi-device',
    config: {
      devices: [
        { id: 't5b_d1', type: DeviceType.IPAD_PRO_11, image: null, x: 100, y: 180, rotation: 5, rotateX: 0, rotateY: 0, scale: 0.75, shadow: DEFAULT_SHADOW, zIndex: 1 },
        { id: 't5b_d2', type: DeviceType.IPHONE_15_PRO, image: null, x: -200, y: 100, rotation: -15, rotateX: 0, rotateY: 0, scale: 0.7, shadow: DEFAULT_SHADOW, zIndex: 2 }
      ],
      text: { ...DEFAULT_SCREEN_CONFIG.text, position: 'top', alignment: 'center' }
    }
  },

  // === SPECIAL PATTERNS ===
  {
    name: 'Samsung Ultra',
    description: 'S24 Ultra showcase',
    config: {
      devices: [
        { id: 't6_d1', type: DeviceType.SAMSUNG_S24_ULTRA, image: null, x: 0, y: 100, rotation: 0, rotateX: 0, rotateY: 0, scale: 0.92, shadow: DEFAULT_SHADOW, zIndex: 1 }
      ],
      text: { ...DEFAULT_SCREEN_CONFIG.text, position: 'top', alignment: 'center' }
    }
  },
  {
    name: 'Pixel Showcase',
    description: 'Google Pixel 9 Pro',
    config: {
      devices: [
        { id: 't6b_d1', type: DeviceType.PIXEL_9_PRO, image: null, x: 0, y: 100, rotation: 0, rotateX: 0, rotateY: 0, scale: 0.9, shadow: DEFAULT_SHADOW, zIndex: 1 }
      ],
      text: { ...DEFAULT_SCREEN_CONFIG.text, position: 'top', alignment: 'center' }
    }
  },
  {
    name: 'Mixed Ecosystem',
    description: 'iPhone + Samsung + Pixel',
    config: {
      devices: [
        { id: 't7_d1', type: DeviceType.IPHONE_16_PRO, image: null, x: -350, y: 150, rotation: -20, rotateX: 0, rotateY: 0, scale: 0.68, shadow: DEFAULT_SHADOW, zIndex: 1 },
        { id: 't7_d2', type: DeviceType.SAMSUNG_S24_ULTRA, image: null, x: 0, y: 80, rotation: 0, rotateX: 0, rotateY: 0, scale: 0.78, shadow: DEFAULT_SHADOW, zIndex: 2 },
        { id: 't7_d3', type: DeviceType.PIXEL_9_PRO, image: null, x: 350, y: 150, rotation: 20, rotateX: 0, rotateY: 0, scale: 0.68, shadow: DEFAULT_SHADOW, zIndex: 1 }
      ],
      text: { ...DEFAULT_SCREEN_CONFIG.text, position: 'top' }
    }
  },
  {
    name: 'Foldable Feature',
    description: 'Galaxy Fold showcase',
    config: {
      devices: [
        { id: 't8_d1', type: DeviceType.SAMSUNG_FOLD, image: null, x: 0, y: 50, rotation: 0, rotateX: 0, rotateY: 0, scale: 0.85, shadow: DEFAULT_SHADOW, zIndex: 1 }
      ],
      text: { ...DEFAULT_SCREEN_CONFIG.text, position: 'top', alignment: 'center' }
    }
  },
  {
    name: 'Bottom Text Hero',
    description: 'Device top, text bottom',
    config: {
      devices: [
        { id: 't9_d1', type: DeviceType.IPHONE_16_PRO, image: null, x: 0, y: -100, rotation: 0, rotateX: 0, rotateY: 0, scale: 0.88, shadow: DEFAULT_SHADOW, zIndex: 1 }
      ],
      text: { ...DEFAULT_SCREEN_CONFIG.text, position: 'bottom', alignment: 'center' }
    }
  }
];