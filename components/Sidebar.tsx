import React, { useState } from 'react'
import { ScreenConfig, DeviceConfig, ExportConfig, AnimationConfig, GifExportConfig } from '../types'
import { TEMPLATES } from '../constants'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import {
  MonitorSmartphone, Type, Palette, Layout, Grid, Film, Package,
  Plus, Trash2, Layers, Upload
} from 'lucide-react'
import { DeviceSelector } from './sidebar/DeviceSelector'
import { DeviceTab } from './sidebar/DeviceTab'
import { LayoutTab } from './sidebar/LayoutTab'
import { TextTab } from './sidebar/TextTab'
import { TemplatesTab } from './sidebar/TemplatesTab'
import ExportPanel from './ExportPanel'
import AnimationPanel from './animation/AnimationPanel'
import { ExportProgress } from '../services/exportService'

interface SidebarProps {
  config: ScreenConfig
  onChange: (newConfig: ScreenConfig) => void
  exportConfig: ExportConfig
  onExportConfigChange: (config: ExportConfig) => void
  onExportSingle: () => void
  onExportMultiple: () => void
  isExporting: boolean
  exportProgress: ExportProgress | null
  // Animation props
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
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState(0)
  const currentDevice = config.devices[selectedDeviceIndex] || config.devices[0]

  const updateCurrentDevice = (updates: Partial<DeviceConfig>) => {
    const newDevices = [...config.devices]
    if (newDevices[selectedDeviceIndex]) {
      newDevices[selectedDeviceIndex] = { ...newDevices[selectedDeviceIndex], ...updates }
      onChange({ ...config, devices: newDevices })
    }
  }

  const handleTextChange = (key: keyof typeof config.text, value: any) => {
    onChange({
      ...config,
      text: { ...config.text, [key]: value }
    })
  }

