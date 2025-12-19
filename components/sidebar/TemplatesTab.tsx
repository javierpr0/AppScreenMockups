import React from 'react'
import { ScreenConfig } from '../../types'
import { TEMPLATES } from '../../constants'

interface TemplatesTabProps {
  onApplyTemplate: (config: Partial<ScreenConfig>) => void
}

export const TemplatesTab: React.FC<TemplatesTabProps> = ({ onApplyTemplate }) => {
  return (
    <div className="space-y-4">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Start from Template
      </div>
      <div className="grid grid-cols-2 gap-2">
        {TEMPLATES.map((t, idx) => (
          <button
            key={idx}
            onClick={() => onApplyTemplate(t.config)}
            className="p-3 rounded-lg border border-border bg-card hover:bg-accent hover:border-ring transition-all text-left group"
          >
            <div className="font-medium text-card-foreground text-sm group-hover:text-foreground">
              {t.name}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {t.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
