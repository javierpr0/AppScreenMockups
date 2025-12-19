import React from 'react';
import { Play, Pause, Square, RotateCcw, Film, Loader2, Download } from 'lucide-react';
import { AnimationConfig, GifExportConfig } from '../../types';
import { ANIMATION_PRESETS } from '../../constants';

interface AnimationPanelProps {
  animationConfig: AnimationConfig;
  gifConfig: GifExportConfig;
  onAnimationConfigChange: (config: AnimationConfig) => void;
  onGifConfigChange: (config: GifExportConfig) => void;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onSeek: (time: number) => void;
  onExportGif: () => void;
  currentTime: number;
  isPlaying: boolean;
  isExportingGif: boolean;
  gifProgress: number | null;
}

const AnimationPanel: React.FC<AnimationPanelProps> = ({
  animationConfig,
  gifConfig,
  onAnimationConfigChange,
  onGifConfigChange,
  onPlay,
  onPause,
  onStop,
  onSeek,
  onExportGif,
  currentTime,
  isPlaying,
  isExportingGif,
  gifProgress
}) => {
  const selectedPreset = ANIMATION_PRESETS.find(p => p.id === animationConfig.presetId);

  const handlePresetSelect = (presetId: string) => {
    const preset = ANIMATION_PRESETS.find(p => p.id === presetId);
    onAnimationConfigChange({
      ...animationConfig,
      enabled: true,
      presetId,
      duration: preset?.duration || 2000
    });
  };

  const toggleEnabled = () => {
    onAnimationConfigChange({
      ...animationConfig,
      enabled: !animationConfig.enabled
    });
    if (animationConfig.enabled) {
      onStop();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Enable Animation Toggle */}
      <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
        <div>
          <div className="font-medium text-white">Enable Animation</div>
          <div className="text-xs text-slate-400">Animate devices for video/GIF export</div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={animationConfig.enabled}
            onChange={toggleEnabled}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>

      {animationConfig.enabled && (
        <>
          {/* Animation Presets */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Animation Preset</label>
            <div className="grid grid-cols-2 gap-2">
              {ANIMATION_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    animationConfig.presetId === preset.id
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="font-medium text-white text-sm">{preset.name}</div>
                  <div className="text-xs text-slate-500">{preset.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Playback Controls */}
          {selectedPreset && (
            <div className="space-y-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Playback</label>

              {/* Control Buttons */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={onStop}
                  className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
                  title="Stop"
                >
                  <Square size={20} />
                </button>

                <button
                  onClick={isPlaying ? onPause : onPlay}
                  className="p-4 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>

                <button
                  onClick={() => onSeek(0)}
                  className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
                  title="Restart"
                >
                  <RotateCcw size={20} />
                </button>
              </div>

              {/* Timeline Scrubber */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{Math.round(currentTime * 100)}%</span>
                  <span>{animationConfig.duration}ms</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={currentTime}
                  onChange={(e) => onSeek(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Duration Control */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Duration</span>
                  <span>{animationConfig.duration}ms</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="100"
                  value={animationConfig.duration}
                  onChange={(e) => onAnimationConfigChange({
                    ...animationConfig,
                    duration: parseInt(e.target.value)
                  })}
                  className="w-full accent-indigo-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Loop Toggle */}
              <label className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700 cursor-pointer">
                <span className="text-sm text-slate-300">Loop Animation</span>
                <input
                  type="checkbox"
                  checked={animationConfig.loop}
                  onChange={(e) => onAnimationConfigChange({
                    ...animationConfig,
                    loop: e.target.checked
                  })}
                  className="accent-indigo-500 w-4 h-4"
                />
              </label>
            </div>
          )}

          {/* GIF Export Section */}
          {selectedPreset && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <label className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                <Film size={14} /> Export GIF
              </label>

              {/* GIF Settings */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">FPS</label>
                  <select
                    value={gifConfig.fps}
                    onChange={(e) => onGifConfigChange({
                      ...gifConfig,
                      fps: parseInt(e.target.value)
                    })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white"
                  >
                    <option value="10">10 fps</option>
                    <option value="15">15 fps</option>
                    <option value="20">20 fps</option>
                    <option value="24">24 fps</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Quality</label>
                  <select
                    value={gifConfig.quality}
                    onChange={(e) => onGifConfigChange({
                      ...gifConfig,
                      quality: parseInt(e.target.value)
                    })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white"
                  >
                    <option value="5">Low</option>
                    <option value="8">Medium</option>
                    <option value="10">High</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400">Size</label>
                <div className="flex gap-2">
                  {[
                    { w: 414, h: 736, label: 'Small' },
                    { w: 621, h: 1104, label: 'Medium' },
                    { w: 828, h: 1472, label: 'Large' }
                  ].map((size) => (
                    <button
                      key={size.label}
                      onClick={() => onGifConfigChange({
                        ...gifConfig,
                        width: size.w,
                        height: size.h
                      })}
                      className={`flex-1 py-2 rounded-lg border text-xs transition-all ${
                        gifConfig.width === size.w
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                          : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
                <div className="text-xs text-slate-500 text-center">
                  {gifConfig.width} x {gifConfig.height}px
                </div>
              </div>

              {/* Export Progress */}
              {gifProgress !== null && (
                <div className="bg-indigo-500/10 border border-indigo-500/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Loader2 size={16} className="animate-spin text-indigo-400" />
                    <span className="text-sm text-white">Creating GIF...</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all"
                      style={{ width: `${gifProgress}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{Math.round(gifProgress)}%</div>
                </div>
              )}

              {/* Export Button */}
              <button
                onClick={onExportGif}
                disabled={isExportingGif}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-700 disabled:to-slate-700 text-white px-4 py-3 rounded-xl font-medium transition-all"
              >
                {isExportingGif ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Download size={18} />
                )}
                Export as GIF
              </button>
            </div>
          )}
        </>
      )}

      {!animationConfig.enabled && (
        <div className="text-center py-8 text-slate-500">
          <Film size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-sm">Enable animation to create GIFs</p>
          <p className="text-xs mt-1">Select a preset and preview your animation</p>
        </div>
      )}
    </div>
  );
};

export default AnimationPanel;
