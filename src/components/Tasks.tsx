"use client"
import React, { useEffect, useState } from 'react'
import { playBell } from '@/lib/audio'
import { motion, AnimatePresence } from '@/lib/motion'

type Task = { id: string; text: string; done?: boolean; attached?: boolean }

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [text, setText] = useState('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    try {
      const saved = JSON.parse(localStorage.getItem('x_tasks') || '[]')
      setTasks(saved)
    } catch {
      setTasks([])
    }
  }, [])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('x_tasks', JSON.stringify(tasks))
    }
  }, [tasks, isClient])

  function add() {
    if (!text.trim()) return
    setTasks((s) => [{ id: String(Date.now()), text: text.trim(), done: false }, ...s])
    setText('')
  }

  function toggle(id: string) {
    setTasks((s) => s.map((t) => {
      if (t.id === id) {
        const newDone = !t.done
        if (newDone) {
          playBell(0.5)
        }
        return { ...t, done: newDone }
      }
      return t
    }))
  }

  function attachTask(id: string) {
    setTasks((s) => s.map((t) => ({
      ...t,
      attached: t.id === id ? !t.attached : false
    })))
  }

  const completedCount = tasks.filter(t => t.done).length

  return (
    <div className="space-y-4 w-full">
      {}
      <div className="grid grid-cols-2 gap-3 w-full text-xs">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-200/50 dark:border-green-700/50 text-center transition-all duration-200 ease-out hover:border-yellow-300 hover:shadow-[0_0_16px_rgba(255,221,87,0.35)] hover:scale-105"
        >
          <div className="font-bold text-lg text-green-600 dark:text-green-400">{completedCount}</div>
          <div className="text-slate-600 dark:text-slate-400 mt-0.5">Done</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-200/50 dark:border-blue-700/50 text-center transition-all duration-200 ease-out hover:border-yellow-300 hover:shadow-[0_0_16px_rgba(255,221,87,0.35)] hover:scale-105"
        >
          <div className="font-bold text-lg text-blue-600 dark:text-blue-400">{tasks.length - completedCount}</div>
          <div className="text-slate-600 dark:text-slate-400 mt-0.5">Pending</div>
        </motion.div>
      </div>

      {}
      <div className="flex gap-2">
        <motion.input
          whileFocus={{ scale: 1.02 }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && add()}
          className="flex-1 px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all text-sm"
          placeholder="Add a task..."
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={add}
          className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 ease-out cursor-pointer active:scale-95 bg-emerald-500 text-white hover:bg-emerald-400 hover:shadow-[0_0_12px_rgba(255,221,87,0.45)] hover:scale-105"
        >
          +
        </motion.button>
      </div>

      {}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        <AnimatePresence>
          {tasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-4 text-slate-500 dark:text-slate-400 text-sm"
            >
              No tasks yet 🚀
            </motion.div>
          ) : (
            tasks.map((t, idx) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-3 rounded-lg border transition-all ${
                  t.attached
                    ? 'border-teal-300/50 dark:border-teal-600/50 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 shadow-md'
                    : t.done
                    ? 'border-slate-200/50 dark:border-slate-600/50 bg-slate-50/50 dark:bg-slate-700/30'
                    : 'border-slate-200/50 dark:border-slate-600/50 bg-white/50 dark:bg-slate-700/50 hover:border-slate-300/50 dark:hover:border-slate-500/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-3 flex-1 cursor-pointer min-w-0">
                    <motion.input
                      type="checkbox"
                      checked={!!t.done}
                      onChange={() => toggle(t.id)}
                      className="w-4 h-4 rounded cursor-pointer accent-teal-500 flex-shrink-0"
                      whileHover={{ scale: 1.1 }}
                    />
                    <motion.span
                      animate={{ opacity: t.done ? 0.6 : 1 }}
                      className={`flex-1 text-sm transition-all truncate ${
                        t.done
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {t.text}
                    </motion.span>
                  </label>
                  {!t.done && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => attachTask(t.id)}
                      className={`flex items-center justify-center gap-2 h-8 px-2.5 rounded text-xs font-medium transition-all ease-out duration-200 cursor-pointer flex-shrink-0 hover:scale-[1.03] active:scale-[0.97] hover:shadow-[0_0_12px_rgba(255,221,87,0.45)] hover:border-yellow-300 ${
                        t.attached
                          ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md hover:shadow-[0_0_15px_rgba(45,212,191,0.35)]'
                          : 'bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-500'
                      }`}
                    >
                      {t.attached ? '📌' : '🎯'}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
