import { useState, useCallback, useRef, useEffect } from 'react';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

interface UseHistoryReturn<T> {
  state: T;
  set: (newState: T | ((prev: T) => T)) => void;
  setWithHistory: (newState: T | ((prev: T) => T)) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  reset: (initialState: T) => void;
}

export function useHistory<T>(
  initialState: T,
  options: {
    maxHistory?: number;
    debounceMs?: number;
  } = {}
): UseHistoryReturn<T> {
  const { maxHistory = 50, debounceMs = 1000 } = options;
  
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  // Store last saved state to avoid duplicates
  const lastSavedStateRef = useRef<T>(initialState);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Immediate state update WITHOUT history tracking (for text inputs)
  const set = useCallback((
    newState: T | ((prev: T) => T)
  ) => {
    const resolvedState = typeof newState === 'function' 
      ? (newState as (prev: T) => T)(history.present)
      : newState;

    setHistory(prev => ({
      ...prev,
      present: resolvedState,
    }));
  }, [history.present]);

  // State update WITH history tracking (for significant changes)
  const setWithHistory = useCallback((
    newState: T | ((prev: T) => T)
  ) => {
    const resolvedState = typeof newState === 'function' 
      ? (newState as (prev: T) => T)(history.present)
      : newState;

    // Update state immediately for UI responsiveness
    setHistory(prev => ({
      ...prev,
      present: resolvedState,
      future: [], // Clear redo stack on new change
    }));

    // Debounce the history save
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      // Only save if state has changed since last save
      if (JSON.stringify(lastSavedStateRef.current) !== JSON.stringify(resolvedState)) {
        setHistory(prev => {
          const newPast = [...prev.past, lastSavedStateRef.current];
          
          // Limit history size
          if (newPast.length > maxHistory) {
            newPast.shift();
          }

          lastSavedStateRef.current = resolvedState;

          return {
            ...prev,
            past: newPast,
          };
        });
      }
    }, debounceMs);
  }, [history.present, maxHistory, debounceMs]);

  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.past.length === 0) return prev;

      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, -1);

      lastSavedStateRef.current = previous;

      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory(prev => {
      if (prev.future.length === 0) return prev;

      const next = prev.future[0];
      const newFuture = prev.future.slice(1);

      lastSavedStateRef.current = next;

      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const reset = useCallback((newInitialState: T) => {
    lastSavedStateRef.current = newInitialState;
    setHistory({
      past: [],
      present: newInitialState,
      future: [],
    });
  }, []);

  return {
    state: history.present,
    set,
    setWithHistory,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    reset,
  };
}

export default useHistory;
