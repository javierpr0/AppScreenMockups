import React, { useState } from 'react'
import { ScreenConfig, DeviceConfig, ExportConfig, AnimationConfig, GifExportConfig, DeviceType, BackgroundType, PatternType } from '../types'
import { TEMPLATES, BACKGROUND_PRESETS } from '../constants'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { Label } from './ui/label'
import { Slider } from './ui/slider'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { ColorPickerInline } from './ui/color-picker'
import { cn } from '@/lib/utils'
import {
  ChevronDown, ChevronRight, Smartphone, Type, Palette, Download,
  Plus, Trash2, Upload, Move, RotateCcw, Layers, Image, Grid, Circle, Box, Hash,
  Play, Pause, Square, Film
} from 'lucide-react'
import { ExportProgress } from '../services/exportService'

interface SidebarProps {
  config: ScreenConfig
  onChange: (newConfig: ScreenConfig, trackHistory?: boolean) => void
  exportConfig: ExportConfig
  onExportConfigChange: (config: ExportConfig) => void
  onExportSingle: () => void
  onExportMultiple: () => void
  isExporting: boolean
  exportProgress: ExportProgress | null
  animationConfig: AnimationConfig
  onAnimationConfigChange: (config: AnimationConfig) => void
  gifConfig: GifExportConfig
  onGifConfigChange: (config: GifExportConfig) => void
  onPlay: () => void
  onPause: () => void
  onStop: () => void
  onSeek: (time: number) => void
  onExportGif: () => void
  currentTime: number
  isPlaying: boolean
  isExportingGif: boolean
  gifProgress: number | null
  selectedDeviceIndex: number
  setSelectedDeviceIndex: (index: number) => void
}

// Collapsible Section Component
const Section: React.FC<{
  title: string
  icon?: React.ReactNode
  defaultOpen?: boolean
  children: React.ReactNode
  badge?: string
}> = ({ title, icon, defaultOpen = true, children, badge }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-zinc-800 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-zinc-800/50 transition-colors"
      >
        {isOpen ? <ChevronDown size={14} className="text-zinc-500" /> : <ChevronRight size={14} className="text-zinc-500" />}
        {icon && <span className="text-zinc-400">{icon}</span>}
        <span className="text-xs font-medium text-zinc-300 flex-1 text-left">{title}</span>
        {badge && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-700 text-zinc-400">{badge}</span>
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  )
}

