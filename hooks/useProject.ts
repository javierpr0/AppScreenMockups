import { useEffect, useCallback } from 'react';
import { Project, Screen, ScreenConfig } from '../types';
import {
  storageService,
  createNewProject,
  createNewScreen,
  duplicateScreen,
} from '../services/storageService';
import { useHistory } from './useHistory';

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
  updateActiveConfig: (config: ScreenConfig, trackHistory?: boolean) => void;
  updateScreenThumbnail: (screenId: string, thumbnail: string) => void;

  // Project actions
  renameProject: (name: string) => void;
  resetProject: () => void;

  // History actions
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const useProject = (): UseProjectReturn => {
  const initialProject = (() => {
    const loaded = storageService.load();
    return loaded || createNewProject();
  })();

  const { state: project, set, setWithHistory, undo, redo, canUndo, canRedo, reset } = useHistory(
    initialProject,
    { maxHistory: 50, debounceMs: 1000 }
  );

  // Auto-save on project changes (not on undo/redo)
  useEffect(() => {
    storageService.save(project);
  }, [project]);

  // Get active screen
  const activeScreen = project.screens.find(s => s.id === project.activeScreenId)
    || project.screens[0];

  const activeConfig = activeScreen.config;

  // Add new screen
  const addScreen = useCallback(() => {
    setWithHistory(prev => {
      const newScreen = createNewScreen(prev.screens.length);
      return {
        ...prev,
        screens: [...prev.screens, newScreen],
        activeScreenId: newScreen.id,
        updatedAt: Date.now(),
      };
    });
  }, [setWithHistory]);

  // Duplicate active screen
  const duplicateActiveScreen = useCallback(() => {
    setWithHistory(prev => {
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
  }, [setWithHistory]);

  // Delete screen
  const deleteScreen = useCallback((screenId: string) => {
    setWithHistory(prev => {
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
  }, [setWithHistory]);

  // Select screen
  const selectScreen = useCallback((screenId: string) => {
    set(prev => {
      if (prev.activeScreenId === screenId) return prev;
      const exists = prev.screens.some(s => s.id === screenId);
      if (!exists) return prev;

      return {
        ...prev,
        activeScreenId: screenId,
        updatedAt: Date.now(),
      };
    });
  }, [set]);

  // Rename screen
  const renameScreen = useCallback((screenId: string, name: string) => {
    set(prev => ({
      ...prev,
      screens: prev.screens.map(s =>
        s.id === screenId
          ? { ...s, name: name.trim() || s.name, updatedAt: Date.now() }
          : s
      ),
      updatedAt: Date.now(),
    }));
  }, [set]);

  // Reorder screens (for future drag & drop)
  const reorderScreens = useCallback((fromIndex: number, toIndex: number) => {
    setWithHistory(prev => {
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
  }, [setWithHistory]);

  // Update active screen config
  const updateActiveConfig = useCallback((config: ScreenConfig, trackHistory: boolean = true) => {
    const updateFn = trackHistory ? setWithHistory : set;
    updateFn(prev => ({
      ...prev,
      screens: prev.screens.map(s =>
        s.id === prev.activeScreenId
          ? { ...s, config, updatedAt: Date.now() }
          : s
      ),
      updatedAt: Date.now(),
    }));
  }, [set, setWithHistory]);

  // Update screen thumbnail
  const updateScreenThumbnail = useCallback((screenId: string, thumbnail: string) => {
    set(prev => ({
      ...prev,
      screens: prev.screens.map(s =>
        s.id === screenId
          ? { ...s, thumbnail, updatedAt: Date.now() }
          : s
      ),
    }));
  }, [set]);

  // Rename project
  const renameProject = useCallback((name: string) => {
    set(prev => ({
      ...prev,
      name: name.trim() || prev.name,
      updatedAt: Date.now(),
    }));
  }, [set]);

  // Reset project (new blank project)
  const resetProject = useCallback(() => {
    const newProject = createNewProject();
    reset(newProject);
    storageService.saveNow(newProject);
  }, [reset]);

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
    undo,
    redo,
    canUndo,
    canRedo,
  };
};

export default useProject;
