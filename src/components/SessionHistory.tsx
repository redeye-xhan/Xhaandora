"use client"
import React, { useEffect, useState } from 'react'
import { exportCSV } from '../utils/csv'

type Entry = {
  id: number
  mode: string
  duration: number
  completedAt: number
  note?: string
  rating?: number
}

export default function SessionHistory() {
  const [history, setHistory] = useState<Entry[]>([])
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const h = JSON.parse(localStorage.getItem('x_history') || '[]')
    setHistory(h)
  }, [])

  function clear() {
    localStorage.removeItem('x_history')
    setHistory([])
  }

  function toggleExpanded(id: number) {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="session-history bg-white dark:bg-slate-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Session History</h3>
        <div className="flex gap-2">
          <button onClick={() => exportCSV(history)} className="px-3 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 rounded text-sm transition-colors">
            Export CSV
          </button>
          <button onClick={clear} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-colors">
            Clear
          </button>
        </div>
      </div>
      <ul className="space-y-2 max-h-60 overflow-auto">
        {history.map((h) => {
          const isExpanded = expandedId === h.id
          return (
            <li key={h.id} className="border border-slate-200 dark:border-slate-600 rounded-lg">
              <button
                onClick={() => toggleExpanded(h.id)}
                className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">
                      {new Date(h.completedAt).toLocaleDateString()} at {new Date(h.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-sm text-slate-500">
                      {h.mode === 'work' ? 'Work Session' : 'Break Session'} • {Math.round(h.duration / 60)}m
                      {h.note && ' • Has note'}
                      {h.rating && ` • ${'★'.repeat(h.rating)}${'☆'.repeat(5 - h.rating)}`}
                    </div>
                  </div>
                  <div className="text-slate-400">
                    {isExpanded ? '▲' : '▼'}
                  </div>
                </div>
              </button>
              {isExpanded && (
                <div className="px-3 pb-3 border-t border-slate-200 dark:border-slate-600">
                  <div className="mt-2 text-sm">
                    <div className="text-slate-600 dark:text-slate-400">
                      Duration: {Math.round(h.duration / 60)} minutes
                    </div>
                    {h.note && (
                      <div className="mt-2">
                        <div className="font-medium text-slate-700 dark:text-slate-300">Note:</div>
                        <div className="text-slate-600 dark:text-slate-400 mt-1">{h.note}</div>
                      </div>
                    )}
                    {h.rating && (
                      <div className="mt-2">
                        <div className="font-medium text-slate-700 dark:text-slate-300">Focus Rating:</div>
                        <div className="text-yellow-500 mt-1">
                          {'★'.repeat(h.rating)}{'☆'.repeat(5 - h.rating)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
