import React, { useState, useRef, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import EditorCanvas from './components/EditorCanvas';
import ScreensPanel from './components/ScreensPanel';
import CanvasControls from './components/CanvasControls';
import { ExportConfig, AnimationConfig, GifExportConfig } from './types';
import { DEFAULT_EXPORT_CONFIG, DEFAULT_ANIMATION_CONFIG, DEFAULT_GIF_CONFIG, CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';
import { ExportService, ExportProgress } from './services/exportService';
import { GifExportService } from './services/gifExportService';
import { useAnimation } from './hooks/useAnimation';
import { useProject } from './hooks/useProject';
import * as htmlToImage from 'html-to-image';
import { Undo2, Redo2, Upload, Download } from 'lucide-react';
import { ProjectImportExportService } from './services/projectImportExportService';
import { Project } from './types';
import { useToast } from './components/ui/toast';

const App: React.FC = () => {
  const { showToast } = useToast();
  
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
    undo,
    redo,
    canUndo,
    canRedo,
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

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Ctrl/Cmd + Z: Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      }

      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y: Redo
      if ((e.ctrlKey || e.metaKey) && (e.shiftKey && e.key === 'z') || (e.ctrlKey && e.key === 'y')) {
        e.preventDefault();
        if (canRedo) redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

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
      showToast("Could not export image. Please try again.", 'error');
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
      showToast("Images exported successfully!", 'success');
    } catch (error) {
      console.error("Export failed", error);
      showToast("Could not export images. Please try again.", 'error');
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
      showToast("GIF exported successfully!", 'success');
    } catch (error) {
      console.error("GIF export failed", error);
      showToast("Could not export GIF. Please try again.", 'error');
    } finally {
      setIsExportingGif(false);
      setGifProgress(null);
      stop();
    }
  }, [animationConfig, gifConfig, seek, stop, showToast]);

  // Import/Export handlers
  const handleExportProject = useCallback(() => {
    ProjectImportExportService.exportProject(project);
    showToast('Project exported successfully!', 'success');
  }, [project, showToast]);

  const handleImportProject = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedProject = await ProjectImportExportService.importProject(file);
      
      // Confirm before overwriting
      if (project.screens.length > 1 || project.screens[0].config.devices.length > 0) {
        const confirmed = window.confirm(
          'Importing will replace your current project. Are you sure?'
        );
        if (!confirmed) return;
      }

      // Load imported project by resetting state
      resetProject(); // This creates a new blank project first
      // Then we need to update with the imported data
      // Since resetProject creates a new project, we need to override it
      const { storageService } = await import('./services/storageService');
      storageService.saveNow(importedProject);
      showToast('Project imported successfully!', 'success');
      window.location.reload(); // Reload to load the new project
    } catch (error) {
      showToast(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }

    // Reset input
    e.target.value = '';
  }, [project, resetProject, showToast]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950">
      <main className="flex-1 h-full relative overflow-hidden flex flex-col">
        {/* Top Toolbar with Undo/Redo */}
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <button
              onClick={undo}
              disabled={!canUndo}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                canUndo
                  ? 'text-zinc-200 hover:bg-zinc-800 hover:text-white'
                  : 'text-zinc-600 cursor-not-allowed'
              }`}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
              <span className="hidden sm:inline">Undo</span>
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                canRedo
                  ? 'text-zinc-200 hover:bg-zinc-800 hover:text-white'
                  : 'text-zinc-600 cursor-not-allowed'
              }`}
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 className="w-4 h-4" />
              <span className="hidden sm:inline">Redo</span>
            </button>
            <div className="w-px h-6 bg-zinc-700 mx-2" />
            <button
              onClick={handleExportProject}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
              title="Export Project"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Import</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportProject}
                className="hidden"
              />
            </label>
          </div>
          <div className="text-xs text-zinc-500">
            {canUndo && 'Press Ctrl+Z to undo'}
            {canRedo && !canUndo && 'Press Ctrl+Shift+Z to redo'}
          </div>
        </div>

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
