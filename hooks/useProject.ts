import { useState, useEffect, useCallback, useRef } from 'react';
import { Project, Screen, ScreenConfig } from '../types';
import {
  storageService,
  createNewProject,
  createNewScreen,
  duplicateScreen,
  generateId,
} from '../services/storageService';

interface UseProjectReturn {
  project: Project;
  activeScreen: Screen;
  activeConfig: ScreenConfig;

  // Screen actions
  addScreen: () => void;
  duplicateActiveScreen: () => void;
  deleteScreen: (screenId: string) => void;
  selectScreen: (screenId: string) => void;
  renameScreen: (screenId: string, name: string) => void;
  reorderScreens: (fromIndex: number, toIndex: number) => void;

  // Config actions
  updateActiveConfig: (config: ScreenConfig) => void;
  updateScreenThumbnail: (screenId: string, thumbnail: string) => void;

  // Project actions
  renameProject: (name: string) => void;
  resetProject: () => void;
}

export const useProject = (): UseProjectReturn => {
  const [project, setProject] = useState<Project>(() => {
    const loaded = storageService.load();
    return loaded || createNewProject();
  });

  const isInitialMount = useRef(true);

  // Auto-save on project changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    storageService.save(project);
  }, [project]);

  // Get active screen
  const activeScreen = project.screens.find(s => s.id === project.activeScreenId)
    || project.screens[0];

  const activeConfig = activeScreen.config;

  // Add new screen
  const addScreen = useCallback(() => {
    setProject(prev => {
      const newScreen = createNewScreen(prev.screens.length);
      return {
        ...prev,
        screens: [...prev.screens, newScreen],
        activeScreenId: newScreen.id,
        updatedAt: Date.now(),
      };
    });
  }, []);

  // Duplicate active screen
  const duplicateActiveScreen = useCallback(() => {
    setProject(prev => {
      const currentScreen = prev.screens.find(s => s.id === prev.activeScreenId);
      if (!currentScreen) return prev;

      const newScreen = duplicateScreen(currentScreen, prev.screens.length);
      return {
        ...prev,
        screens: [...prev.screens, newScreen],
        activeScreenId: newScreen.id,
        updatedAt: Date.now(),
      };
    });
  }, []);

  // Delete screen
  const deleteScreen = useCallback((screenId: string) => {
    setProject(prev => {
      // Don't delete if only one screen
      if (prev.screens.length <= 1) return prev;

      const screenIndex = prev.screens.findIndex(s => s.id === screenId);
      if (screenIndex === -1) return prev;

      const newScreens = prev.screens.filter(s => s.id !== screenId);

      // If deleting active screen, select another
      let newActiveId = prev.activeScreenId;
      if (prev.activeScreenId === screenId) {
        // Select previous screen, or first if deleting first
        const newIndex = Math.max(0, screenIndex - 1);
        newActiveId = newScreens[newIndex].id;
      }

      // Reorder remaining screens
      const reorderedScreens = newScreens.map((s, i) => ({
        ...s,
        order: i,
      }));

      return {
        ...prev,
        screens: reorderedScreens,
        activeScreenId: newActiveId,
        updatedAt: Date.now(),
      };
    });
  }, []);

  // Select screen
  const selectScreen = useCallback((screenId: string) => {
    setProject(prev => {
      if (prev.activeScreenId === screenId) return prev;
      const exists = prev.screens.some(s => s.id === screenId);
      if (!exists) return prev;

      return {
        ...prev,
        activeScreenId: screenId,
        updatedAt: Date.now(),
      };
    });
  }, []);

  // Rename screen
  const renameScreen = useCallback((screenId: string, name: string) => {
    setProject(prev => ({
      ...prev,
      screens: prev.screens.map(s =>
        s.id === screenId
          ? { ...s, name: name.trim() || s.name, updatedAt: Date.now() }
          : s
      ),
      updatedAt: Date.now(),
    }));
  }, []);

  // Reorder screens (for future drag & drop)
  const reorderScreens = useCallback((fromIndex: number, toIndex: number) => {
    setProject(prev => {
      const screens = [...prev.screens];
      const [moved] = screens.splice(fromIndex, 1);
      screens.splice(toIndex, 0, moved);

      const reorderedScreens = screens.map((s, i) => ({
        ...s,
        order: i,
      }));

      return {
        ...prev,
        screens: reorderedScreens,
        updatedAt: Date.now(),
      };
    });
  }, []);

  // Update active screen config
  const updateActiveConfig = useCallback((config: ScreenConfig) => {
    setProject(prev => ({
      ...prev,
      screens: prev.screens.map(s =>
        s.id === prev.activeScreenId
          ? { ...s, config, updatedAt: Date.now() }
          : s
      ),
      updatedAt: Date.now(),
    }));
  }, []);

  // Update screen thumbnail
  const updateScreenThumbnail = useCallback((screenId: string, thumbnail: string) => {
    setProject(prev => ({
      ...prev,
      screens: prev.screens.map(s =>
        s.id === screenId
          ? { ...s, thumbnail, updatedAt: Date.now() }
          : s
      ),
    }));
  }, []);

  // Rename project
  const renameProject = useCallback((name: string) => {
    setProject(prev => ({
      ...prev,
      name: name.trim() || prev.name,
      updatedAt: Date.now(),
    }));
  }, []);

  // Reset project (new blank project)
  const resetProject = useCallback(() => {
    const newProject = createNewProject();
    setProject(newProject);
    storageService.saveNow(newProject);
  }, []);

  return {
    project,
    activeScreen,
    activeConfig,
    addScreen,
    duplicateActiveScreen,
    deleteScreen,
    selectScreen,
    renameScreen,
    reorderScreens,
    updateActiveConfig,
    updateScreenThumbnail,
    renameProject,
    resetProject,
  };
};
