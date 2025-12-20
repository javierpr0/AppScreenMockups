import React, { useState, useRef, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import EditorCanvas from './components/EditorCanvas';
import ScreensPanel from './components/ScreensPanel';
import CanvasControls from './components/CanvasControls';
import { ScreenConfig, ExportConfig, AnimationConfig, GifExportConfig } from './types';
import { DEFAULT_EXPORT_CONFIG, DEFAULT_ANIMATION_CONFIG, DEFAULT_GIF_CONFIG, CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';
import { ExportService, ExportProgress } from './services/exportService';
import { GifExportService } from './services/gifExportService';
import { useAnimation } from './hooks/useAnimation';
import { useProject } from './hooks/useProject';
import * as htmlToImage from 'html-to-image';

const App: React.FC = () => {
  // Project management
  const {
    project,
    activeScreen,
    activeConfig,
    addScreen,
    duplicateActiveScreen,
    deleteScreen,
    selectScreen,
    renameScreen,
    reorderScreens,
    updateActiveConfig,
    updateScreenThumbnail,
    renameProject,
    resetProject,
  } = useProject();

  // Export state
  const [exportConfig, setExportConfig] = useState<ExportConfig>(DEFAULT_EXPORT_CONFIG);
  const [animationConfig, setAnimationConfig] = useState<AnimationConfig>(DEFAULT_ANIMATION_CONFIG);
  const [gifConfig, setGifConfig] = useState<GifExportConfig>(DEFAULT_GIF_CONFIG);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const [isExportingGif, setIsExportingGif] = useState(false);
  const [gifProgress, setGifProgress] = useState<number | null>(null);

  // Zoom/Pan state
  const [zoom, setZoom] = useState(0.3); // Default matches canvas preview scale
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);
  const canvasAreaRef = useRef<HTMLDivElement>(null);

  // Animation hook
  const {
    animatedDevices,
    play,
    pause,
    stop,
    seek,
    currentTime,
    isPlaying
  } = useAnimation(activeConfig.devices, animationConfig);

  // Create config with animated devices for rendering
  const renderConfig = {
    ...activeConfig,
    devices: animationConfig.enabled ? animatedDevices : activeConfig.devices
  };

  // Generate thumbnail when switching screens
  const generateThumbnail = useCallback(async () => {
    if (!canvasRef.current) return;

    try {
      const thumbnail = await htmlToImage.toJpeg(canvasRef.current, {
        quality: 0.3,
        pixelRatio: 0.1, // Small thumbnail
        skipFonts: true,
      });
      updateScreenThumbnail(activeScreen.id, thumbnail);
    } catch (error) {
      console.error('Failed to generate thumbnail:', error);
    }
  }, [activeScreen.id, updateScreenThumbnail]);

  // Generate thumbnail after config changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      generateThumbnail();
    }, 1000);
    return () => clearTimeout(timer);
  }, [activeConfig, generateThumbnail]);

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.1, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.1, 0.1));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoom(0.3);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleFitToView = useCallback(() => {
    if (!canvasAreaRef.current) return;

    const container = canvasAreaRef.current;
    const containerWidth = container.clientWidth - 32; // Padding
    const containerHeight = container.clientHeight - 32;

    const scaleX = containerWidth / CANVAS_WIDTH;
    const scaleY = containerHeight / CANVAS_HEIGHT;
    const fitZoom = Math.min(scaleX, scaleY, 1);

    setZoom(fitZoom);
    setPan({ x: 0, y: 0 });
  }, []);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      setZoom(prev => Math.max(0.1, Math.min(3, prev + delta)));
    }
  }, []);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) { // Middle click or Alt+click
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Export handlers
  const handleExportSingle = async () => {
    if (!canvasRef.current) return;

    try {
      setIsExporting(true);
      await ExportService.exportSinglePng(canvasRef.current);
    } catch (error) {
      console.error("Export failed", error);
      alert("Could not export image. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportMultiple = async () => {
    if (!canvasRef.current) return;

    try {
      setIsExporting(true);
      const zip = await ExportService.exportMultipleSizes(
        canvasRef.current,
        exportConfig.selectedSizes,
        exportConfig.format,
        exportConfig.quality,
        (progress) => setExportProgress(progress)
      );

      ExportService.downloadBlob(zip, `mockups-${Date.now()}.zip`);
    } catch (error) {
      console.error("Export failed", error);
      alert("Could not export images. Please try again.");
    } finally {
      setIsExporting(false);
      setExportProgress(null);
    }
  };

  // GIF export handler
  const handleExportGif = useCallback(async () => {
    if (!canvasRef.current) return;

    try {
      setIsExportingGif(true);
      setGifProgress(0);

      const seekAnimation = async (time: number) => {
        seek(time);
        await new Promise(resolve => setTimeout(resolve, 50));
      };

      const gifBlob = await GifExportService.exportGif(
        canvasRef.current,
        animationConfig,
        gifConfig,
        seekAnimation,
        (progress) => setGifProgress(progress.percentage)
      );

      GifExportService.downloadBlob(gifBlob, `animation-${Date.now()}.gif`);
    } catch (error) {
      console.error("GIF export failed", error);
      alert("Could not export GIF. Please try again.");
    } finally {
      setIsExportingGif(false);
      setGifProgress(null);
      stop();
    }
  }, [animationConfig, gifConfig, seek, stop]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950">
      <main className="flex-1 h-full relative overflow-hidden flex flex-col">
        {/* Screens Panel - Horizontal above canvas */}
        <ScreensPanel
          project={project}
          activeScreenId={activeScreen.id}
          onSelectScreen={selectScreen}
          onAddScreen={addScreen}
          onDuplicateScreen={duplicateActiveScreen}
          onDeleteScreen={deleteScreen}
          onRenameScreen={renameScreen}
          onRenameProject={renameProject}
        />

        {/* Canvas Area */}
        <div
          ref={canvasAreaRef}
          className="flex-1 relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 to-zinc-950 overflow-hidden"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: isPanning ? 'grabbing' : 'default' }}
        >
          {/* Grid Pattern Background */}
          <div
            className="absolute inset-0 z-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(#3f3f46 1px, transparent 1px), linear-gradient(90deg, #3f3f46 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />

          <EditorCanvas
            config={renderConfig}
            canvasRef={canvasRef}
            zoom={zoom}
            pan={pan}
          />

          {/* Canvas Controls */}
          <CanvasControls
            zoom={zoom}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetZoom={handleResetZoom}
            onFitToView={handleFitToView}
          />
        </div>
      </main>

      <Sidebar
        config={activeConfig}
        onChange={updateActiveConfig}
        exportConfig={exportConfig}
        onExportConfigChange={setExportConfig}
        onExportSingle={handleExportSingle}
        onExportMultiple={handleExportMultiple}
        isExporting={isExporting}
        exportProgress={exportProgress}
        animationConfig={animationConfig}
        onAnimationConfigChange={setAnimationConfig}
        gifConfig={gifConfig}
        onGifConfigChange={setGifConfig}
        onPlay={play}
        onPause={pause}
        onStop={stop}
        onSeek={seek}
        onExportGif={handleExportGif}
        currentTime={currentTime}
        isPlaying={isPlaying}
        isExportingGif={isExportingGif}
        gifProgress={gifProgress}
      />
    </div>
  );
};

export default App;