// Device Type Groups
const DEVICE_GROUPS = [
  {
    name: 'iPhone',
    devices: [
      DeviceType.IPHONE_17_PRO,
      DeviceType.IPHONE_17_PRO_MAX,
      DeviceType.IPHONE_16_PRO,
      DeviceType.IPHONE_16_PRO_MAX,
      DeviceType.IPHONE_15_PRO,
      DeviceType.IPHONE_15_PRO_MAX,
      DeviceType.IPHONE_14_PRO,
      DeviceType.IPHONE_SE,
    ]
  },
  {
    name: 'iPad',
    devices: [
      DeviceType.IPAD_PRO_13,
      DeviceType.IPAD_PRO_11,
    ]
  },
  {
    name: 'Samsung',
    devices: [
      DeviceType.SAMSUNG_S24_ULTRA,
      DeviceType.SAMSUNG_S24,
      DeviceType.SAMSUNG_FOLD,
      DeviceType.SAMSUNG_S23,
    ]
  },
  {
    name: 'Pixel',
    devices: [
      DeviceType.PIXEL_9_PRO,
      DeviceType.PIXEL_9,
      DeviceType.PIXEL_8_PRO,
    ]
  },
]

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
  gifProgress,
  selectedDeviceIndex,
  setSelectedDeviceIndex
}) => {
  const [activeTab, setActiveTab] = useState<'design' | 'export'>('design')
  const [showAllTemplates, setShowAllTemplates] = useState(false)
  const currentDevice = config.devices[selectedDeviceIndex] || config.devices[0]

  const updateCurrentDevice = (updates: Partial<DeviceConfig>) => {
    const newDevices = [...config.devices]
    if (newDevices[selectedDeviceIndex]) {
      newDevices[selectedDeviceIndex] = { ...newDevices[selectedDeviceIndex], ...updates }
      onChange({ ...config, devices: newDevices })
    }
  }

  const handleAddDevice = () => {
    const newDevice: DeviceConfig = {
      id: `dev_${Date.now()}`,
      type: currentDevice?.type || DeviceType.IPHONE_16_PRO,
      image: null,
      x: 50,
      y: 0,
      rotation: 0,
      rotateX: 0,
      rotateY: 0,
      scale: 0.7,
      shadow: { enabled: true, color: '#000000', blur: 40, opacity: 0.4, offsetY: 20 },
      zIndex: config.devices.length + 1
    }
    const newDevices = [...config.devices, newDevice]
    onChange({ ...config, devices: newDevices })
    setSelectedDeviceIndex(newDevices.length - 1)
  }

  const handleRemoveDevice = () => {
    if (config.devices.length <= 1) return
    const newDevices = config.devices.filter((_, i) => i !== selectedDeviceIndex)
    onChange({ ...config, devices: newDevices })
    setSelectedDeviceIndex(Math.max(0, selectedDeviceIndex - 1))
  }

  const applyTemplate = (templateConfig: Partial<ScreenConfig>) => {
    onChange({
      ...config,
      ...templateConfig,
      devices: templateConfig.devices || config.devices,
    } as ScreenConfig)
    setSelectedDeviceIndex(0)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        updateCurrentDevice({ image: event.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBgChange = (key: keyof typeof config.background, value: any) => {
    onChange({
      ...config,
      background: { ...config.background, [key]: value }
    })
  }

  return (
    <div className="w-[300px] flex flex-col bg-zinc-900 border-l border-zinc-800 h-full shrink-0">
      {/* Header with Tabs */}
      <div className="border-b border-zinc-800 shrink-0">
        <div className="flex">
          <button
            onClick={() => setActiveTab('design')}
            className={cn(
              "flex-1 py-3 text-xs font-medium transition-colors border-b-2",
              activeTab === 'design'
                ? "text-white border-indigo-500 bg-zinc-800/50"
                : "text-zinc-500 border-transparent hover:text-zinc-300"
            )}
          >
            Design
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={cn(
              "flex-1 py-3 text-xs font-medium transition-colors border-b-2",
              activeTab === 'export'
                ? "text-white border-indigo-500 bg-zinc-800/50"
                : "text-zinc-500 border-transparent hover:text-zinc-300"
            )}
          >
            Export
          </button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        {activeTab === 'design' ? (
          <div className="divide-y divide-zinc-800">
            {/* Templates Section */}
            <Section title="Templates" icon={<Grid size={14} />} defaultOpen={false}>
              <div className="grid grid-cols-2 gap-1.5">
                {(showAllTemplates ? TEMPLATES : TEMPLATES.slice(0, 10)).map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => applyTemplate(t.config)}
                    className="p-2 rounded border border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700 hover:border-zinc-600 transition-all text-left"
                  >
                    <div className="text-[11px] font-medium text-zinc-200 truncate">{t.name}</div>
                    <div className="text-[9px] text-zinc-500 truncate">{t.description}</div>
                  </button>
                ))}
              </div>
              {TEMPLATES.length > 10 && (
                <button
                  onClick={() => setShowAllTemplates(!showAllTemplates)}
                  className="w-full text-[10px] text-indigo-400 hover:text-indigo-300 py-2 transition-colors"
                >
                  {showAllTemplates ? 'Show less' : `Show all ${TEMPLATES.length} templates`}
                </button>
              )}
            </Section>

            {/* Devices Section */}
            <Section title="Devices" icon={<Smartphone size={14} />} badge={`${config.devices.length}`}>
              {/* Device Selector */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1 flex-1 overflow-x-auto">
                  {config.devices.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedDeviceIndex(i)}
                      className={cn(
                        "px-3 py-1.5 rounded text-[11px] font-medium transition-all shrink-0",
                        selectedDeviceIndex === i
                          ? "bg-indigo-600 text-white"
                          : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleAddDevice}
                  className="p-1.5 rounded bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
                >
                  <Plus size={14} />
                </button>
                {config.devices.length > 1 && (
                  <button
                    onClick={handleRemoveDevice}
                    className="p-1.5 rounded bg-zinc-800 text-zinc-400 hover:bg-red-900/50 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              {/* Screenshot Upload */}
              <div className="space-y-2">
                <Label className="text-[11px] text-zinc-400">Screenshot</Label>
                <div className="border border-dashed border-zinc-700 rounded-lg p-3 text-center hover:border-zinc-500 transition-colors relative overflow-hidden min-h-[60px]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  {currentDevice?.image ? (
                    <div className="absolute inset-0 w-full h-full">
                      <img src={currentDevice.image} className="w-full h-full object-contain opacity-50" alt="preview" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <span className="text-[10px] text-white">Click to replace</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-zinc-500">
                      <Upload size={18} />
                      <span className="text-[10px]">Upload Screenshot</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Device Model Select */}
              <div className="space-y-2">
                <Label className="text-[11px] text-zinc-400">Model</Label>
                <Select
                  value={currentDevice?.type}
                  onValueChange={(val) => updateCurrentDevice({ type: val as DeviceType })}
                >
                  <SelectTrigger className="h-8 text-xs bg-zinc-800 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEVICE_GROUPS.map((group) => (
                      <React.Fragment key={group.name}>
                        <div className="px-2 py-1.5 text-[10px] text-zinc-500 font-medium">{group.name}</div>
                        {group.devices.map((device) => (
                          <SelectItem key={device} value={device} className="text-xs">
                            {device}
                          </SelectItem>
                        ))}
                      </React.Fragment>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Position Controls */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <Label className="text-[10px] text-zinc-500">X Position</Label>
                    <span className="text-[10px] text-zinc-600">{currentDevice?.x || 0}</span>
                  </div>
                  <Slider
                    value={[currentDevice?.x || 0]}
                    onValueChange={([val]) => updateCurrentDevice({ x: val })}
                    min={-500}
                    max={500}
                    step={5}
                    className="h-1"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <Label className="text-[10px] text-zinc-500">Y Position</Label>
                    <span className="text-[10px] text-zinc-600">{currentDevice?.y || 0}</span>
                  </div>
                  <Slider
                    value={[currentDevice?.y || 0]}
                    onValueChange={([val]) => updateCurrentDevice({ y: val })}
                    min={-500}
                    max={500}
                    step={5}
                    className="h-1"
                  />
                </div>
              </div>

              {/* Scale & Rotation */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <Label className="text-[10px] text-zinc-500">Scale</Label>
                    <span className="text-[10px] text-zinc-600">{((currentDevice?.scale || 1) * 100).toFixed(0)}%</span>
                  </div>
                  <Slider
                    value={[currentDevice?.scale || 1]}
                    onValueChange={([val]) => updateCurrentDevice({ scale: val })}
                    min={0.3}
                    max={1.5}
                    step={0.05}
                    className="h-1"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <Label className="text-[10px] text-zinc-500">Rotation</Label>
                    <span className="text-[10px] text-zinc-600">{currentDevice?.rotation || 0}°</span>
                  </div>
                  <Slider
                    value={[currentDevice?.rotation || 0]}
                    onValueChange={([val]) => updateCurrentDevice({ rotation: val })}
                    min={-45}
                    max={45}
                    step={1}
                    className="h-1"
                  />
                </div>
              </div>

              {/* 3D Rotation */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <Label className="text-[10px] text-zinc-500">Rotate X</Label>
                    <span className="text-[10px] text-zinc-600">{currentDevice?.rotateX || 0}°</span>
                  </div>
                  <Slider
                    value={[currentDevice?.rotateX || 0]}
                    onValueChange={([val]) => updateCurrentDevice({ rotateX: val })}
                    min={-30}
                    max={30}
                    step={1}
                    className="h-1"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <Label className="text-[10px] text-zinc-500">Rotate Y</Label>
                    <span className="text-[10px] text-zinc-600">{currentDevice?.rotateY || 0}°</span>
                  </div>
                  <Slider
                    value={[currentDevice?.rotateY || 0]}
                    onValueChange={([val]) => updateCurrentDevice({ rotateY: val })}
                    min={-30}
                    max={30}
                    step={1}
                    className="h-1"
                  />
                </div>
              </div>

              {/* Z-Index */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <Label className="text-[10px] text-zinc-500">Layer Order</Label>
                  <span className="text-[10px] text-zinc-600">Z: {currentDevice?.zIndex || 1}</span>
                </div>
                <Slider
                  value={[currentDevice?.zIndex || 1]}
                  onValueChange={([val]) => updateCurrentDevice({ zIndex: val })}
                  min={1}
                  max={10}
                  step={1}
                  className="h-1"
                />
              </div>
            </Section>

            {/* Text Section */}
            <Section title="Text" icon={<Type size={14} />}>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-zinc-400">Title</Label>
                  <Textarea
                    value={config.text.title}
                    onChange={(e) => onChange({ ...config, text: { ...config.text, title: e.target.value } }, false)}
                    placeholder="Your App Title"
                    className="min-h-[60px] text-sm bg-zinc-800 border-zinc-700 resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] text-zinc-400">Subtitle</Label>
                  <Input
                    value={config.text.subtitle}
                    onChange={(e) => onChange({ ...config, text: { ...config.text, subtitle: e.target.value } }, false)}
                    placeholder="Describe your feature"
                    className="h-8 text-sm bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] text-zinc-500">Title Color</Label>
                    <ColorPickerInline
                      value={config.text.titleColor}
                      onChange={(val) => onChange({ ...config, text: { ...config.text, titleColor: val } })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] text-zinc-500">Subtitle Color</Label>
                    <ColorPickerInline
                      value={config.text.subtitleColor}
                      onChange={(val) => onChange({ ...config, text: { ...config.text, subtitleColor: val } })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] text-zinc-400">Position</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['top', 'bottom'] as const).map((pos) => (
                      <button
                        key={pos}
                        onClick={() => onChange({ ...config, text: { ...config.text, position: pos } })}
                        className={cn(
                          "py-2 rounded text-[11px] font-medium transition-all capitalize",
                          config.text.position === pos
                            ? "bg-indigo-600 text-white"
                            : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                        )}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] text-zinc-400">Alignment</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['left', 'center', 'right'] as const).map((align) => (
                      <button
                        key={align}
                        onClick={() => onChange({ ...config, text: { ...config.text, alignment: align } })}
                        className={cn(
                          "py-2 rounded text-[11px] font-medium transition-all capitalize",
                          config.text.alignment === align
                            ? "bg-indigo-600 text-white"
                            : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                        )}
                      >
                        {align}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <Label className="text-[10px] text-zinc-500">Title Size</Label>
                      <span className="text-[10px] text-zinc-600">{config.text.titleSize || 80}px</span>
                    </div>
                    <Slider
                      value={[config.text.titleSize || 80]}
                      onValueChange={([val]) => onChange({ ...config, text: { ...config.text, titleSize: val } })}
                      min={40}
                      max={120}
                      step={2}
                      className="h-1"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <Label className="text-[10px] text-zinc-500">Subtitle Size</Label>
                      <span className="text-[10px] text-zinc-600">{config.text.subtitleSize || 48}px</span>
                    </div>
                    <Slider
                      value={[config.text.subtitleSize || 48]}
                      onValueChange={([val]) => onChange({ ...config, text: { ...config.text, subtitleSize: val } })}
                      min={24}
                      max={72}
                      step={2}
                      className="h-1"
                    />
                  </div>
                </div>
              </div>
            </Section>

            {/* Background Section */}
            <Section title="Background" icon={<Palette size={14} />}>
              {/* Quick Presets */}
              {BACKGROUND_PRESETS && BACKGROUND_PRESETS.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-[10px] text-zinc-500">Quick Presets</Label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {BACKGROUND_PRESETS.slice(0, 8).map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => onChange({ ...config, background: preset.config })}
                        className="h-8 rounded border border-zinc-700 hover:border-zinc-500 transition-all overflow-hidden"
                        style={
                          preset.config.type === 'gradient'
                            ? { background: `linear-gradient(${preset.config.direction}, ${preset.config.color1}, ${preset.config.color2})` }
                            : { backgroundColor: preset.config.color1 }
                        }
                        title={preset.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Background Type */}
              <div className="space-y-2">
                <Label className="text-[10px] text-zinc-500">Type</Label>
                <div className="grid grid-cols-5 gap-1">
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
                        const newBg = { ...config.background, type: item.type }
                        if (item.type === 'mesh' && !newBg.mesh) {
                          newBg.mesh = {
                            points: [
                              { id: 'm1', x: 20, y: 20, color: '#4f46e5' },
                              { id: 'm2', x: 80, y: 30, color: '#9333ea' },
                              { id: 'm3', x: 50, y: 80, color: '#ec4899' },
                            ],
                            blur: 60
                          }
                        }
                        if (item.type === 'pattern' && !newBg.pattern) {
                          newBg.pattern = {
                            type: 'dots',
                            color: '#ffffff',
                            backgroundColor: '#1e1b4b',
                            size: 8,
                            spacing: 30,
                            opacity: 0.3
                          }
                        }
                        if (item.type === 'image' && !newBg.image) {
                          newBg.image = {
                            src: null,
                            blur: 0,
                            overlayColor: '#000000',
                            overlayOpacity: 0,
                            fit: 'cover'
                          }
                        }
                        onChange({ ...config, background: newBg })
                      }}
                      className={cn(
                        "flex flex-col items-center gap-0.5 py-2 rounded border text-[9px] transition-all",
                        config.background.type === item.type
                          ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                          : "border-zinc-700 bg-zinc-800/50 text-zinc-500 hover:bg-zinc-800"
                      )}
                    >
                      <item.icon size={12} />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Solid/Gradient Colors */}
              {(config.background.type === 'solid' || config.background.type === 'gradient') && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] text-zinc-500">Primary Color</Label>
                    <ColorPickerInline
                      value={config.background.color1}
                      onChange={(val) => handleBgChange('color1', val)}
                    />
                  </div>
                  {config.background.type === 'gradient' && (
                    <>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] text-zinc-500">Secondary Color</Label>
                        <ColorPickerInline
                          value={config.background.color2}
                          onChange={(val) => handleBgChange('color2', val)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] text-zinc-500">Direction</Label>
                        <Select
                          value={config.background.direction}
                          onValueChange={(val) => handleBgChange('direction', val)}
                        >
                          <SelectTrigger className="h-7 text-xs bg-zinc-800 border-zinc-700">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="to right">Left to Right</SelectItem>
                            <SelectItem value="to bottom">Top to Bottom</SelectItem>
                            <SelectItem value="to bottom right">Diagonal</SelectItem>
                            <SelectItem value="to top right">Diagonal Up</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Mesh Gradient */}
              {config.background.type === 'mesh' && config.background.mesh && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    {config.background.mesh.points.map((point, idx) => (
                      <div key={point.id} className="flex items-center gap-2 p-2 bg-zinc-800 rounded">
                        <input
                          type="color"
                          value={point.color}
                          onChange={(e) => {
                            const newPoints = [...config.background.mesh!.points]
                            newPoints[idx] = { ...newPoints[idx], color: e.target.value }
                            onChange({ ...config, background: { ...config.background, mesh: { ...config.background.mesh!, points: newPoints } } })
                          }}
                          className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                        />
                        <span className="text-[10px] text-zinc-500">Point {idx + 1}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <Label className="text-[10px] text-zinc-500">Blur</Label>
                      <span className="text-[10px] text-zinc-600">{config.background.mesh.blur}px</span>
                    </div>
                    <Slider
                      value={[config.background.mesh.blur]}
                      onValueChange={([val]) => {
                        onChange({ ...config, background: { ...config.background, mesh: { ...config.background.mesh!, blur: val } } })
                      }}
                      min={20}
                      max={100}
                      step={1}
                      className="h-1"
                    />
                  </div>
                </div>
              )}

              {/* Pattern */}
              {config.background.type === 'pattern' && config.background.pattern && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] text-zinc-500">Pattern Type</Label>
                    <div className="grid grid-cols-5 gap-1">
                      {(['dots', 'grid', 'lines', 'diagonal', 'waves'] as PatternType[]).map((pt) => (
                        <button
                          key={pt}
                          onClick={() => {
                            onChange({ ...config, background: { ...config.background, pattern: { ...config.background.pattern!, type: pt } } })
                          }}
                          className={cn(
                            "py-1.5 rounded border text-[9px] capitalize transition-all",
                            config.background.pattern!.type === pt
                              ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                              : "border-zinc-700 bg-zinc-800/50 text-zinc-500"
                          )}
                        >
                          {pt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[10px] text-zinc-500">Pattern</Label>
                      <ColorPickerInline
                        value={config.background.pattern.color}
                        onChange={(val) => {
                          onChange({ ...config, background: { ...config.background, pattern: { ...config.background.pattern!, color: val } } })
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-zinc-500">Background</Label>
                      <ColorPickerInline
                        value={config.background.pattern.backgroundColor}
                        onChange={(val) => {
                          onChange({ ...config, background: { ...config.background, pattern: { ...config.background.pattern!, backgroundColor: val } } })
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Image Background */}
              {config.background.type === 'image' && config.background.image && (
                <div className="space-y-3">
                  <div className="border border-dashed border-zinc-700 rounded-lg p-3 text-center hover:border-zinc-500 transition-colors relative overflow-hidden min-h-[60px]">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = (event) => {
                            onChange({ ...config, background: { ...config.background, image: { ...config.background.image!, src: event.target?.result as string } } })
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    />
                    {config.background.image.src ? (
                      <div className="absolute inset-0 w-full h-full">
                        <img src={config.background.image.src} className="w-full h-full object-cover opacity-50" alt="bg" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <span className="text-[10px] text-white">Click to replace</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-zinc-500">
                        <Upload size={16} />
                        <span className="text-[10px]">Upload Image</span>
                      </div>
                    )}
                  </div>
                  {config.background.image.src && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <Label className="text-[10px] text-zinc-500">Blur</Label>
                        <span className="text-[10px] text-zinc-600">{config.background.image.blur}px</span>
                      </div>
                      <Slider
                        value={[config.background.image.blur]}
                        onValueChange={([val]) => {
                          onChange({ ...config, background: { ...config.background, image: { ...config.background.image!, blur: val } } })
                        }}
                        min={0}
                        max={20}
                        step={1}
                        className="h-1"
                      />
                    </div>
                  )}
                </div>
              )}
            </Section>

            {/* Animation Section */}
            <Section title="Animation" icon={<Film size={14} />} defaultOpen={false}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] text-zinc-400">Enable Animation</Label>
                  <button
                    onClick={() => onAnimationConfigChange({ ...animationConfig, enabled: !animationConfig.enabled })}
                    className={cn(
                      "w-10 h-5 rounded-full transition-colors relative",
                      animationConfig.enabled ? "bg-indigo-600" : "bg-zinc-700"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute w-4 h-4 bg-white rounded-full top-0.5 transition-transform",
                        animationConfig.enabled ? "translate-x-5" : "translate-x-0.5"
                      )}
                    />
                  </button>
                </div>

                {animationConfig.enabled && (
                  <>
                    <div className="flex gap-2">
                      <button
                        onClick={isPlaying ? onPause : onPlay}
                        className="flex-1 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center justify-center gap-1"
                      >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                        {isPlaying ? 'Pause' : 'Play'}
                      </button>
                      <button
                        onClick={onStop}
                        className="px-3 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium"
                      >
                        <Square size={14} />
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <Label className="text-[10px] text-zinc-500">Progress</Label>
                        <span className="text-[10px] text-zinc-600">{(currentTime * 100).toFixed(0)}%</span>
                      </div>
                      <Slider
                        value={[currentTime]}
                        onValueChange={([val]) => onSeek(val)}
                        min={0}
                        max={1}
                        step={0.01}
                        className="h-1"
                      />
                    </div>
                  </>
                )}
              </div>
            </Section>
          </div>
        ) : (
          /* Export Tab */
          <div className="p-4 space-y-4">
            <div className="space-y-3">
              <Label className="text-xs text-zinc-300 font-medium">iOS / App Store</Label>
              <div className="space-y-2">
                {[
                  { id: 'iphone-67', name: 'iPhone 6.7"', size: '1290 × 2796' },
                  { id: 'iphone-65', name: 'iPhone 6.5"', size: '1242 × 2688' },
                  { id: 'iphone-55', name: 'iPhone 5.5"', size: '1242 × 2208' },
                  { id: 'ipad-129', name: 'iPad 12.9"', size: '2048 × 2732' },
                ].map((item) => (
                  <label key={item.id} className="flex items-center gap-3 p-2 rounded bg-zinc-800/50 hover:bg-zinc-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportConfig.selectedSizes.includes(item.id)}
                      onChange={(e) => {
                        const newSizes = e.target.checked
                          ? [...exportConfig.selectedSizes, item.id]
                          : exportConfig.selectedSizes.filter(s => s !== item.id)
                        onExportConfigChange({ ...exportConfig, selectedSizes: newSizes })
                      }}
                      className="rounded border-zinc-600 bg-zinc-700 text-indigo-600"
                    />
                    <div className="flex-1">
                      <div className="text-xs text-zinc-300">{item.name}</div>
                      <div className="text-[10px] text-zinc-500">{item.size}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs text-zinc-300 font-medium">Android / Google Play</Label>
              <div className="space-y-2">
                {[
                  { id: 'android-phone', name: 'Android Phone', size: '1080 × 1920' },
                  { id: 'android-phone-hd', name: 'Android Phone HD', size: '1440 × 3040' },
                ].map((item) => (
                  <label key={item.id} className="flex items-center gap-3 p-2 rounded bg-zinc-800/50 hover:bg-zinc-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportConfig.selectedSizes.includes(item.id)}
                      onChange={(e) => {
                        const newSizes = e.target.checked
                          ? [...exportConfig.selectedSizes, item.id]
                          : exportConfig.selectedSizes.filter(s => s !== item.id)
                        onExportConfigChange({ ...exportConfig, selectedSizes: newSizes })
                      }}
                      className="rounded border-zinc-600 bg-zinc-700 text-indigo-600"
                    />
                    <div className="flex-1">
                      <div className="text-xs text-zinc-300">{item.name}</div>
                      <div className="text-[10px] text-zinc-500">{item.size}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs text-zinc-300 font-medium">Format</Label>
              <div className="grid grid-cols-2 gap-2">
                {(['png', 'jpg'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => onExportConfigChange({ ...exportConfig, format: fmt })}
                    className={cn(
                      "py-2 rounded text-xs font-medium uppercase transition-all",
                      exportConfig.format === fmt
                        ? "bg-indigo-600 text-white"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                    )}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Button
                onClick={onExportSingle}
                disabled={isExporting}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                <Download size={14} className="mr-2" />
                {isExporting ? 'Exporting...' : 'Export Single PNG'}
              </Button>

              {exportConfig.selectedSizes.length > 0 && (
                <Button
                  onClick={onExportMultiple}
                  disabled={isExporting}
                  variant="outline"
                  className="w-full border-zinc-700 hover:bg-zinc-800"
                >
                  {isExporting && exportProgress
                    ? `Exporting ${exportProgress.current}/${exportProgress.total}...`
                    : `Export ${exportConfig.selectedSizes.length} sizes as ZIP`
                  }
                </Button>
              )}

              {animationConfig.enabled && (
                <Button
                  onClick={onExportGif}
                  disabled={isExportingGif}
                  variant="outline"
                  className="w-full border-zinc-700 hover:bg-zinc-800"
                >
                  <Film size={14} className="mr-2" />
                  {isExportingGif
                    ? `Creating GIF... ${gifProgress || 0}%`
                    : 'Export as GIF'
                  }
                </Button>
              )}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

export default Sidebar
