import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useHistory } from '../../../hooks/useHistory'

describe('useHistory', () => {
  const initialState = { count: 0, name: 'test' }

  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('should initialize with the initial state', () => {
    const { result } = renderHook(() => useHistory(initialState))
    
    expect(result.current.state).toEqual(initialState)
    expect(result.current.canUndo).toBe(false)
    expect(result.current.canRedo).toBe(false)
  })

  it('set: should update state immediately without history', () => {
    const { result } = renderHook(() => useHistory(initialState))

    act(() => {
      result.current.set({ count: 1, name: 'test' })
    })

    // Should update immediately
    expect(result.current.state).toEqual({ count: 1, name: 'test' })
    expect(result.current.canUndo).toBe(false) // No history tracking
  })

  it('setWithHistory: should update state immediately but save history after debounce', () => {
    const { result } = renderHook(() => useHistory(initialState, { debounceMs: 100 }))

    act(() => {
      result.current.setWithHistory({ count: 1, name: 'test' })
    })

    // State updates immediately
    expect(result.current.state).toEqual({ count: 1, name: 'test' })
    // But history not yet saved
    expect(result.current.canUndo).toBe(false)

    // Advance timers to trigger history save
    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current.canUndo).toBe(true)
  })

  it('should undo changes', () => {
    const { result } = renderHook(() => useHistory(initialState, { debounceMs: 0 }))

    act(() => {
      result.current.setWithHistory({ count: 1, name: 'test' })
      vi.advanceTimersByTime(0)
    })

    act(() => {
      result.current.undo()
    })

    expect(result.current.state).toEqual(initialState)
    expect(result.current.canUndo).toBe(false)
    expect(result.current.canRedo).toBe(true)
  })

  it('should redo changes', () => {
    const { result } = renderHook(() => useHistory(initialState, { debounceMs: 0 }))

    act(() => {
      result.current.setWithHistory({ count: 1, name: 'test' })
      vi.advanceTimersByTime(0)
    })

    act(() => {
      result.current.undo()
    })

    act(() => {
      result.current.redo()
    })

    expect(result.current.state).toEqual({ count: 1, name: 'test' })
    expect(result.current.canUndo).toBe(true)
    expect(result.current.canRedo).toBe(false)
  })

  it('should clear redo stack on new change', () => {
    const { result } = renderHook(() => useHistory(initialState, { debounceMs: 0 }))

    act(() => {
      result.current.setWithHistory({ count: 1, name: 'test' })
      vi.advanceTimersByTime(0)
    })

    act(() => {
      result.current.setWithHistory({ count: 2, name: 'test' })
      vi.advanceTimersByTime(0)
    })

    act(() => {
      result.current.undo()
    })

    expect(result.current.canRedo).toBe(true)

    // Make a new change
    act(() => {
      result.current.setWithHistory({ count: 3, name: 'test' })
      vi.advanceTimersByTime(0)
    })

    expect(result.current.canRedo).toBe(false)
  })

  it('should respect max history limit', () => {
    const { result } = renderHook(() => 
      useHistory(initialState, { maxHistory: 3, debounceMs: 0 })
    )

    // Add more states than maxHistory
    for (let i = 1; i <= 5; i++) {
      act(() => {
        result.current.setWithHistory({ count: i, name: 'test' })
        vi.advanceTimersByTime(0)
      })
    }

    // Undo all the way back
    for (let i = 0; i < 5; i++) {
      act(() => {
        result.current.undo()
      })
    }

    // Should only be able to undo maxHistory times
    expect(result.current.state.count).toBe(2) // Lost states 0 and 1
  })

  it('should not save identical states', () => {
    const { result } = renderHook(() => useHistory(initialState, { debounceMs: 0 }))

    act(() => {
      result.current.setWithHistory(initialState) // Same state
      vi.advanceTimersByTime(0)
    })

    expect(result.current.canUndo).toBe(false)
  })

  it('should reset to new initial state', () => {
    const { result } = renderHook(() => useHistory(initialState, { debounceMs: 0 }))

    act(() => {
      result.current.setWithHistory({ count: 1, name: 'test' })
      vi.advanceTimersByTime(0)
    })

    act(() => {
      result.current.reset({ count: 100, name: 'reset' })
    })

    expect(result.current.state).toEqual({ count: 100, name: 'reset' })
    expect(result.current.canUndo).toBe(false)
    expect(result.current.canRedo).toBe(false)
  })

  it('should handle functional updates with set', () => {
    const { result } = renderHook(() => useHistory(initialState))

    act(() => {
      result.current.set(prev => ({ ...prev, count: prev.count + 1 }))
    })

    expect(result.current.state.count).toBe(1)
    expect(result.current.canUndo).toBe(false) // No history with set()
  })

  it('should handle functional updates with setWithHistory', () => {
    const { result } = renderHook(() => useHistory(initialState, { debounceMs: 0 }))

    act(() => {
      result.current.setWithHistory(prev => ({ ...prev, count: prev.count + 1 }))
      vi.advanceTimersByTime(0)
    })

    expect(result.current.state.count).toBe(1)
    expect(result.current.canUndo).toBe(true)
  })
})
