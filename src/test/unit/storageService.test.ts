import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  generateId,
  createNewScreen,
  createNewProject,
  duplicateScreen,
  storageService,
} from '../../../services/storageService'

describe('storageService', () => {
  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  }

  beforeEach(() => {
    vi.stubGlobal('localStorage', localStorageMock)
    localStorageMock.getItem.mockReset()
    localStorageMock.setItem.mockReset()
    localStorageMock.removeItem.mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('generateId', () => {
    it('should return a string', () => {
      const id = generateId()
      expect(typeof id).toBe('string')
    })

    it('should return unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })
  })

  describe('createNewScreen', () => {
    it('should create a screen with default name', () => {
      const screen = createNewScreen(0)
      expect(screen.name).toBe('Screen 1')
      expect(screen.order).toBe(0)
      expect(screen.id).toBeDefined()
      expect(screen.config).toBeDefined()
    })

    it('should create a screen with custom name', () => {
      const screen = createNewScreen(1, 'Custom Screen')
      expect(screen.name).toBe('Custom Screen')
      expect(screen.order).toBe(1)
    })

    it('should have createdAt and updatedAt timestamps', () => {
      const screen = createNewScreen(0)
      expect(screen.createdAt).toBeGreaterThan(0)
      expect(screen.updatedAt).toBeGreaterThan(0)
    })
  })

  describe('createNewProject', () => {
    it('should create a project with default name', () => {
      const project = createNewProject()
      expect(project.name).toBe('My Project')
      expect(project.screens).toHaveLength(1)
      expect(project.activeScreenId).toBe(project.screens[0].id)
    })

    it('should create a project with custom name', () => {
      const project = createNewProject('Custom Project')
      expect(project.name).toBe('Custom Project')
    })

    it('should have timestamps', () => {
      const project = createNewProject()
      expect(project.createdAt).toBeGreaterThan(0)
      expect(project.updatedAt).toBeGreaterThan(0)
    })
  })

  describe('duplicateScreen', () => {
    it('should duplicate a screen with copy suffix', () => {
      const original = createNewScreen(0, 'Original')
      const duplicated = duplicateScreen(original, 1)

      expect(duplicated.name).toBe('Original (copy)')
      expect(duplicated.id).not.toBe(original.id)
      expect(duplicated.order).toBe(1)
      expect(duplicated.config.devices).toHaveLength(original.config.devices.length)
    })

    it('should preserve thumbnail', () => {
      const original = createNewScreen(0)
      original.thumbnail = 'data:image/png;base64,test'
      const duplicated = duplicateScreen(original, 1)

      expect(duplicated.thumbnail).toBe(original.thumbnail)
    })
  })

  describe('storageService.load', () => {
    it('should return null when no data in localStorage', () => {
      localStorageMock.getItem.mockReturnValue(null)
      const result = storageService.load()
      expect(result).toBeNull()
    })

    it('should return null for invalid project structure', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ id: '123' }))
      const result = storageService.load()
      expect(result).toBeNull()
    })

    it('should load valid project', () => {
      const project = createNewProject()
      localStorageMock.getItem.mockReturnValue(JSON.stringify(project))
      const result = storageService.load()
      expect(result?.id).toBe(project.id)
      expect(result?.screens).toHaveLength(1)
    })

    it('should create default screen when screens array is empty', () => {
      const project = createNewProject()
      project.screens = []
      localStorageMock.getItem.mockReturnValue(JSON.stringify(project))
      const result = storageService.load()
      expect(result?.screens).toHaveLength(1)
    })

    it('should fix invalid activeScreenId', () => {
      const project = createNewProject()
      project.activeScreenId = 'invalid-id'
      localStorageMock.getItem.mockReturnValue(JSON.stringify(project))
      const result = storageService.load()
      expect(result?.activeScreenId).toBe(project.screens[0].id)
    })
  })

  describe('storageService.saveNow', () => {
    it('should save project to localStorage', () => {
      const project = createNewProject()
      storageService.saveNow(project)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'mockups_project',
        expect.any(String)
      )
    })
  })

  describe('storageService.clear', () => {
    it('should remove item from localStorage', () => {
      storageService.clear()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('mockups_project')
    })
  })
})
