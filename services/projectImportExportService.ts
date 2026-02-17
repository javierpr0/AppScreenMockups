import { Project, ScreenConfig } from '../types';

export interface ExportedProject {
  version: string;
  exportedAt: string;
  project: Project;
}

const CURRENT_VERSION = '1.0.0';

export class ProjectImportExportService {
  /**
   * Export project as JSON file
   */
  static exportProject(project: Project, filename?: string): void {
    const exportData: ExportedProject = {
      version: CURRENT_VERSION,
      exportedAt: new Date().toISOString(),
      project: {
        ...project,
        // Remove thumbnails to reduce file size
        screens: project.screens.map(screen => ({
          ...screen,
          thumbnail: undefined,
        })),
      },
    };

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `appscreen-project-${project.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  /**
   * Import project from JSON file
   */
  static async importProject(file: File): Promise<Project> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const parsed = JSON.parse(content);
          
          // Validate structure
          const project = this.validateAndMigrateProject(parsed);
          resolve(project);
        } catch (error) {
          reject(new Error(`Failed to parse project file: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  }

  /**
   * Validate and migrate imported project to current format
   */
  private static validateAndMigrateProject(data: unknown): Project {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid project file format');
    }

    const exportedProject = data as ExportedProject;
    
    // Check if it's an exported project with metadata
    let project: Project;
    if (exportedProject.project) {
      project = exportedProject.project;
    } else {
      // Direct project export without wrapper
      project = data as Project;
    }

    // Validate required fields
    if (!project.id || typeof project.id !== 'string') {
      throw new Error('Invalid project: missing or invalid id');
    }

    if (!project.name || typeof project.name !== 'string') {
      throw new Error('Invalid project: missing or invalid name');
    }

    if (!Array.isArray(project.screens) || project.screens.length === 0) {
      throw new Error('Invalid project: screens must be a non-empty array');
    }

    // Validate each screen
    project.screens.forEach((screen, index) => {
      if (!screen.id || typeof screen.id !== 'string') {
        throw new Error(`Invalid screen at index ${index}: missing or invalid id`);
      }

      if (!screen.name || typeof screen.name !== 'string') {
        throw new Error(`Invalid screen at index ${index}: missing or invalid name`);
      }

      if (!screen.config || typeof screen.config !== 'object') {
        throw new Error(`Invalid screen at index ${index}: missing or invalid config`);
      }

      // Ensure config has required fields
      this.validateScreenConfig(screen.config, index);
    });

    // Validate activeScreenId
    if (!project.screens.some(s => s.id === project.activeScreenId)) {
      project.activeScreenId = project.screens[0].id;
    }

    // Update timestamps
    const now = Date.now();
    return {
      ...project,
      updatedAt: now,
      screens: project.screens.map((screen, index) => ({
        ...screen,
        order: index,
        updatedAt: now,
      })),
    };
  }

  /**
   * Validate screen configuration
   */
  private static validateScreenConfig(config: ScreenConfig, screenIndex: number): void {
    if (!config.id || typeof config.id !== 'string') {
      throw new Error(`Screen ${screenIndex}: invalid config id`);
    }

    if (!Array.isArray(config.devices)) {
      throw new Error(`Screen ${screenIndex}: devices must be an array`);
    }

    if (!config.text || typeof config.text !== 'object') {
      throw new Error(`Screen ${screenIndex}: text config is required`);
    }

    if (!config.background || typeof config.background !== 'object') {
      throw new Error(`Screen ${screenIndex}: background config is required`);
    }
  }

  /**
   * Export as shareable link (base64 encoded project)
   */
  static generateShareableLink(project: Project): string {
    const minimalProject = {
      ...project,
      screens: project.screens.map(screen => ({
        ...screen,
        thumbnail: undefined,
      })),
    };

    const json = JSON.stringify(minimalProject);
    const base64 = btoa(json);
    return `${window.location.origin}${window.location.pathname}?project=${encodeURIComponent(base64)}`;
  }

  /**
   * Parse project from shareable link
   */
  static parseShareableLink(url: string): Project | null {
    try {
      const urlObj = new URL(url);
      const projectParam = urlObj.searchParams.get('project');
      
      if (!projectParam) return null;

      const json = atob(decodeURIComponent(projectParam));
      const project = JSON.parse(json);
      
      return this.validateAndMigrateProject(project);
    } catch {
      return null;
    }
  }
}

export default ProjectImportExportService;
