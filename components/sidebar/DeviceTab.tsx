import React from 'react'
import { DeviceConfig, DeviceType } from '../../types'
import { Label } from '../ui/label'
import { Slider } from '../ui/slider'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DeviceTabProps {
  device: DeviceConfig
  onUpdate: (updates: Partial<DeviceConfig>) => void
}

export const DeviceTab: React.FC<DeviceTabProps> = ({ device, onUpdate }) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        onUpdate({ image: event.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      {/* Image Upload */}
      <div className="space-y-2">
        <Label>Device Screenshot</Label>
        <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-ring hover:bg-accent/50 transition-colors relative overflow-hidden min-h-[100px]">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
          />
          {device.image ? (
            <div className="absolute inset-0 w-full h-full">
              <img
                src={device.image}
                className="w-full h-full object-contain opacity-50"
                alt="preview"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="text-xs text-white">Click to replace</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Upload size={28} />
              <span className="text-sm">Upload Screenshot</span>
            </div>
          )}
        </div>
      </div>

      {/* Device Model */}
      <div className="space-y-2">
        <Label>Device Model</Label>
        <div className="grid grid-cols-2 gap-2">
          {Object.values(DeviceType).map((type) => (
            <button
              key={type}
              onClick={() => onUpdate({ type })}
              className={cn(
                "px-2 py-1.5 rounded-md border text-xs text-left transition-all",
                device.type === type
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-accent"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Layer Order */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <Label>Layer Order</Label>
          <span className="text-xs text-muted-foreground">Z: {device.zIndex}</span>
        </div>
        <Slider
          value={[device.zIndex]}
          onValueChange={([val]) => onUpdate({ zIndex: val })}
          min={1}
          max={10}
          step={1}
        />
      </div>
    </div>
  )
}
