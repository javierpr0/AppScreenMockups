import React, { useState } from 'react';
import { ScreenConfig, DeviceType, DeviceConfig, BackgroundType, PatternType, MeshPoint, ExportConfig, AnimationConfig, GifExportConfig } from '../types';
import { TEMPLATES, BACKGROUND_PRESETS } from '../constants';
import { Download, Upload, MonitorSmartphone, Type, Palette, Layout, Move, RotateCw, Plus, Trash2, Layers, Grid, Box, Image, Circle, Hash, Package, Film } from 'lucide-react';
import ExportPanel from './ExportPanel';
import AnimationPanel from './animation/AnimationPanel';
import { ExportProgress } from '../services/exportService';

interface SidebarProps {
  config: ScreenConfig;
  onChange: (newConfig: ScreenConfig) => void;
  exportConfig: ExportConfig;
  onExportConfigChange: (config: ExportConfig) => void;
  onExportSingle: () => void;
  onExportMultiple: () => void;
  isExporting: boolean;
  exportProgress: ExportProgress | null;
  // Animation props
  animationConfig: AnimationConfig;
  onAnimationConfigChange: (config: AnimationConfig) => void;
  gifConfig: GifExportConfig;
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

const Sidebar: React.FC<SidebarProps> = ({
  config,
  onChange,
  exportConfig,
  onExportConfigChange,
  onExportSingle,
  onExportMultiple,
  isExporting,
  exportProgress,
  animationConfig,
  onAnimationConfigChange,
  gifConfig,
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
  const [activeTab, setActiveTab] = useState<'device' | 'text' | 'style' | 'layout' | 'templates' | 'export' | 'anim'>('templates');
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState<number>(0);

  const currentDevice = config.devices[selectedDeviceIndex] || config.devices[0];

  const updateCurrentDevice = (updates: Partial<DeviceConfig>) => {
    const newDevices = [...config.devices];
    if (newDevices[selectedDeviceIndex]) {
        newDevices[selectedDeviceIndex] = { ...newDevices[selectedDeviceIndex], ...updates };
        onChange({ ...config, devices: newDevices });
    }
  };

  const handleTextChange = (key: keyof typeof config.text, value: any) => {
    onChange({
      ...config,
      text: { ...config.text, [key]: value }
    });
  };

  const handleBgChange = (key: keyof typeof config.background, value: any) => {
    onChange({
      ...config,
      background: { ...config.background, [key]: value }
    });
  };

  const handleAddDevice = () => {
    const newDevice: DeviceConfig = {
        id: `dev_${Date.now()}`,
        type: DeviceType.IPHONE_15_PRO,
        image: null,
        x: 0,
        y: 0,
        rotation: 0,
        rotateX: 0,
        rotateY: 0,
        scale: 0.8,
        shadow: { enabled: true, color: '#000000', blur: 40, opacity: 0.4, offsetY: 20 },
        zIndex: config.devices.length + 1
    };
    const newDevices = [...config.devices, newDevice];
    onChange({ ...config, devices: newDevices });
    setSelectedDeviceIndex(newDevices.length - 1);
    setActiveTab('device');
  };

  const handleRemoveDevice = () => {
    if (config.devices.length <= 1) return;
    const newDevices = config.devices.filter((_, i) => i !== selectedDeviceIndex);
    onChange({ ...config, devices: newDevices });
    setSelectedDeviceIndex(0);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateCurrentDevice({ image: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const applyTemplate = (templateConfig: Partial<ScreenConfig>) => {
      // Preserve ID and specific non-layout settings if needed, but usually templates overwrite devices & text pos
      onChange({
          ...config,
          ...templateConfig,
          devices: templateConfig.devices || config.devices, // Ensure types match
      } as ScreenConfig);
      setSelectedDeviceIndex(0);
      setActiveTab('layout');
  };

  return (
    <div className="w-[400px] flex flex-col bg-slate-900 border-l border-slate-800 h-full z-50">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-900 z-10">
        <div className="flex items-center justify-between mb-6">
            <h1 className="font-bold text-xl text-white">App Gen AI</h1>
            <button
                onClick={() => setActiveTab('export')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'export'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
            >
                <Package size={16} />
                Export
            </button>
        </div>

        <div className="flex bg-slate-800 p-1 rounded-lg">
            {[
                { id: 'templates', icon: Grid, label: 'Tmpl' },
                { id: 'device', icon: MonitorSmartphone, label: 'Dev' },
                { id: 'layout', icon: Layout, label: 'Pos' },
                { id: 'text', icon: Type, label: 'Txt' },
                { id: 'style', icon: Palette, label: 'Sty' },
                { id: 'anim', icon: Film, label: 'Anim' },
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-md text-xs font-medium transition-all ${
                        activeTab === tab.id
                        ? 'bg-slate-700 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                    <tab.icon size={14} />
                    {tab.label}
                </button>
            ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* TEMPLATES TAB */}
        {activeTab === 'templates' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Start from Template</label>
                    <div className="grid grid-cols-2 gap-3">
                        {TEMPLATES.map((t, idx) => (
                            <button
                                key={idx}
                                onClick={() => applyTemplate(t.config)}
                                className="p-4 rounded-xl border border-slate-700 bg-slate-800 hover:border-indigo-500 hover:bg-slate-700 transition-all text-left group"
                            >
                                <div className="font-medium text-slate-200 group-hover:text-white mb-1">{t.name}</div>
                                <div className="text-xs text-slate-500">{t.description}</div>
                            </button>
                        ))}
                    </div>
                </div>
             </div>
        )}

        {/* Device Selection & Configuration */}
        {(activeTab === 'device' || activeTab === 'layout') && (
            <div className="space-y-6">
                {/* Device Selector */}
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 space-y-4">
                     <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                             <Layers size={14} /> Selected Device
                        </label>
                        <div className="flex gap-2">
                             <button onClick={handleAddDevice} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white" title="Add Device">
                                 <Plus size={16} />
                             </button>
                             {config.devices.length > 1 && (
                                <button onClick={handleRemoveDevice} className="p-1 hover:bg-red-900/30 rounded text-slate-400 hover:text-red-400" title="Remove Device">
                                    <Trash2 size={16} />
                                </button>
                             )}
                        </div>
                     </div>
                     <div className="flex gap-2 overflow-x-auto pb-2">
                         {config.devices.map((d, i) => (
                             <button 
                                key={d.id}
                                onClick={() => setSelectedDeviceIndex(i)}
                                className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium border ${
                                    selectedDeviceIndex === i 
                                    ? 'bg-indigo-600 border-indigo-500 text-white' 
                                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                                }`}
                             >
                                 Device {i + 1}
                             </button>
                         ))}
                     </div>
                </div>
                
                {activeTab === 'device' && currentDevice && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                        <div className="space-y-3">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Device Image</label>
                            <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:border-indigo-500 hover:bg-slate-800/50 transition-colors group relative overflow-hidden min-h-[120px]">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-30"
                                />
                                {currentDevice.image ? (
                                    <div className="absolute inset-0 w-full h-full bg-slate-900 z-10">
                                         <img src={currentDevice.image} className="w-full h-full object-contain opacity-50" alt="preview" />
                                         <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
                                            <span className="text-xs text-white">Click to replace</span>
                                         </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-indigo-400">
                                        <Upload size={32} />
                                        <span className="text-sm font-medium">Upload Screenshot</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Device Model</label>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.values(DeviceType).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => updateCurrentDevice({ type })}
                                        className={`px-3 py-2 rounded-lg border text-xs text-left transition-all ${
                                            currentDevice.type === type
                                            ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                                            : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Layer Order</label>
                                <span className="text-xs text-slate-400">Z: {currentDevice.zIndex}</span>
                            </div>
                            <input 
                                type="range" 
                                min="1" 
                                max="10" 
                                step="1"
                                value={currentDevice.zIndex}
                                onChange={(e) => updateCurrentDevice({ zIndex: parseInt(e.target.value) })}
                                className="w-full accent-indigo-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'layout' && currentDevice && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                        {/* Scale */}
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Scale</label>
                                <span className="text-xs text-slate-400">{Math.round(currentDevice.scale * 100)}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0.4" 
                                max="1.5" 
                                step="0.05"
                                value={currentDevice.scale}
                                onChange={(e) => updateCurrentDevice({ scale: parseFloat(e.target.value) })}
                                className="w-full accent-indigo-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <hr className="border-slate-800" />

                        {/* X / Y Position */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                    <Move size={14} /> Position
                                </label>
                                <button 
                                    onClick={() => updateCurrentDevice({ x: 0, y: 0, rotation: 0 })}
                                    className="text-xs text-indigo-400 hover:text-indigo-300"
                                >
                                    Reset
                                </button>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Horizontal (X)</span>
                                    <span>{currentDevice.x}px</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="-600" 
                                    max="600" 
                                    value={currentDevice.x}
                                    onChange={(e) => updateCurrentDevice({ x: parseInt(e.target.value) })}
                                    className="w-full accent-indigo-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Vertical (Y)</span>
                                    <span>{currentDevice.y}px</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="-800" 
                                    max="800" 
                                    value={currentDevice.y}
                                    onChange={(e) => updateCurrentDevice({ y: parseInt(e.target.value) })}
                                    className="w-full accent-indigo-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Rotation */}
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                    <RotateCw size={14} /> Rotation
                                </label>
                                <span className="text-xs text-slate-400">{currentDevice.rotation}°</span>
                            </div>
                            <input
                                type="range"
                                min="-45"
                                max="45"
                                value={currentDevice.rotation}
                                onChange={(e) => updateCurrentDevice({ rotation: parseInt(e.target.value) })}
                                className="w-full accent-indigo-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <hr className="border-slate-800" />

                        {/* 3D Transform */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                                    <Box size={14} /> 3D Transform
                                </label>
                                <button
                                    onClick={() => updateCurrentDevice({ rotateX: 0, rotateY: 0 })}
                                    className="text-xs text-indigo-400 hover:text-indigo-300"
                                >
                                    Reset
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Tilt X (Vertical)</span>
                                    <span>{currentDevice.rotateX || 0}°</span>
                                </div>
                                <input
                                    type="range"
                                    min="-45"
                                    max="45"
                                    value={currentDevice.rotateX || 0}
                                    onChange={(e) => updateCurrentDevice({ rotateX: parseInt(e.target.value) })}
                                    className="w-full accent-indigo-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Tilt Y (Horizontal)</span>
                                    <span>{currentDevice.rotateY || 0}°</span>
                                </div>
                                <input
                                    type="range"
                                    min="-45"
                                    max="45"
                                    value={currentDevice.rotateY || 0}
                                    onChange={(e) => updateCurrentDevice({ rotateY: parseInt(e.target.value) })}
                                    className="w-full accent-indigo-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        </div>

                        <hr className="border-slate-800" />
                        
                        {/* Shadow Settings */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Shadow</label>
                                <input 
                                    type="checkbox"
                                    checked={currentDevice.shadow.enabled}
                                    onChange={(e) => updateCurrentDevice({ shadow: { ...currentDevice.shadow, enabled: e.target.checked } })} 
                                    className="accent-indigo-500"
                                />
                            </div>
                            
                            {currentDevice.shadow.enabled && (
                                <div className="space-y-3 pl-2 border-l-2 border-slate-800">
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>Blur</span>
                                        <span>{currentDevice.shadow.blur}px</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        value={currentDevice.shadow.blur}
                                        onChange={(e) => updateCurrentDevice({ shadow: { ...currentDevice.shadow, blur: parseInt(e.target.value) } })}
                                        className="w-full accent-slate-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                    />

                                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                                        <span>Opacity</span>
                                        <span>{Math.round(currentDevice.shadow.opacity * 100)}%</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="1" 
                                        step="0.05"
                                        value={currentDevice.shadow.opacity}
                                        onChange={(e) => updateCurrentDevice({ shadow: { ...currentDevice.shadow, opacity: parseFloat(e.target.value) } })}
                                        className="w-full accent-slate-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* Text Settings */}
        {activeTab === 'text' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Title</label>
                    <textarea 
                        value={config.text.title}
                        onChange={(e) => handleTextChange('title', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        rows={2}
                    />
                    <div className="flex items-center gap-3">
                         <input 
                            type="color" 
                            value={config.text.titleColor}
                            onChange={(e) => handleTextChange('titleColor', e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                         />
                         <span className="text-xs text-slate-400 uppercase">{config.text.titleColor}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Subtitle</label>
                    <textarea 
                        value={config.text.subtitle}
                        onChange={(e) => handleTextChange('subtitle', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        rows={2}
                    />
                     <div className="flex items-center gap-3">
                         <input 
                            type="color" 
                            value={config.text.subtitleColor}
                            onChange={(e) => handleTextChange('subtitleColor', e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                         />
                         <span className="text-xs text-slate-400 uppercase">{config.text.subtitleColor}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Align</label>
                        <div className="flex bg-slate-800 rounded-lg p-1">
                            {['left', 'center', 'right'].map((align) => (
                                <button
                                    key={align}
                                    onClick={() => handleTextChange('alignment', align)}
                                    className={`flex-1 py-1 rounded capitalize text-xs ${config.text.alignment === align ? 'bg-slate-600 text-white' : 'text-slate-400'}`}
                                >
                                    {align}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Position</label>
                        <div className="flex bg-slate-800 rounded-lg p-1">
                            {['top', 'bottom'].map((pos) => (
                                <button
                                    key={pos}
                                    onClick={() => handleTextChange('position', pos)}
                                    className={`flex-1 py-1 rounded capitalize text-xs ${config.text.position === pos ? 'bg-slate-600 text-white' : 'text-slate-400'}`}
                                >
                                    {pos}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Background Settings */}
        {activeTab === 'style' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Background Presets */}
                {BACKGROUND_PRESETS && BACKGROUND_PRESETS.length > 0 && (
                    <div className="space-y-3">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Quick Presets</label>
                        <div className="grid grid-cols-3 gap-2">
                            {BACKGROUND_PRESETS.map((preset, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => onChange({ ...config, background: preset.config })}
                                    className="h-16 rounded-lg border border-slate-700 hover:border-indigo-500 transition-all overflow-hidden relative group"
                                    style={
                                        preset.config.type === 'gradient'
                                            ? { background: `linear-gradient(${preset.config.direction}, ${preset.config.color1}, ${preset.config.color2})` }
                                            : { backgroundColor: preset.config.color1 }
                                    }
                                >
                                    <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-white font-medium">
                                        {preset.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Background Type Selector */}
                <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Background Type</label>
                    <div className="grid grid-cols-5 gap-2">
                        {[
                            { type: 'solid' as BackgroundType, icon: Circle, label: 'Solid' },
                            { type: 'gradient' as BackgroundType, icon: Palette, label: 'Grad' },
                            { type: 'mesh' as BackgroundType, icon: Box, label: 'Mesh' },
                            { type: 'pattern' as BackgroundType, icon: Hash, label: 'Patt' },
                            { type: 'image' as BackgroundType, icon: Image, label: 'Img' },
                        ].map((item) => (
                            <button
                                key={item.type}
                                onClick={() => {
                                    const newBg = { ...config.background, type: item.type };
                                    // Initialize sub-configs if needed
                                    if (item.type === 'mesh' && !newBg.mesh) {
                                        newBg.mesh = {
                                            points: [
                                                { id: 'm1', x: 20, y: 20, color: '#4f46e5' },
                                                { id: 'm2', x: 80, y: 30, color: '#9333ea' },
                                                { id: 'm3', x: 50, y: 80, color: '#ec4899' },
                                            ],
                                            blur: 60
                                        };
                                    }
                                    if (item.type === 'pattern' && !newBg.pattern) {
                                        newBg.pattern = {
                                            type: 'dots',
                                            color: '#ffffff',
                                            backgroundColor: '#1e1b4b',
                                            size: 8,
                                            spacing: 30,
                                            opacity: 0.3
                                        };
                                    }
                                    if (item.type === 'image' && !newBg.image) {
                                        newBg.image = {
                                            src: null,
                                            blur: 0,
                                            overlayColor: '#000000',
                                            overlayOpacity: 0,
                                            fit: 'cover'
                                        };
                                    }
                                    handleBgChange('type', item.type);
                                    onChange({ ...config, background: newBg });
                                }}
                                className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg border text-[10px] transition-all ${
                                    config.background.type === item.type
                                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                                }`}
                            >
                                <item.icon size={16} />
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Solid/Gradient Colors */}
                {(config.background.type === 'solid' || config.background.type === 'gradient') && (
                    <>
                        <div className="space-y-3">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Colors</label>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
                                    <span className="text-sm text-slate-300">Primary</span>
                                    <input
                                        type="color"
                                        value={config.background.color1}
                                        onChange={(e) => handleBgChange('color1', e.target.value)}
                                        className="w-10 h-10 rounded cursor-pointer bg-transparent border-0"
                                    />
                                </div>

                                {config.background.type === 'gradient' && (
                                    <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
                                        <span className="text-sm text-slate-300">Secondary</span>
                                        <input
                                            type="color"
                                            value={config.background.color2}
                                            onChange={(e) => handleBgChange('color2', e.target.value)}
                                            className="w-10 h-10 rounded cursor-pointer bg-transparent border-0"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {config.background.type === 'gradient' && (
                            <div className="space-y-3">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Direction</label>
                                <select
                                    value={config.background.direction}
                                    onChange={(e) => handleBgChange('direction', e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                                >
                                    <option value="to right">Left to Right</option>
                                    <option value="to bottom">Top to Bottom</option>
                                    <option value="to bottom right">Diagonal</option>
                                    <option value="to top right">Diagonal Reverse</option>
                                </select>
                            </div>
                        )}
                    </>
                )}

                {/* Mesh Gradient Settings */}
                {config.background.type === 'mesh' && config.background.mesh && (
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Mesh Points</label>
                                <button
                                    onClick={() => {
                                        const newPoint: MeshPoint = {
                                            id: `m${Date.now()}`,
                                            x: Math.random() * 80 + 10,
                                            y: Math.random() * 80 + 10,
                                            color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`
                                        };
                                        const newMesh = {
                                            ...config.background.mesh!,
                                            points: [...config.background.mesh!.points, newPoint]
                                        };
                                        onChange({ ...config, background: { ...config.background, mesh: newMesh } });
                                    }}
                                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                                >
                                    <Plus size={12} /> Add Point
                                </button>
                            </div>

                            <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                {config.background.mesh.points.map((point, idx) => (
                                    <div key={point.id} className="flex items-center gap-2 p-2 bg-slate-800 rounded-lg border border-slate-700">
                                        <input
                                            type="color"
                                            value={point.color}
                                            onChange={(e) => {
                                                const newPoints = [...config.background.mesh!.points];
                                                newPoints[idx] = { ...newPoints[idx], color: e.target.value };
                                                onChange({ ...config, background: { ...config.background, mesh: { ...config.background.mesh!, points: newPoints } } });
                                            }}
                                            className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                                        />
                                        <div className="flex-1 grid grid-cols-2 gap-2">
                                            <div className="flex items-center gap-1">
                                                <span className="text-[10px] text-slate-500">X</span>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={point.x}
                                                    onChange={(e) => {
                                                        const newPoints = [...config.background.mesh!.points];
                                                        newPoints[idx] = { ...newPoints[idx], x: parseInt(e.target.value) };
                                                        onChange({ ...config, background: { ...config.background, mesh: { ...config.background.mesh!, points: newPoints } } });
                                                    }}
                                                    className="flex-1 accent-indigo-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                                />
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-[10px] text-slate-500">Y</span>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={point.y}
                                                    onChange={(e) => {
                                                        const newPoints = [...config.background.mesh!.points];
                                                        newPoints[idx] = { ...newPoints[idx], y: parseInt(e.target.value) };
                                                        onChange({ ...config, background: { ...config.background, mesh: { ...config.background.mesh!, points: newPoints } } });
                                                    }}
                                                    className="flex-1 accent-indigo-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                        {config.background.mesh!.points.length > 2 && (
                                            <button
                                                onClick={() => {
                                                    const newPoints = config.background.mesh!.points.filter((_, i) => i !== idx);
                                                    onChange({ ...config, background: { ...config.background, mesh: { ...config.background.mesh!, points: newPoints } } });
                                                }}
                                                className="p-1 hover:bg-red-900/30 rounded text-slate-400 hover:text-red-400"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Blur</label>
                                <span className="text-xs text-slate-400">{config.background.mesh.blur}px</span>
                            </div>
                            <input
                                type="range"
                                min="20"
                                max="100"
                                value={config.background.mesh.blur}
                                onChange={(e) => {
                                    onChange({ ...config, background: { ...config.background, mesh: { ...config.background.mesh!, blur: parseInt(e.target.value) } } });
                                }}
                                className="w-full accent-indigo-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                )}

                {/* Pattern Settings */}
                {config.background.type === 'pattern' && config.background.pattern && (
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pattern Type</label>
                            <div className="grid grid-cols-5 gap-2">
                                {(['dots', 'grid', 'lines', 'diagonal', 'waves'] as PatternType[]).map((patternType) => (
                                    <button
                                        key={patternType}
                                        onClick={() => {
                                            onChange({ ...config, background: { ...config.background, pattern: { ...config.background.pattern!, type: patternType } } });
                                        }}
                                        className={`py-2 rounded-lg border text-[10px] capitalize transition-all ${
                                            config.background.pattern.type === patternType
                                            ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                                            : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                                        }`}
                                    >
                                        {patternType}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
                                <span className="text-xs text-slate-300">Pattern</span>
                                <input
                                    type="color"
                                    value={config.background.pattern.color}
                                    onChange={(e) => {
                                        onChange({ ...config, background: { ...config.background, pattern: { ...config.background.pattern!, color: e.target.value } } });
                                    }}
                                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
                                <span className="text-xs text-slate-300">Background</span>
                                <input
                                    type="color"
                                    value={config.background.pattern.backgroundColor}
                                    onChange={(e) => {
                                        onChange({ ...config, background: { ...config.background, pattern: { ...config.background.pattern!, backgroundColor: e.target.value } } });
                                    }}
                                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <label className="text-xs text-slate-400">Size</label>
                                <span className="text-xs text-slate-400">{config.background.pattern.size}px</span>
                            </div>
                            <input
                                type="range"
                                min="4"
                                max="40"
                                value={config.background.pattern.size}
                                onChange={(e) => {
                                    onChange({ ...config, background: { ...config.background, pattern: { ...config.background.pattern!, size: parseInt(e.target.value) } } });
                                }}
                                className="w-full accent-indigo-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <label className="text-xs text-slate-400">Spacing</label>
                                <span className="text-xs text-slate-400">{config.background.pattern.spacing}px</span>
                            </div>
                            <input
                                type="range"
                                min="10"
                                max="100"
                                value={config.background.pattern.spacing}
                                onChange={(e) => {
                                    onChange({ ...config, background: { ...config.background, pattern: { ...config.background.pattern!, spacing: parseInt(e.target.value) } } });
                                }}
                                className="w-full accent-indigo-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <label className="text-xs text-slate-400">Opacity</label>
                                <span className="text-xs text-slate-400">{Math.round(config.background.pattern.opacity * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0.1"
                                max="1"
                                step="0.05"
                                value={config.background.pattern.opacity}
                                onChange={(e) => {
                                    onChange({ ...config, background: { ...config.background, pattern: { ...config.background.pattern!, opacity: parseFloat(e.target.value) } } });
                                }}
                                className="w-full accent-indigo-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                )}

                {/* Image Background Settings */}
                {config.background.type === 'image' && config.background.image && (
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Background Image</label>
                            <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center hover:border-indigo-500 hover:bg-slate-800/50 transition-colors group relative overflow-hidden min-h-[100px]">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                                onChange({ ...config, background: { ...config.background, image: { ...config.background.image!, src: event.target?.result as string } } });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                />
                                {config.background.image.src ? (
                                    <div className="absolute inset-0 w-full h-full">
                                        <img src={config.background.image.src} className="w-full h-full object-cover opacity-50" alt="bg preview" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                            <span className="text-xs text-white">Click to replace</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-indigo-400">
                                        <Image size={28} />
                                        <span className="text-sm font-medium">Upload Image</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {config.background.image.src && (
                            <>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <label className="text-xs text-slate-400">Blur</label>
                                        <span className="text-xs text-slate-400">{config.background.image.blur}px</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="20"
                                        value={config.background.image.blur}
                                        onChange={(e) => {
                                            onChange({ ...config, background: { ...config.background, image: { ...config.background.image!, blur: parseInt(e.target.value) } } });
                                        }}
                                        className="w-full accent-indigo-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Overlay</label>
                                    <div className="flex gap-3 items-center">
                                        <input
                                            type="color"
                                            value={config.background.image.overlayColor}
                                            onChange={(e) => {
                                                onChange({ ...config, background: { ...config.background, image: { ...config.background.image!, overlayColor: e.target.value } } });
                                            }}
                                            className="w-10 h-10 rounded cursor-pointer bg-transparent border-0"
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between text-xs text-slate-500 mb-1">
                                                <span>Opacity</span>
                                                <span>{Math.round(config.background.image.overlayOpacity * 100)}%</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.05"
                                                value={config.background.image.overlayOpacity}
                                                onChange={(e) => {
                                                    onChange({ ...config, background: { ...config.background, image: { ...config.background.image!, overlayOpacity: parseFloat(e.target.value) } } });
                                                }}
                                                className="w-full accent-indigo-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Fit Mode</label>
                                    <div className="flex gap-2">
                                        {(['cover', 'contain', 'fill'] as const).map((fitMode) => (
                                            <button
                                                key={fitMode}
                                                onClick={() => {
                                                    onChange({ ...config, background: { ...config.background, image: { ...config.background.image!, fit: fitMode } } });
                                                }}
                                                className={`flex-1 py-2 rounded-lg border text-xs capitalize transition-all ${
                                                    config.background.image.fit === fitMode
                                                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                                                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                                                }`}
                                            >
                                                {fitMode}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        )}

        {/* Export Tab */}
        {activeTab === 'export' && (
            <ExportPanel
                exportConfig={exportConfig}
                onExportConfigChange={onExportConfigChange}
                onExportSingle={onExportSingle}
                onExportMultiple={onExportMultiple}
                isExporting={isExporting}
                exportProgress={exportProgress}
            />
        )}

        {/* Animation Tab */}
        {activeTab === 'anim' && (
            <AnimationPanel
                animationConfig={animationConfig}
                gifConfig={gifConfig}
                onAnimationConfigChange={onAnimationConfigChange}
                onGifConfigChange={onGifConfigChange}
                onPlay={onPlay}
                onPause={onPause}
                onStop={onStop}
                onSeek={onSeek}
                onExportGif={onExportGif}
                currentTime={currentTime}
                isPlaying={isPlaying}
                isExportingGif={isExportingGif}
                gifProgress={gifProgress}
            />
        )}
      </div>
    </div>
  );
};

export default Sidebar;