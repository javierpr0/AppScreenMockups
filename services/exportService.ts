import JSZip from 'jszip';
import { ExportSize } from '../types';
import { EXPORT_SIZES, CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';

declare global {
  interface Window {
    html2canvas: (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
  }
}

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
   * Generates a scaled canvas to the desired size
   */
  static async generateScaledCanvas(
    sourceElement: HTMLElement,
    targetWidth: number,
    targetHeight: number
  ): Promise<HTMLCanvasElement> {
    // Calculate scale factor
    const scaleX = targetWidth / CANVAS_WIDTH;
    const scaleY = targetHeight / CANVAS_HEIGHT;
    const scale = Math.max(scaleX, scaleY);

    // Capture with html2canvas
    const canvas = await window.html2canvas(sourceElement, {
      scale: scale,
      useCORS: true,
      backgroundColor: null,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
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
   * Exports a single PNG (current behavior)
   */
  static async exportSinglePng(sourceElement: HTMLElement): Promise<void> {
    const canvas = await window.html2canvas(sourceElement, {
      scale: 1,
      useCORS: true,
      backgroundColor: null,
    });

    const link = document.createElement('a');
    link.download = `mockup-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
}
