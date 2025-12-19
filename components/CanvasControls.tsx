import React from 'react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { cn } from '@/lib/utils';

interface CanvasControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onFitToView: () => void;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFitToView,
}) => {
  const zoomPercentage = Math.round(zoom * 100);

  return (
    <div className="absolute bottom-4 right-4 z-50 flex items-center gap-1 bg-zinc-900/90 backdrop-blur border border-zinc-700 rounded-lg p-1 shadow-lg">
      <TooltipProvider>
        {/* Fit to View */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onFitToView}
              className="h-7 w-7 p-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
              </svg>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Fit to view</p>
          </TooltipContent>
        </Tooltip>

        {/* Divider */}
        <div className="w-px h-5 bg-zinc-700 mx-1" />

        {/* Zoom Out */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onZoomOut}
              className="h-7 w-7 p-0"
              disabled={zoom <= 0.1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
                <path d="M8 11h6" />
              </svg>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Zoom out</p>
          </TooltipContent>
        </Tooltip>

        {/* Zoom Percentage / Reset */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetZoom}
              className={cn(
                "h-7 px-2 min-w-[50px] text-xs font-mono",
                zoom !== 1 && "text-indigo-400"
              )}
            >
              {zoomPercentage}%
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Reset to 100%</p>
          </TooltipContent>
        </Tooltip>

        {/* Zoom In */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onZoomIn}
              className="h-7 w-7 p-0"
              disabled={zoom >= 3}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
                <path d="M11 8v6" />
                <path d="M8 11h6" />
              </svg>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Zoom in</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default CanvasControls;
