import React, { useState } from 'react';
import { ScreenConfig, DeviceType, DeviceConfig } from '../types';
import { TEMPLATES } from '../constants';
import { Download, Upload, MonitorSmartphone, Type, Palette, Layout, Move, RotateCw, Plus, Trash2, Layers, Grid, Box } from 'lucide-react';

interface SidebarProps {
  config: ScreenConfig;
  onChange: (newConfig: ScreenConfig) => void;
  onExport: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ config, onChange, onExport }) => {
  const [activeTab, setActiveTab] = useState<'device' | 'text' | 'style' | 'layout' | 'templates'>('templates');
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
                onClick={onExport}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
                <Download size={16} />
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
                <div className="space-y-3">
                     <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Type</label>
                     <div className="flex gap-3">
                        {['solid', 'gradient'].map((t) => (
                             <button
                                key={t}
                                onClick={() => handleBgChange('type', t)}
                                className={`flex-1 py-2 px-4 rounded-lg border text-sm capitalize ${
                                    config.background.type === t
                                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                                    : 'border-slate-700 bg-slate-800 text-slate-300'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                     </div>
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Colors</label>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
                            <span className="text-sm text-slate-300">Primary Color</span>
                            <input 
                                type="color" 
                                value={config.background.color1}
                                onChange={(e) => handleBgChange('color1', e.target.value)}
                                className="w-10 h-10 rounded cursor-pointer bg-transparent border-0"
                            />
                        </div>
                        
                        {config.background.type === 'gradient' && (
                            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
                                <span className="text-sm text-slate-300">Secondary Color</span>
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
            </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;