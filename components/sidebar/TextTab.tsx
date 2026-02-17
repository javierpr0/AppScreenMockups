import React from 'react'
import { TextConfig } from '../../types'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Slider } from '../ui/slider'
import { Switch } from '../ui/switch'
import { Separator } from '../ui/separator'
import { ColorPicker } from '../ui/color-picker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { cn } from '@/lib/utils'

interface TextTabProps {
  text: TextConfig
  onChange: (key: keyof TextConfig, value: any, trackHistory?: boolean) => void
}

const FONT_FAMILIES = [
  'Inter',
  'Arial',
  'Helvetica',
  'Georgia',
  'Times New Roman',
  'Verdana',
]

const FONT_WEIGHTS = [
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semibold' },
  { value: '700', label: 'Bold' },
  { value: '800', label: 'Extra Bold' },
]

export const TextTab: React.FC<TextTabProps> = ({ text, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Content Section */}
      <div className="space-y-4">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Content
        </div>

        <div className="space-y-2">
          <Label>Title</Label>
          <Textarea
            value={text.title}
            onChange={(e) => onChange('title', e.target.value, false)}
            rows={2}
            className="resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label>Subtitle</Label>
          <Textarea
            value={text.subtitle}
            onChange={(e) => onChange('subtitle', e.target.value, false)}
            rows={2}
            className="resize-none"
          />
        </div>
      </div>

      <Separator />

      {/* Typography Section */}
      <div className="space-y-4">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Typography
        </div>

        <div className="space-y-2">
          <Label>Font Family</Label>
          <Select
            value={text.fontFamily}
            onValueChange={(val) => onChange('fontFamily', val)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_FAMILIES.map((font) => (
                <SelectItem key={font} value={font}>
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Title Size</Label>
              <span className="text-xs text-muted-foreground">{text.titleSize || 80}px</span>
            </div>
            <Slider
              value={[text.titleSize || 80]}
              onValueChange={([val]) => onChange('titleSize', val)}
              min={48}
              max={120}
              step={2}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Subtitle Size</Label>
              <span className="text-xs text-muted-foreground">{text.subtitleSize || 48}px</span>
            </div>
            <Slider
              value={[text.subtitleSize || 48]}
              onValueChange={([val]) => onChange('subtitleSize', val)}
              min={24}
              max={72}
              step={2}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">Title Weight</Label>
            <Select
              value={String(text.titleWeight || 700)}
              onValueChange={(val) => onChange('titleWeight', parseInt(val))}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_WEIGHTS.map((w) => (
                  <SelectItem key={w.value} value={w.value}>
                    {w.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Subtitle Weight</Label>
            <Select
              value={String(text.subtitleWeight || 500)}
              onValueChange={(val) => onChange('subtitleWeight', parseInt(val))}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_WEIGHTS.slice(0, 4).map((w) => (
                  <SelectItem key={w.value} value={w.value}>
                    {w.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-xs">Letter Spacing</Label>
            <span className="text-xs text-muted-foreground">{text.letterSpacing || 0}px</span>
          </div>
          <Slider
            value={[text.letterSpacing || 0]}
            onValueChange={([val]) => onChange('letterSpacing', val)}
            min={-2}
            max={8}
            step={0.5}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-xs">Line Height</Label>
            <span className="text-xs text-muted-foreground">{text.lineHeight || 1.2}</span>
          </div>
          <Slider
            value={[text.lineHeight || 1.2]}
            onValueChange={([val]) => onChange('lineHeight', val)}
            min={1}
            max={2}
            step={0.1}
          />
        </div>
      </div>

      <Separator />

      {/* Colors Section */}
      <div className="space-y-4">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Colors
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">Title Color</Label>
            <ColorPicker
              value={text.titleColor}
              onChange={(val) => onChange('titleColor', val)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Subtitle Color</Label>
            <ColorPicker
              value={text.subtitleColor}
              onChange={(val) => onChange('subtitleColor', val)}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Layout Section */}
      <div className="space-y-4">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Layout
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">Alignment</Label>
            <div className="flex rounded-md border border-input overflow-hidden">
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  onClick={() => onChange('alignment', align)}
                  className={cn(
                    "flex-1 py-1.5 text-xs capitalize transition-colors",
                    text.alignment === align
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:bg-accent"
                  )}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Position</Label>
            <div className="flex rounded-md border border-input overflow-hidden">
              {(['top', 'bottom'] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => onChange('position', pos)}
                  className={cn(
                    "flex-1 py-1.5 text-xs capitalize transition-colors",
                    text.position === pos
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:bg-accent"
                  )}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-xs">Max Width</Label>
            <span className="text-xs text-muted-foreground">{text.maxWidth || 100}%</span>
          </div>
          <Slider
            value={[text.maxWidth || 100]}
            onValueChange={([val]) => onChange('maxWidth', val)}
            min={50}
            max={100}
            step={5}
          />
        </div>
      </div>

      <Separator />

      {/* Effects Section */}
      <div className="space-y-4">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Effects
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-xs">Text Shadow</Label>
          <Switch
            checked={text.textShadow || false}
            onCheckedChange={(checked) => onChange('textShadow', checked)}
          />
        </div>

        {text.textShadow && (
          <div className="space-y-3 pl-2 border-l-2 border-border">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Blur</span>
              <span>{text.textShadowBlur || 12}px</span>
            </div>
            <Slider
              value={[text.textShadowBlur || 12]}
              onValueChange={([val]) => onChange('textShadowBlur', val)}
              min={0}
              max={30}
              step={1}
            />

            <div className="space-y-2">
              <Label className="text-xs">Shadow Color</Label>
              <ColorPicker
                value={text.textShadowColor || '#000000'}
                onChange={(val) => onChange('textShadowColor', val)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
