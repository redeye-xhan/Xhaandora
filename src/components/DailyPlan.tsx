"use client"
import React, { useEffect, useState } from 'react'
import { motion } from '@/lib/motion'

type Block = { id: string; start: string; duration: number; title: string }

export default function DailyPlan() {
  const [blocks, setBlocks] = useState<Block[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('x_plan') || '[]')
    } catch {
      return []
    }
  })
  const [title, setTitle] = useState('')
  const [start, setStart] = useState('09:00')
  const [duration, setDuration] = useState(25)

  useEffect(() => {
    localStorage.setItem('x_plan', JSON.stringify(blocks))
  }, [blocks])

  function add() {
    if (!title) return
    setBlocks((s) => [{ id: String(Date.now()), start, duration, title }, ...s])
    setTitle('')
  }

  function remove(id: string) {
    setBlocks((s) => s.filter((b) => b.id !== id))
  }

  return (
    <div className="space-y-3 w-full">
      <div className="flex gap-2 text-xs sm:flex-wrap">
        <motion.input
          whileFocus={{ scale: 1.02 }}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border border-slate-200/50 dark:border-slate-600/50 bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all text-xs"
        />
        <motion.input
          type="time"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200/50 dark:border-slate-600/50 bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all text-xs"
        />
        <motion.input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-16 px-3 py-2 rounded-lg border border-slate-200/50 dark:border-slate-600/50 bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all text-xs"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={add}
          className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 ease-out cursor-pointer active:scale-95 bg-emerald-500 text-white hover:bg-emerald-400 hover:shadow-[0_0_12px_rgba(255,221,87,0.45)] hover:scale-105"
        >
          Add
        </motion.button>
      </div>
      
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {blocks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-3 text-slate-500 dark:text-slate-400 text-xs"
          >
            No blocks scheduled yet
          </motion.div>
        ) : (
          blocks.map((b) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center justify-between p-3 rounded-lg border border-blue-200/50 dark:border-blue-700/50 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 transition-all duration-200 text-xs hover:border-yellow-300 hover:shadow-[0_0_16px_rgba(255,221,87,0.35)] hover:scale-105"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-900 dark:text-slate-100 truncate">{b.title}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{b.start} • {b.duration} min</div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => remove(b.id)}
                className="flex items-center justify-center w-6 h-6 ml-2 text-slate-400 hover:text-red-400 transition-all duration-200 ease-out flex-shrink-0 rounded hover:bg-red-500/10 hover:scale-[1.03] active:scale-[0.97]"
              >
                ✕
              </motion.button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
