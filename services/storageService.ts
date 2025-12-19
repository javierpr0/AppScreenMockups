import { Project, Screen, ScreenConfig } from '../types';
import { DEFAULT_SCREEN_CONFIG } from '../constants';

const STORAGE_KEY = 'mockups_project';
const DEBOUNCE_MS = 1000;

// Helper to generate unique IDs
export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Create a new screen with default config
export const createNewScreen = (order: number, name?: string): Screen => {
  const id = generateId();
  const now = Date.now();

  return {
    id,
    name: name || `Screen ${order + 1}`,
    order,
    config: {
      ...DEFAULT_SCREEN_CONFIG,
      id,
      devices: DEFAULT_SCREEN_CONFIG.devices.map(d => ({
        ...d,
        id: `${id}_dev_${generateId()}`,
      })),
    },
    createdAt: now,
    updatedAt: now,
  };
};

// Create a new project with one default screen
export const createNewProject = (name?: string): Project => {
  const id = generateId();
  const now = Date.now();
  const firstScreen = createNewScreen(0);

  return {
    id,
    name: name || 'My Project',
    screens: [firstScreen],
    activeScreenId: firstScreen.id,
    createdAt: now,
    updatedAt: now,
  };
};

// Duplicate a screen
export const duplicateScreen = (screen: Screen, newOrder: number): Screen => {
  const id = generateId();
  const now = Date.now();

  return {
    ...screen,
    id,
    name: `${screen.name} (copy)`,
    order: newOrder,
    config: {
      ...screen.config,
      id,
      devices: screen.config.devices.map(d => ({
        ...d,
        id: `${id}_dev_${generateId()}`,
      })),
    },
    thumbnail: screen.thumbnail,
    createdAt: now,
    updatedAt: now,
  };
};

class StorageService {
  private saveTimeout: ReturnType<typeof setTimeout> | null = null;

  // Load project from localStorage
  load(): Project | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;

      const project = JSON.parse(data) as Project;

      // Validate project structure
      if (!project.id || !project.screens || !Array.isArray(project.screens)) {
        console.warn('Invalid project structure, creating new project');
        return null;
      }

      // Ensure at least one screen exists
      if (project.screens.length === 0) {
        project.screens = [createNewScreen(0)];
        project.activeScreenId = project.screens[0].id;
      }

      // Validate activeScreenId
      const activeExists = project.screens.some(s => s.id === project.activeScreenId);
      if (!activeExists) {
        project.activeScreenId = project.screens[0].id;
      }

      return project;
    } catch (error) {
      console.error('Failed to load project from storage:', error);
      return null;
    }
  }

  // Save project to localStorage with debounce
  save(project: Project): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    this.saveTimeout = setTimeout(() => {
      try {
        const data = JSON.stringify(project);
        localStorage.setItem(STORAGE_KEY, data);
      } catch (error) {
        console.error('Failed to save project to storage:', error);
      }
    }, DEBOUNCE_MS);
  }

  // Force save immediately (for critical operations)
  saveNow(project: Project): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }

    try {
      const data = JSON.stringify(project);
      localStorage.setItem(STORAGE_KEY, data);
    } catch (error) {
      console.error('Failed to save project to storage:', error);
    }
  }

  // Clear storage
  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
}

export const storageService = new StorageService();
