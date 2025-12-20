import { encode } from 'modern-gif';
import * as htmlToImage from 'html-to-image';
import { GifExportConfig, AnimationConfig } from '../types';
import { ANIMATION_PRESETS, CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';

export interface GifExportProgress {
  phase: 'capturing' | 'encoding';
  current: number;
  total: number;
  percentage: number;
}

export class GifExportService {
  /**
   * Captures a single frame from the canvas
   */
  static async captureFrame(
    sourceElement: HTMLElement,
    width: number,
    height: number
  ): Promise<ImageData> {
    // Save current styles
    const originalTransform = sourceElement.style.transform;
    const originalMargin = sourceElement.style.margin;
    const originalPosition = sourceElement.style.position;
    const originalLeft = sourceElement.style.left;
    const originalTop = sourceElement.style.top;

    // Get parent and save its overflow
    const parent = sourceElement.parentElement;
    const originalOverflow = parent?.style.overflow || '';

    try {
      // Temporarily reset styles for capture
      sourceElement.style.transform = 'none';
      sourceElement.style.margin = '0';
      sourceElement.style.position = 'absolute';
      sourceElement.style.left = '0';
      sourceElement.style.top = '0';

      if (parent) {
        parent.style.overflow = 'visible';
      }

      // Calculate scale for quality
      const pixelRatio = Math.max(width / CANVAS_WIDTH, height / CANVAS_HEIGHT, 1);

      // Capture using html-to-image
      const canvas = await htmlToImage.toCanvas(sourceElement, {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        pixelRatio: pixelRatio,
        skipFonts: true, // Skip fonts for faster GIF capture
        cacheBust: false,
      });

      // Resize to exact dimensions
      const resizedCanvas = document.createElement('canvas');
      resizedCanvas.width = width;
      resizedCanvas.height = height;
      const ctx = resizedCanvas.getContext('2d')!;

      // Draw with cover scaling
      const sourceAspect = canvas.width / canvas.height;
      const targetAspect = width / height;

      let sx = 0, sy = 0, sWidth = canvas.width, sHeight = canvas.height;

      if (sourceAspect > targetAspect) {
        sWidth = canvas.height * targetAspect;
        sx = (canvas.width - sWidth) / 2;
      } else {
        sHeight = canvas.width / targetAspect;
        sy = (canvas.height - sHeight) / 2;
      }

      ctx.drawImage(canvas, sx, sy, sWidth, sHeight, 0, 0, width, height);

      return ctx.getImageData(0, 0, width, height);
    } finally {
      // Restore original styles
      sourceElement.style.transform = originalTransform;
      sourceElement.style.margin = originalMargin;
      sourceElement.style.position = originalPosition;
      sourceElement.style.left = originalLeft;
      sourceElement.style.top = originalTop;

      if (parent) {
        parent.style.overflow = originalOverflow;
      }
    }
  }

  /**
   * Exports animation as GIF
   */
  static async exportGif(
    sourceElement: HTMLElement,
    animationConfig: AnimationConfig,
    gifConfig: GifExportConfig,
    seekAnimation: (time: number) => Promise<void>,
    onProgress?: (progress: GifExportProgress) => void
  ): Promise<Blob> {
    const preset = ANIMATION_PRESETS.find(p => p.id === animationConfig.presetId);
    if (!preset) {
      throw new Error('No animation preset selected');
    }

    const { fps, quality, width, height } = gifConfig;
    const duration = animationConfig.duration;

    // Calculate total frames
    const totalFrames = Math.ceil((duration / 1000) * fps);
    const frameDelay = Math.round(1000 / fps);

    const frames: { data: ImageData; delay: number }[] = [];

    // Capture frames
    for (let i = 0; i < totalFrames; i++) {
      const time = i / (totalFrames - 1);

      onProgress?.({
        phase: 'capturing',
        current: i + 1,
        total: totalFrames,
        percentage: ((i + 1) / totalFrames) * 50 // First 50%
      });

      // Seek animation to current time
      await seekAnimation(time);

      // Wait for render
      await new Promise(resolve => requestAnimationFrame(() => {
        requestAnimationFrame(resolve);
      }));

      // Capture frame
      const imageData = await this.captureFrame(sourceElement, width, height);

      frames.push({
        data: imageData,
        delay: frameDelay
      });
    }

    // Encode GIF
    onProgress?.({
      phase: 'encoding',
      current: 0,
      total: frames.length,
      percentage: 50
    });

    const gif = await encode({
      width,
      height,
      frames: frames.map((frame, index) => {
        onProgress?.({
          phase: 'encoding',
          current: index + 1,
          total: frames.length,
          percentage: 50 + ((index + 1) / frames.length) * 50
        });

        return {
          data: frame.data.data,
          delay: frame.delay
        };
      })
    });

    return new Blob([gif], { type: 'image/gif' });
  }

  /**
   * Downloads a Blob as a file
   */
  static downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}