  const handleAddDevice = () => {
    const newDevice: DeviceConfig = {
      id: `dev_${Date.now()}`,
      type: config.devices[0]?.type || 'iPhone 15 Pro' as any,
      image: null,
      x: 0,
      y: 0,
      rotation: 0,
      rotateX: 0,
      rotateY: 0,
      scale: 0.8,
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
    setSelectedDeviceIndex(0)
  }

  const applyTemplate = (templateConfig: Partial<ScreenConfig>) => {
    onChange({
      ...config,
      ...templateConfig,
      devices: templateConfig.devices || config.devices,
    } as ScreenConfig)
    setSelectedDeviceIndex(0)
  }

  return (
    <div className="w-[320px] flex flex-col bg-background border-l border-border h-full shrink-0">
      {/* Header */}
      <div className="px-3 py-2 border-b border-border shrink-0">
        <h1 className="font-semibold text-sm text-foreground">AppScreen Gen</h1>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="device" className="flex-1 flex flex-col min-h-0">
        <div className="px-2 pt-2 border-b border-border">
          <TabsList className="w-full grid grid-cols-7 h-8">
            <TabsTrigger value="templates" className="text-[10px] gap-0.5 px-0.5">
              <Grid size={12} />
              Tmpl
            </TabsTrigger>
            <TabsTrigger value="device" className="text-[10px] gap-0.5 px-0.5">
              <MonitorSmartphone size={12} />
              Dev
            </TabsTrigger>
            <TabsTrigger value="layout" className="text-[10px] gap-0.5 px-0.5">
              <Layout size={12} />
              Pos
            </TabsTrigger>
            <TabsTrigger value="text" className="text-[10px] gap-0.5 px-0.5">
              <Type size={12} />
              Text
            </TabsTrigger>
            <TabsTrigger value="style" className="text-[10px] gap-0.5 px-0.5">
              <Palette size={12} />
              Style
            </TabsTrigger>
            <TabsTrigger value="anim" className="text-[10px] gap-0.5 px-0.5">
              <Film size={12} />
              Anim
            </TabsTrigger>
            <TabsTrigger value="export" className="text-[10px] gap-0.5 px-0.5">
              <Package size={12} />
              Export
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-3">
            {/* Templates Tab */}
            <TabsContent value="templates" className="mt-0 space-y-4">
              <TemplatesTab onApplyTemplate={applyTemplate} />
            </TabsContent>

            {/* Device Tab */}
            <TabsContent value="device" className="mt-0 space-y-4">
              <DeviceSelector
                devices={config.devices}
                selectedIndex={selectedDeviceIndex}
                onSelect={setSelectedDeviceIndex}
                onAdd={handleAddDevice}
                onRemove={handleRemoveDevice}
              />
              {currentDevice && (
                <DeviceTab device={currentDevice} onUpdate={updateCurrentDevice} />
              )}
            </TabsContent>

            {/* Layout Tab */}
            <TabsContent value="layout" className="mt-0 space-y-4">
              <DeviceSelector
                devices={config.devices}
                selectedIndex={selectedDeviceIndex}
                onSelect={setSelectedDeviceIndex}
                onAdd={handleAddDevice}
                onRemove={handleRemoveDevice}
              />
              {currentDevice && (
                <LayoutTab device={currentDevice} onUpdate={updateCurrentDevice} />
              )}
            </TabsContent>

            {/* Text Tab */}
            <TabsContent value="text" className="mt-0">
              <TextTab text={config.text} onChange={handleTextChange} />
            </TabsContent>

            {/* Style Tab - Keep original for now, can be refactored later */}
            <TabsContent value="style" className="mt-0">
              <StyleTabContent config={config} onChange={onChange} />
            </TabsContent>

            {/* Animation Tab */}
            <TabsContent value="anim" className="mt-0">
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
            </TabsContent>

            {/* Export Tab */}
            <TabsContent value="export" className="mt-0">
              <ExportPanel
                exportConfig={exportConfig}
                onExportConfigChange={onExportConfigChange}
                onExportSingle={onExportSingle}
                onExportMultiple={onExportMultiple}
                isExporting={isExporting}
                exportProgress={exportProgress}
              />
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  )
}

// Simplified Style Tab Content (keeping existing logic inline for now)
import { BackgroundType, PatternType, MeshPoint } from '../types'
import { BACKGROUND_PRESETS } from '../constants'
import { Circle, Box, Hash, Image } from 'lucide-react'
import { Label } from './ui/label'
import { Slider } from './ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { ColorPickerInline } from './ui/color-picker'
import { cn } from '@/lib/utils'

const StyleTabContent: React.FC<{ config: ScreenConfig; onChange: (c: ScreenConfig) => void }> = ({
  config,
  onChange
}) => {
  const handleBgChange = (key: keyof typeof config.background, value: any) => {
    onChange({
      ...config,
      background: { ...config.background, [key]: value }
    })
  }

  return (
    <div className="space-y-6">
      {/* Background Presets */}
      {BACKGROUND_PRESETS && BACKGROUND_PRESETS.length > 0 && (
        <div className="space-y-3">
          <Label className="text-xs">Quick Presets</Label>
          <div className="grid grid-cols-3 gap-2">
            {BACKGROUND_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => onChange({ ...config, background: preset.config })}
                className="h-12 rounded-md border border-border hover:border-ring transition-all overflow-hidden relative group"
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
        <Label className="text-xs">Background Type</Label>
        <div className="grid grid-cols-5 gap-1.5">
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
                "flex flex-col items-center gap-1 py-2 rounded-md border text-[10px] transition-all",
                config.background.type === item.type
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-accent"
              )}
            >
              <item.icon size={14} />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Solid/Gradient Colors */}
      {(config.background.type === 'solid' || config.background.type === 'gradient') && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Primary Color</Label>
            <ColorPickerInline
              value={config.background.color1}
              onChange={(val) => handleBgChange('color1', val)}
            />
          </div>

          {config.background.type === 'gradient' && (
            <>
              <div className="space-y-2">
                <Label className="text-xs">Secondary Color</Label>
                <ColorPickerInline
                  value={config.background.color2}
                  onChange={(val) => handleBgChange('color2', val)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Direction</Label>
                <Select
                  value={config.background.direction}
                  onValueChange={(val) => handleBgChange('direction', val)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="to right">Left to Right</SelectItem>
                    <SelectItem value="to bottom">Top to Bottom</SelectItem>
                    <SelectItem value="to bottom right">Diagonal</SelectItem>
                    <SelectItem value="to top right">Diagonal Reverse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      )}

      {/* Mesh Gradient - Simplified */}
      {config.background.type === 'mesh' && config.background.mesh && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Mesh Points</Label>
            <div className="space-y-2">
              {config.background.mesh.points.map((point, idx) => (
                <div key={point.id} className="flex items-center gap-2 p-2 bg-card rounded border border-border">
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
                  <span className="text-xs text-muted-foreground flex-1">Point {idx + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Blur</Label>
              <span className="text-xs text-muted-foreground">{config.background.mesh.blur}px</span>
            </div>
            <Slider
              value={[config.background.mesh.blur]}
              onValueChange={([val]) => {
                onChange({ ...config, background: { ...config.background, mesh: { ...config.background.mesh!, blur: val } } })
              }}
              min={20}
              max={100}
              step={1}
            />
          </div>
        </div>
      )}

      {/* Pattern Settings - Simplified */}
      {config.background.type === 'pattern' && config.background.pattern && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Pattern Type</Label>
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
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground"
                  )}
                >
                  {pt}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-[10px]">Pattern</Label>
              <ColorPickerInline
                value={config.background.pattern.color}
                onChange={(val) => {
                  onChange({ ...config, background: { ...config.background, pattern: { ...config.background.pattern!, color: val } } })
                }}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px]">Background</Label>
              <ColorPickerInline
                value={config.background.pattern.backgroundColor}
                onChange={(val) => {
                  onChange({ ...config, background: { ...config.background, pattern: { ...config.background.pattern!, backgroundColor: val } } })
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Opacity</Label>
              <span className="text-xs text-muted-foreground">{Math.round(config.background.pattern.opacity * 100)}%</span>
            </div>
            <Slider
              value={[config.background.pattern.opacity]}
              onValueChange={([val]) => {
                onChange({ ...config, background: { ...config.background, pattern: { ...config.background.pattern!, opacity: val } } })
              }}
              min={0.1}
              max={1}
              step={0.05}
            />
          </div>
        </div>
      )}

      {/* Image Background - Simplified */}
      {config.background.type === 'image' && config.background.image && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Background Image</Label>
            <div className="border-2 border-dashed border-border rounded-md p-4 text-center hover:border-ring transition-colors relative overflow-hidden min-h-[80px]">
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
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="text-xs text-white">Click to replace</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <Upload size={20} />
                  <span className="text-xs">Upload Image</span>
                </div>
              )}
            </div>
          </div>

          {config.background.image.src && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-xs">Blur</Label>
                <span className="text-xs text-muted-foreground">{config.background.image.blur}px</span>
              </div>
              <Slider
                value={[config.background.image.blur]}
                onValueChange={([val]) => {
                  onChange({ ...config, background: { ...config.background, image: { ...config.background.image!, blur: val } } })
                }}
                min={0}
                max={20}
                step={1}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Sidebar
