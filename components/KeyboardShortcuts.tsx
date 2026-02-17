import React, { useState } from 'react';
import { Keyboard, X } from 'lucide-react';

interface Shortcut {
  key: string;
  description: string;
  modifiers?: string[];
}

const SHORTCUTS: Shortcut[] = [
  { key: 'Z', description: 'Undo', modifiers: ['Ctrl'] },
  { key: 'Z', description: 'Redo', modifiers: ['Ctrl', 'Shift'] },
  { key: 'D', description: 'Duplicate screen', modifiers: ['Ctrl'] },
  { key: 'Delete', description: 'Delete selected device' },
  { key: 'Space', description: 'Play/Pause animation' },
  { key: 'Esc', description: 'Stop animation' },
];

export const KeyboardShortcuts: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-40 p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 transition-colors"
        title="Keyboard Shortcuts"
      >
        <Keyboard className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-zinc-100">Keyboard Shortcuts</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {SHORTCUTS.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0"
                >
                  <span className="text-sm text-zinc-300">{shortcut.description}</span>
                  <div className="flex items-center gap-1">
                    {shortcut.modifiers?.map((mod, i) => (
                      <span key={i}>
                        <kbd className="px-2 py-1 text-xs font-mono bg-zinc-800 text-zinc-300 rounded">
                          {mod}
                        </kbd>
                        <span className="mx-1 text-zinc-600">+</span>
                      </span>
                    ))}
                    <kbd className="px-2 py-1 text-xs font-mono bg-zinc-800 text-zinc-300 rounded">
                      {shortcut.key}
                    </kbd>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-zinc-500 text-center">
              Shortcuts are disabled when typing in input fields
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default KeyboardShortcuts;
