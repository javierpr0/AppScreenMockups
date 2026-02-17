import { describe, it, expect, vi } from 'vitest'
import { ProjectImportExportService } from '../../../services/projectImportExportService'
import { Project } from '../../../types'

describe('ProjectImportExportService', () => {
  const mockProject: Project = {
    id: 'test-project-id',
    name: 'Test Project',
    screens: [
      {
        id: 'screen-1',
        name: 'Screen 1',
        order: 0,
        config: {
          id: 'screen-1',
          devices: [
            {
              id: 'device-1',
              type: 'iPhone 15 Pro' as any,
              image: null,
              x: 100,
              y: 200,
              rotation: 0,
              rotateX: 0,
              rotateY: 0,
              scale: 1,
              shadow: {
                enabled: true,
                color: '#000000',
                blur: 20,
                opacity: 0.3,
                offsetY: 10,
              },
              zIndex: 0,
            },
          ],
          text: {
            title: 'Test Title',
            subtitle: 'Test Subtitle',
            titleColor: '#ffffff',
            subtitleColor: '#cccccc',
            fontFamily: 'Inter',
            alignment: 'center',
            position: 'top',
            titleSize: 80,
            subtitleSize: 48,
            titleWeight: 700,
            subtitleWeight: 500,
            letterSpacing: 0,
            lineHeight: 1.2,
            textShadow: false,
            textShadowBlur: 12,
            textShadowColor: '#000000',
            maxWidth: 100,
          },
          background: {
            type: 'solid',
            color1: '#000000',
            color2: '#ffffff',
            direction: 'to right',
          },
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ],
    activeScreenId: 'screen-1',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }

  describe('exportProject', () => {
    it('should create a download link with JSON content', () => {
      // Mock URL.createObjectURL and document methods
      const mockUrl = 'blob:mock-url'
      global.URL.createObjectURL = vi.fn().mockReturnValue(mockUrl)
      global.URL.revokeObjectURL = vi.fn()
      
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
      }
      const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any)
      const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any)
      const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any)

      ProjectImportExportService.exportProject(mockProject, 'test-file.json')

      expect(createElementSpy).toHaveBeenCalledWith('a')
      expect(mockLink.href).toBe(mockUrl)
      expect(mockLink.download).toBe('test-file.json')
      expect(mockLink.click).toHaveBeenCalled()
      expect(removeChildSpy).toHaveBeenCalled()
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith(mockUrl)

      createElementSpy.mockRestore()
      appendChildSpy.mockRestore()
      removeChildSpy.mockRestore()
    })

    it('should generate default filename with project name', () => {
      const mockUrl = 'blob:mock-url'
      global.URL.createObjectURL = vi.fn().mockReturnValue(mockUrl)
      global.URL.revokeObjectURL = vi.fn()
      
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
      }
      vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any)
      vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any)
      vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any)

      ProjectImportExportService.exportProject(mockProject)

      expect(mockLink.download).toContain('appscreen-project-test-project-')
      expect(mockLink.download).toContain('.json')
    })
  })

  describe('importProject', () => {
    it('should import valid project file', async () => {
      const exportedProject = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        project: mockProject,
      }

      const file = new File([JSON.stringify(exportedProject)], 'project.json', {
        type: 'application/json',
      })

      const result = await ProjectImportExportService.importProject(file)

      expect(result.id).toBe(mockProject.id)
      expect(result.name).toBe(mockProject.name)
      expect(result.screens).toHaveLength(1)
      expect(result.screens[0].id).toBe(mockProject.screens[0].id)
    })

    it('should import project without wrapper object', async () => {
      const file = new File([JSON.stringify(mockProject)], 'project.json', {
        type: 'application/json',
      })

      const result = await ProjectImportExportService.importProject(file)

      expect(result.id).toBe(mockProject.id)
      expect(result.name).toBe(mockProject.name)
    })

    it('should handle project with thumbnails', async () => {
      const projectWithThumbnail = {
        ...mockProject,
        screens: [
          {
            ...mockProject.screens[0],
            thumbnail: 'data:image/png;base64,fake-thumbnail-data',
          },
        ],
      }

      // Test direct import (without export wrapper) preserves thumbnail
      const file = new File([JSON.stringify(projectWithThumbnail)], 'project.json', {
        type: 'application/json',
      })

      const result = await ProjectImportExportService.importProject(file)

      // Thumbnails are preserved on import, only removed on export
      expect(result.screens[0].thumbnail).toBe('data:image/png;base64,fake-thumbnail-data')
    })

    it('should throw error for invalid JSON', async () => {
      const file = new File(['invalid json'], 'project.json', {
        type: 'application/json',
      })

      await expect(ProjectImportExportService.importProject(file)).rejects.toThrow(
        'Failed to parse project file'
      )
    })

    it('should throw error for missing project id', async () => {
      const invalidProject = { ...mockProject, id: undefined }
      const file = new File([JSON.stringify(invalidProject)], 'project.json', {
        type: 'application/json',
      })

      await expect(ProjectImportExportService.importProject(file)).rejects.toThrow(
        'Invalid project: missing or invalid id'
      )
    })

    it('should throw error for missing screens array', async () => {
      const invalidProject = { ...mockProject, screens: [] }
      const file = new File([JSON.stringify(invalidProject)], 'project.json', {
        type: 'application/json',
      })

      await expect(ProjectImportExportService.importProject(file)).rejects.toThrow(
        'Invalid project: screens must be a non-empty array'
      )
    })

    it('should throw error for invalid screen config', async () => {
      const invalidProject = {
        ...mockProject,
        screens: [
          {
            ...mockProject.screens[0],
            config: null,
          },
        ],
      }
      const file = new File([JSON.stringify(invalidProject)], 'project.json', {
        type: 'application/json',
      })

      await expect(ProjectImportExportService.importProject(file)).rejects.toThrow(
        'Invalid screen at index 0: missing or invalid config'
      )
    })
  })

  describe('generateShareableLink', () => {
    it('should generate a link with base64 encoded project', () => {
      const link = ProjectImportExportService.generateShareableLink(mockProject)

      expect(link).toContain(window.location.origin)
      expect(link).toContain('?project=')
    })
  })

  describe('parseShareableLink', () => {
    it('should parse valid shareable link', () => {
      const link = ProjectImportExportService.generateShareableLink(mockProject)
      const parsed = ProjectImportExportService.parseShareableLink(link)

      expect(parsed).not.toBeNull()
      expect(parsed?.id).toBe(mockProject.id)
      expect(parsed?.name).toBe(mockProject.name)
    })

    it('should return null for invalid link', () => {
      const parsed = ProjectImportExportService.parseShareableLink('https://example.com')

      expect(parsed).toBeNull()
    })

    it('should return null for malformed base64', () => {
      const parsed = ProjectImportExportService.parseShareableLink(
        'https://example.com?project=invalid-base64!!!'
      )

      expect(parsed).toBeNull()
    })
  })
})
