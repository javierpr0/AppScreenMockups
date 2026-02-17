import React, { useState } from 'react';
import { Project, Screen } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { cn } from '@/lib/utils';

interface ScreensPanelProps {
  project: Project;
  activeScreenId: string;
  onSelectScreen: (screenId: string) => void;
  onAddScreen: () => void;
  onDuplicateScreen: () => void;
  onDeleteScreen: (screenId: string) => void;
  onRenameScreen: (screenId: string, name: string) => void;
  onRenameProject: (name: string) => void;
}

interface ScreenThumbnailProps {
  screen: Screen;
  isActive: boolean;
  canDelete: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (name: string) => void;
}

const ScreenThumbnail: React.FC<ScreenThumbnailProps> = ({
  screen,
  isActive,
  canDelete,
  onSelect,
  onDelete,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(screen.name);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditValue(screen.name);
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editValue.trim() && editValue.trim() !== screen.name) {
      onRename(editValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(screen.name);
    }
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col items-center gap-1 cursor-pointer transition-all",
        "hover:opacity-100",
        isActive ? "opacity-100" : "opacity-70"
      )}
      onClick={onSelect}
    >
      {/* Thumbnail with name overlay */}
      <div className="relative">
        <div
          className={cn(
            "relative w-14 h-8 rounded overflow-hidden border transition-all",
            "bg-zinc-800 flex items-center justify-center",
            isActive
              ? "border-indigo-500 ring-1 ring-indigo-500/30 bg-indigo-500/10"
              : "border-zinc-700 hover:border-zinc-500"
          )}
        >
          {screen.thumbnail ? (
            <img
              src={screen.thumbnail}
              alt={screen.name}
              className="w-full h-full object-cover opacity-60"
            />
          ) : null}

          {/* Name overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            {isEditing ? (
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
                className="h-5 w-12 text-[9px] text-center px-0.5 py-0 bg-zinc-900/80"
                autoFocus
              />
            ) : (
              <span
                onDoubleClick={handleDoubleClick}
                className={cn(
                  "text-[9px] font-medium truncate px-1",
                  isActive ? "text-white" : "text-zinc-400"
                )}
                title={screen.name}
              >
                {screen.name.length > 8 ? screen.name.slice(0, 7) + '…' : screen.name}
              </span>
            )}
          </div>
        </div>

        {/* Delete button – outside overflow-hidden container */}
        {canDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className={cn(
              "absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full",
              "bg-red-500 hover:bg-red-600 text-white text-[9px]",
              "flex items-center justify-center leading-none",
              "opacity-0 group-hover:opacity-100 transition-opacity",
              "shadow z-10"
            )}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export const ScreensPanel: React.FC<ScreensPanelProps> = ({
  project,
  activeScreenId,
  onSelectScreen,
  onAddScreen,
  onDuplicateScreen,
  onDeleteScreen,
  onRenameScreen,
  onRenameProject,
}) => {
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [projectName, setProjectName] = useState(project.name);

  const handleProjectNameBlur = () => {
    setIsEditingProject(false);
    if (projectName.trim() && projectName.trim() !== project.name) {
      onRenameProject(projectName.trim());
    }
  };

  const handleProjectNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleProjectNameBlur();
    } else if (e.key === 'Escape') {
      setIsEditingProject(false);
      setProjectName(project.name);
    }
  };

  return (
    <div className="w-full bg-zinc-900/95 backdrop-blur border-b border-zinc-800 px-2 py-1 shrink-0">
      <div className="flex items-center gap-2 h-10">
        {/* Add Screen Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onAddScreen}
                className="h-8 w-8 p-0 shrink-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Add new screen</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Duplicate Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onDuplicateScreen}
                className="h-8 w-8 p-0 shrink-0"
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
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Duplicate active screen</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Divider */}
        <div className="w-px h-8 bg-zinc-700 shrink-0" />

        {/* Screens List */}
        <ScrollArea className="flex-1">
          <div className="flex items-end gap-3 py-1">
            {project.screens.map((screen) => (
              <ScreenThumbnail
                key={screen.id}
                screen={screen}
                isActive={screen.id === activeScreenId}
                canDelete={project.screens.length > 1}
                onSelect={() => onSelectScreen(screen.id)}
                onDelete={() => onDeleteScreen(screen.id)}
                onRename={(name) => onRenameScreen(screen.id, name)}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Project Name */}
        <div className="shrink-0 flex items-center gap-2 border-l border-zinc-700 pl-4">
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
            className="text-zinc-500"
          >
            <path d="M3 3v18h18" />
            <rect x="7" y="9" width="4" height="12" rx="1" />
            <rect x="15" y="5" width="4" height="16" rx="1" />
          </svg>
          {isEditingProject ? (
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onBlur={handleProjectNameBlur}
              onKeyDown={handleProjectNameKeyDown}
              className="h-6 w-32 text-xs"
              autoFocus
            />
          ) : (
            <span
              onDoubleClick={() => {
                setProjectName(project.name);
                setIsEditingProject(true);
              }}
              className="text-xs text-zinc-400 cursor-pointer hover:text-zinc-200 transition-colors"
              title="Double-click to rename project"
            >
              {project.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScreensPanel;
