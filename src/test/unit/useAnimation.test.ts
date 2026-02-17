import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAnimation } from '../../../hooks/useAnimation'
import { DeviceConfig, AnimationConfig, DeviceType } from '../../../types'

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
  return setTimeout(() => callback(performance.now()), 16) as unknown as number
})

global.cancelAnimationFrame = vi.fn((id: number) => {
  clearTimeout(id)
})

describe('useAnimation', () => {
  const mockDevices: DeviceConfig[] = [
    {
      id: 'device-1',
      type: DeviceType.IPHONE_15_PRO,
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
  ]

  const mockConfig: AnimationConfig = {
    enabled: true,
    presetId: 'slide-in-bottom',
    duration: 1000,
    loop: false,
    playbackState: 'stopped',
    currentTime: 0,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return initial state', () => {
    const { result } = renderHook(() => useAnimation(mockDevices, mockConfig))

    expect(result.current.currentTime).toBe(0)
    expect(result.current.isPlaying).toBe(false)
    expect(result.current.animatedDevices).toHaveLength(1)
  })

  it('should return non-animated devices when disabled', () => {
    const disabledConfig: AnimationConfig = {
      ...mockConfig,
      enabled: false,
      playbackState: 'stopped',
      currentTime: 0,
    }

    const { result } = renderHook(() => useAnimation(mockDevices, disabledConfig))

    expect(result.current.animatedDevices[0].x).toBe(100)
    expect(result.current.animatedDevices[0].y).toBe(200)
  })

  it('should start playing when play is called', () => {
    const { result } = renderHook(() => useAnimation(mockDevices, mockConfig))

    act(() => {
      result.current.play()
    })

    expect(result.current.isPlaying).toBe(true)
  })

  it('should not play when animation is disabled', () => {
    const disabledConfig: AnimationConfig = {
      ...mockConfig,
      enabled: false,
      playbackState: 'stopped',
      currentTime: 0,
    }

    const { result } = renderHook(() => useAnimation(mockDevices, disabledConfig))

    act(() => {
      result.current.play()
    })

    expect(result.current.isPlaying).toBe(false)
  })

  it('should stop animation when stop is called', () => {
    const { result } = renderHook(() => useAnimation(mockDevices, mockConfig))

    act(() => {
      result.current.play()
      result.current.stop()
    })

    expect(result.current.isPlaying).toBe(false)
    expect(result.current.currentTime).toBe(0)
  })

  it('should seek to specific time', () => {
    const { result } = renderHook(() => useAnimation(mockDevices, mockConfig))

    act(() => {
      result.current.seek(0.5)
    })

    expect(result.current.currentTime).toBe(0.5)
  })

  it('should clamp seek time between 0 and 1', () => {
    const { result } = renderHook(() => useAnimation(mockDevices, mockConfig))

    act(() => {
      result.current.seek(1.5)
    })

    expect(result.current.currentTime).toBe(1)

    act(() => {
      result.current.seek(-0.5)
    })

    expect(result.current.currentTime).toBe(0)
  })

  it('should pause animation', () => {
    const { result } = renderHook(() => useAnimation(mockDevices, mockConfig))

    act(() => {
      result.current.seek(0.3)
      result.current.play()
      result.current.pause()
    })

    expect(result.current.isPlaying).toBe(false)
    expect(result.current.currentTime).toBe(0.3)
  })
})
