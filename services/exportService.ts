import JSZip from 'jszip';
import * as htmlToImage from 'html-to-image';
import { ExportSize } from '../types';
import { EXPORT_SIZES, CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';

export interface ExportResult {
  blob: Blob;
  filename: string;
}

export interface ExportProgress {
  current: number;
  total: number;
  currentSize?: string;
}

export class ExportService {
  /**
   * Prepares element for capture and returns cleanup function
   */
  private static prepareForCapture(sourceElement: HTMLElement): () => void {
    // Save original styles
    const originalTransform = sourceElement.style.transform;
    const originalMargin = sourceElement.style.margin;
    const originalPosition = sourceElement.style.position;
    const originalLeft = sourceElement.style.left;
    const originalTop = sourceElement.style.top;

    // Get parent and save its overflow
    const parent = sourceElement.parentElement;
    const originalOverflow = parent?.style.overflow || '';

    // Temporarily reset styles for capture
    sourceElement.style.transform = 'none';
    sourceElement.style.margin = '0';
    sourceElement.style.position = 'absolute';
    sourceElement.style.left = '0';
    sourceElement.style.top = '0';

    if (parent) {
      parent.style.overflow = 'visible';
    }

    // Return cleanup function
    return () => {
      sourceElement.style.transform = originalTransform;
      sourceElement.style.margin = originalMargin;
      sourceElement.style.position = originalPosition;
      sourceElement.style.left = originalLeft;
      sourceElement.style.top = originalTop;

      if (parent) {
        parent.style.overflow = originalOverflow;
      }
    };
  }

  /**
   * Generates a scaled canvas to the desired size
   */
  static async generateScaledCanvas(
    sourceElement: HTMLElement,
    targetWidth: number,
    targetHeight: number
  ): Promise<HTMLCanvasElement> {
    const cleanup = this.prepareForCapture(sourceElement);

    try {
      // Wait for styles to apply
      await new Promise(resolve => requestAnimationFrame(resolve));

      // Calculate pixel ratio for quality
      const pixelRatio = Math.max(targetWidth / CANVAS_WIDTH, targetHeight / CANVAS_HEIGHT, 2);

      // Capture using html-to-image
      const canvas = await htmlToImage.toCanvas(sourceElement, {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        pixelRatio: pixelRatio,
        skipFonts: false,
        cacheBust: true,
      });

      // Resize to exact dimensions
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = targetWidth;
      finalCanvas.height = targetHeight;
      const ctx = finalCanvas.getContext('2d')!;

      // Calculate crop dimensions (cover mode)
      const sourceAspect = canvas.width / canvas.height;
      const targetAspect = targetWidth / targetHeight;

      let sx = 0, sy = 0, sWidth = canvas.width, sHeight = canvas.height;

      if (sourceAspect > targetAspect) {
        sWidth = canvas.height * targetAspect;
        sx = (canvas.width - sWidth) / 2;
      } else {
        sHeight = canvas.width / targetAspect;
        sy = (canvas.height - sHeight) / 2;
      }

      ctx.drawImage(canvas, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);

      return finalCanvas;
    } finally {
      cleanup();
    }
  }

  /**
   * Exports a single size as Blob
   */
  static async exportSingleSize(
    sourceElement: HTMLElement,
    size: ExportSize,
    format: 'png' | 'jpg' = 'png',
    quality: number = 1
  ): Promise<ExportResult> {
    const canvas = await this.generateScaledCanvas(
      sourceElement,
      size.width,
      size.height
    );

    const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve({
          blob: blob!,
          filename: `screenshot_${size.suffix}.${format}`
        });
      }, mimeType, quality);
    });
  }

  /**
   * Exports multiple sizes as a ZIP file
   */
  static async exportMultipleSizes(
    sourceElement: HTMLElement,
    sizeIds: string[],
    format: 'png' | 'jpg' = 'png',
    quality: number = 1,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<Blob> {
    const zip = new JSZip();
    const sizes = EXPORT_SIZES.filter(s => sizeIds.includes(s.id));

    // Group by platform
    const iosFolder = zip.folder('ios');
    const androidFolder = zip.folder('android');

    for (let i = 0; i < sizes.length; i++) {
      const size = sizes[i];
      onProgress?.({
        current: i + 1,
        total: sizes.length,
        currentSize: size.name
      });

      const result = await this.exportSingleSize(
        sourceElement,
        size,
        format,
        quality
      );

      const folder = size.platform === 'ios' ? iosFolder : androidFolder;
      folder?.file(result.filename, result.blob);
    }

    return zip.generateAsync({ type: 'blob' });
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

  /**
   * Exports a single PNG (main export function)
   */
  static async exportSinglePng(sourceElement: HTMLElement): Promise<void> {
    const cleanup = this.prepareForCapture(sourceElement);

    try {
      // Wait for styles to apply
      await new Promise(resolve => requestAnimationFrame(resolve));

      // Capture at 2x resolution for quality
      const dataUrl = await htmlToImage.toPng(sourceElement, {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        pixelRatio: 2,
        skipFonts: false,
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `mockup-${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      cleanup();
    }
  }
}
