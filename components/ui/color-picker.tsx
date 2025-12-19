import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Button } from "./button"
import { Input } from "./input"
import { cn } from "@/lib/utils"

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
  presets?: string[]
}

const DEFAULT_PRESETS = [
  "#ffffff", "#f8fafc", "#e2e8f0", "#94a3b8", "#64748b",
  "#0f172a", "#1e293b", "#334155", "#475569", "#000000",
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4",
  "#3b82f6", "#6366f1", "#8b5cf6", "#d946ef", "#ec4899",
]

export function ColorPicker({
  value,
  onChange,
  className,
  presets = DEFAULT_PRESETS
}: ColorPickerProps) {
  const [inputValue, setInputValue] = React.useState(value)

  React.useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    if (/^#[0-9A-Fa-f]{6}$/.test(newValue)) {
      onChange(newValue)
    }
  }

  const handleInputBlur = () => {
    if (!/^#[0-9A-Fa-f]{6}$/.test(inputValue)) {
      setInputValue(value)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start gap-2 font-normal",
            className
          )}
        >
          <div
            className="h-4 w-4 rounded-sm border border-border"
            style={{ backgroundColor: value }}
          />
          <span className="flex-1 text-left text-xs text-muted-foreground uppercase">
            {value}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="start">
        <div className="space-y-3">
          {/* Native color picker */}
          <div className="flex gap-2">
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="h-10 w-10 cursor-pointer rounded border-0 bg-transparent p-0"
            />
            <Input
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className="h-10 flex-1 font-mono text-xs uppercase"
              placeholder="#000000"
            />
          </div>

          {/* Presets grid */}
          <div className="grid grid-cols-10 gap-1">
            {presets.map((preset) => (
              <button
                key={preset}
                onClick={() => onChange(preset)}
                className={cn(
                  "h-5 w-5 rounded-sm border transition-transform hover:scale-110",
                  value === preset ? "ring-2 ring-ring ring-offset-1" : "border-border"
                )}
                style={{ backgroundColor: preset }}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Simple inline version for compact spaces
export function ColorPickerInline({
  value,
  onChange,
  className
}: Omit<ColorPickerProps, 'presets'>) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-8 cursor-pointer rounded border border-border bg-transparent p-0"
      />
      <span className="text-xs text-muted-foreground uppercase font-mono">
        {value}
      </span>
    </div>
  )
}
