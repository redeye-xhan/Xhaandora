"use client"
import React, { useState } from 'react'

export default function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false)

  const shortcuts = [
    { key: 'Space', description: 'Start/Pause timer' },
    { key: 'R', description: 'Reset timer' },
    { key: '1', description: 'Switch to Work mode' },
    { key: '2', description: 'Switch to Break mode' },
    { key: 'D', description: 'Toggle Dark/Light mode' },
    { key: 'S', description: 'Toggle Settings' },
    { key: 'T', description: 'Focus task input' },
    { key: 'F', description: 'Activate Focus mode' },
  ]

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 w-10 h-10 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-full flex items-center justify-center text-lg font-bold transition-colors z-50"
        title="Keyboard Shortcuts"
      >
        ?
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsOpen(false)}>
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>
        <div className="space-y-3">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.key} className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">{shortcut.description}</span>
              <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-sm font-mono">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-slate-500 text-center">
          Press ESC or click outside to close
        </div>
      </div>
    </div>
  )
}