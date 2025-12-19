import React from 'react'
import { DeviceConfig } from '../../types'
import { Button } from '../ui/button'
import { Plus, Trash2, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DeviceSelectorProps {
  devices: DeviceConfig[]
  selectedIndex: number
  onSelect: (index: number) => void
  onAdd: () => void
  onRemove: () => void
}

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  devices,
  selectedIndex,
  onSelect,
  onAdd,
  onRemove
}) => {
  return (
    <div className="p-3 rounded-lg border border-border bg-card/50 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Layers size={14} />
          Devices
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onAdd}
          >
            <Plus size={14} />
          </Button>
          {devices.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:text-destructive"
              onClick={onRemove}
            >
              <Trash2 size={14} />
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {devices.map((_, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={cn(
              "flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium border transition-all",
              selectedIndex === i
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-secondary text-secondary-foreground border-border hover:bg-accent"
            )}
          >
            Device {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
