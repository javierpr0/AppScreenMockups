import React from 'react'
import { DeviceConfig } from '../../types'
import { Label } from '../ui/label'
import { Slider } from '../ui/slider'
import { Button } from '../ui/button'
import { Switch } from '../ui/switch'
import { Separator } from '../ui/separator'
import { Move, RotateCw, Box } from 'lucide-react'

interface LayoutTabProps {
  device: DeviceConfig
  onUpdate: (updates: Partial<DeviceConfig>) => void
}

export const LayoutTab: React.FC<LayoutTabProps> = ({ device, onUpdate }) => {
  return (
    <div className="space-y-6">
      {/* Scale */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <Label>Scale</Label>
          <span className="text-xs text-muted-foreground">{Math.round(device.scale * 100)}%</span>
        </div>
        <Slider
          value={[device.scale]}
          onValueChange={([val]) => onUpdate({ scale: val })}
          min={0.4}
          max={1.5}
          step={0.05}
        />
      </div>

      <Separator />

      {/* Position */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="flex items-center gap-2">
            <Move size={14} />
            Position
          </Label>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={() => onUpdate({ x: 0, y: 0, rotation: 0 })}
          >
            Reset
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Horizontal (X)</span>
            <span>{device.x}px</span>
          </div>
          <Slider
            value={[device.x]}
            onValueChange={([val]) => onUpdate({ x: val })}
            min={-600}
            max={600}
            step={1}
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Vertical (Y)</span>
            <span>{device.y}px</span>
          </div>
          <Slider
            value={[device.y]}
            onValueChange={([val]) => onUpdate({ y: val })}
            min={-800}
            max={800}
            step={1}
          />
        </div>
      </div>

      {/* Rotation */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <Label className="flex items-center gap-2">
            <RotateCw size={14} />
            Rotation
          </Label>
          <span className="text-xs text-muted-foreground">{device.rotation}°</span>
        </div>
        <Slider
          value={[device.rotation]}
          onValueChange={([val]) => onUpdate({ rotation: val })}
          min={-45}
          max={45}
          step={1}
        />
      </div>

      <Separator />

      {/* 3D Transform */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="flex items-center gap-2 text-primary">
            <Box size={14} />
            3D Transform
          </Label>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={() => onUpdate({ rotateX: 0, rotateY: 0 })}
          >
            Reset
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Tilt X (Vertical)</span>
            <span>{device.rotateX || 0}°</span>
          </div>
          <Slider
            value={[device.rotateX || 0]}
            onValueChange={([val]) => onUpdate({ rotateX: val })}
            min={-45}
            max={45}
            step={1}
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Tilt Y (Horizontal)</span>
            <span>{device.rotateY || 0}°</span>
          </div>
          <Slider
            value={[device.rotateY || 0]}
            onValueChange={([val]) => onUpdate({ rotateY: val })}
            min={-45}
            max={45}
            step={1}
          />
        </div>
      </div>

      <Separator />

      {/* Shadow */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Shadow</Label>
          <Switch
            checked={device.shadow.enabled}
            onCheckedChange={(checked) =>
              onUpdate({ shadow: { ...device.shadow, enabled: checked } })
            }
          />
        </div>

        {device.shadow.enabled && (
          <div className="space-y-3 pl-2 border-l-2 border-border">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Blur</span>
              <span>{device.shadow.blur}px</span>
            </div>
            <Slider
              value={[device.shadow.blur]}
              onValueChange={([val]) =>
                onUpdate({ shadow: { ...device.shadow, blur: val } })
              }
              min={0}
              max={100}
              step={1}
            />

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Opacity</span>
              <span>{Math.round(device.shadow.opacity * 100)}%</span>
            </div>
            <Slider
              value={[device.shadow.opacity]}
              onValueChange={([val]) =>
                onUpdate({ shadow: { ...device.shadow, opacity: val } })
              }
              min={0}
              max={1}
              step={0.05}
            />
          </div>
        )}
      </div>
    </div>
  )
}
