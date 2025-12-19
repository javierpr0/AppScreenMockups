import { DeviceType, ScreenConfig, Template } from './types';

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
  },
  background: {
    type: 'gradient',
    color1: '#4f46e5', // Indigo 600
    color2: '#9333ea', // Purple 600
    direction: 'to bottom right',
  },
};

export const DEVICE_ASPECT_RATIOS: Record<DeviceType, number> = {
  [DeviceType.IPHONE_15_PRO]: 9 / 19.5,
  [DeviceType.IPHONE_14_PLUS]: 9 / 19.5,
  [DeviceType.IPHONE_SE]: 9 / 16, // Screen is 16:9, keeping frame simple
  [DeviceType.SAMSUNG_S24]: 9 / 19.5,
  [DeviceType.SAMSUNG_S23]: 9 / 19.5,
  [DeviceType.ANDROID_PIXEL]: 9 / 20,
  [DeviceType.PIXEL_7]: 9 / 20,
  [DeviceType.TABLET]: 3 / 4,
};

// Canvas Output Dimensions
export const CANVAS_WIDTH = 1242;
export const CANVAS_HEIGHT = 2208;

export const TEMPLATES: Template[] = [
  {
    name: 'Single Hero',
    description: 'One centered device',
    config: {
      devices: [
        { id: 't1_d1', type: DeviceType.IPHONE_15_PRO, image: null, x: 0, y: 0, rotation: 0, rotateX: 0, rotateY: 0, scale: 0.9, shadow: DEFAULT_SHADOW, zIndex: 1 }
      ],
      text: { ...DEFAULT_SCREEN_CONFIG.text, position: 'top', alignment: 'center' }
    }
  },
  {
    name: 'Dual Angled',
    description: 'Two phones tilting inwards',
    config: {
      devices: [
        { id: 't2_d1', type: DeviceType.IPHONE_15_PRO, image: null, x: -250, y: 100, rotation: -15, rotateX: 0, rotateY: 0, scale: 0.85, shadow: DEFAULT_SHADOW, zIndex: 1 },
        { id: 't2_d2', type: DeviceType.IPHONE_15_PRO, image: null, x: 250, y: 100, rotation: 15, rotateX: 0, rotateY: 0, scale: 0.85, shadow: DEFAULT_SHADOW, zIndex: 2 }
      ],
      text: { ...DEFAULT_SCREEN_CONFIG.text, position: 'top' }
    }
  },
  {
    name: 'Three Phones',
    description: 'A presentation trio',
    config: {
      devices: [
        { id: 't3_d1', type: DeviceType.IPHONE_15_PRO, image: null, x: -400, y: 150, rotation: -10, rotateX: 0, rotateY: 0, scale: 0.75, shadow: DEFAULT_SHADOW, zIndex: 1 },
        { id: 't3_d3', type: DeviceType.IPHONE_15_PRO, image: null, x: 400, y: 150, rotation: 10, rotateX: 0, rotateY: 0, scale: 0.75, shadow: DEFAULT_SHADOW, zIndex: 1 },
        { id: 't3_d2', type: DeviceType.IPHONE_15_PRO, image: null, x: 0, y: 50, rotation: 0, rotateX: 0, rotateY: 0, scale: 0.85, shadow: DEFAULT_SHADOW, zIndex: 2 }
      ],
      text: { ...DEFAULT_SCREEN_CONFIG.text, position: 'top' }
    }
  },
  {
    name: 'Tablet & Phone',
    description: 'Show responsive design',
    config: {
      devices: [
        { id: 't4_d1', type: DeviceType.TABLET, image: null, x: -100, y: 100, rotation: 0, rotateX: 0, rotateY: 0, scale: 0.9, shadow: DEFAULT_SHADOW, zIndex: 1 },
        { id: 't4_d2', type: DeviceType.IPHONE_15_PRO, image: null, x: 350, y: 400, rotation: -5, rotateX: 0, rotateY: 0, scale: 0.6, shadow: DEFAULT_SHADOW, zIndex: 2 }
      ],
      text: { ...DEFAULT_SCREEN_CONFIG.text, position: 'top', alignment: 'left' }
    }
  },
  {
    name: '3D Perspective',
    description: 'Dramatic 3D angle view',
    config: {
      devices: [
        { id: 't5_d1', type: DeviceType.IPHONE_15_PRO, image: null, x: 0, y: 50, rotation: 0, rotateX: 10, rotateY: -20, scale: 0.95, shadow: DEFAULT_SHADOW, zIndex: 1 }
      ],
      text: { ...DEFAULT_SCREEN_CONFIG.text, position: 'top', alignment: 'center' }
    }
  },
  {
    name: '3D Showcase',
    description: 'Two devices in 3D space',
    config: {
      devices: [
        { id: 't6_d1', type: DeviceType.IPHONE_15_PRO, image: null, x: -200, y: 50, rotation: 0, rotateX: 5, rotateY: 25, scale: 0.8, shadow: DEFAULT_SHADOW, zIndex: 1 },
        { id: 't6_d2', type: DeviceType.IPHONE_15_PRO, image: null, x: 200, y: 50, rotation: 0, rotateX: 5, rotateY: -25, scale: 0.8, shadow: DEFAULT_SHADOW, zIndex: 2 }
      ],
      text: { ...DEFAULT_SCREEN_CONFIG.text, position: 'top' }
    }
  }
];