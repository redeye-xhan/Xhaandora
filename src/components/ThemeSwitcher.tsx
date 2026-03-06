"use client"
import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from '@/lib/motion'

const themes = [
  { id: 'productivity-green', name: 'Vibrant Teal' },
  { id: 'vibrant-purple', name: 'Vibrant Purple' },
  { id: 'energetic-orange', name: 'Energetic Orange' },
  { id: 'neon', name: 'Neon Tech' },
  { id: 'sunset', name: 'Sunset Orange' },
  { id: 'midnight', name: 'Midnight Blue' },
  { id: 'sunrise', name: 'Sunrise Yellow' },
  { id: 'default', name: 'Default' },
  { id: 'dark', name: 'Dark Mode' }
]

export default function ThemeSwitcher() {
  const [selected, setSelected] = useState(themes[0])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  function apply(id: string) {
    document.documentElement.dataset.theme = id
    if (id === 'dark' || ['neon', 'midnight', 'sunset'].includes(id)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('x_theme', id)
  }

  useEffect(() => {
    const saved = localStorage.getItem('x_theme')
    const found = themes.find((t) => t.id === saved) || themes[0]
    setSelected(found)
    apply(found.id)
  }, [])

  
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    window.addEventListener('mousedown', handler)
    return () => window.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative inline-block text-left">
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.05, y: -2 }}
        transition={{ duration: 0.18 }}
        className="w-40 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg py-2 px-3 flex items-center justify-between shadow-sm transition-all duration-200 hover:shadow-[0_0_14px_rgba(255,221,87,0.55)]"
      >
        <span className="truncate">{selected.name}</span>
        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            <div className="absolute mt-2 w-40 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg z-10">
              {themes.map((th) => (
                <button
                  key={th.id}
                  onClick={() => {
                    setSelected(th)
                    apply(th.id)
                    setOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-[var(--accent)]/20 dark:hover:bg-[var(--accent)]/30 transition ${
                    selected.id === th.id ? 'font-semibold bg-[var(--accent)]/30' : ''
                  }`}
                >
                  {th.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
