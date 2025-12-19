import React, { useState, useRef, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import EditorCanvas from './components/EditorCanvas';
import { ScreenConfig, ExportConfig, AnimationConfig, GifExportConfig } from './types';
import { DEFAULT_SCREEN_CONFIG, DEFAULT_EXPORT_CONFIG, DEFAULT_ANIMATION_CONFIG, DEFAULT_GIF_CONFIG } from './constants';
import { ExportService, ExportProgress } from './services/exportService';
import { GifExportService } from './services/gifExportService';
import { useAnimation } from './hooks/useAnimation';

const App: React.FC = () => {
  const [config, setConfig] = useState<ScreenConfig>(DEFAULT_SCREEN_CONFIG);
  const [exportConfig, setExportConfig] = useState<ExportConfig>(DEFAULT_EXPORT_CONFIG);
  const [animationConfig, setAnimationConfig] = useState<AnimationConfig>(DEFAULT_ANIMATION_CONFIG);
  const [gifConfig, setGifConfig] = useState<GifExportConfig>(DEFAULT_GIF_CONFIG);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const [isExportingGif, setIsExportingGif] = useState(false);
  const [gifProgress, setGifProgress] = useState<number | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Animation hook
  const {
    animatedDevices,
    play,
    pause,
    stop,
    seek,
    currentTime,
    isPlaying
  } = useAnimation(config.devices, animationConfig);

  // Create config with animated devices for rendering
  const renderConfig = {
    ...config,
    devices: animationConfig.enabled ? animatedDevices : config.devices
  };

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

      // Create a seek function that updates animation and waits for render
      const seekAnimation = async (time: number) => {
        seek(time);
        // Wait for state to update and re-render
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
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950">
      <main className="flex-1 h-full relative overflow-hidden flex flex-col">
        {/* Top Bar for Mobile/Tablet views could go here, currently Sidebar handles controls */}
        <div className="flex-1 relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950">
           {/* Grid Pattern Background */}
           <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
                style={{ 
                    backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }} 
           ></div>
           
           <EditorCanvas config={renderConfig} canvasRef={canvasRef} />
        </div>
      </main>

      <Sidebar
        config={config}
        onChange={setConfig}
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