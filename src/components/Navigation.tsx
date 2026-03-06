"use client"
import React, { useState, useEffect } from 'react'
import { motion } from '@/lib/motion'
import SoundSettings from './SoundSettings'
import Logo from './Logo'

interface NavItem {
  id: string
  label: string
  icon: string
  active?: boolean
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '⏱️', active: true },
  { id: 'timeline', label: 'Timeline', icon: '📅' },
  { id: 'insights', label: 'Insights', icon: '📊' },
  { id: 'forest', label: 'Forest', icon: '🌲' },
  { id: 'integrations', label: 'Integrations', icon: '🔗' },
]

export default function Navigation() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark')
    setIsDark(!isDark)
  }
  return (
    <div className="w-full">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <Logo />
        <p className="mt-2 text-slate-400 text-sm tracking-wide">Focus & Productivity</p>
      </div>

      <nav className="flex-1 p-2">
        <motion.ul initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }} className="space-y-2">
          {navItems.map((item) => (
            <motion.li key={item.id} variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ duration: 0.2 }}
                onClick={() => {}}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 hover:text-yellow-300 hover:shadow-[0_0_14px_rgba(255,221,87,0.55)] hover:scale-[1.03] cursor-pointer ${
                  item.active ? 'bg-[var(--accent)] text-white font-semibold shadow-md' : 'text-slate-300'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </motion.button>
            </motion.li>
          ))}
        </motion.ul>
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Theme</span>
          <motion.button whileHover={{ scale: 1.05, y: -2 }} transition={{ duration: 0.18 }} onClick={toggleTheme} className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 transition-all duration-200 hover:shadow-[0_0_14px_rgba(255,221,87,0.55)]">
            {isDark ? '☀️' : '🌙'}
          </motion.button>
        </div>

        <div className="pt-3">
          <SoundSettings />
        </div>

        <motion.button whileHover={{ scale: 1.05, y: -2 }} transition={{ duration: 0.18 }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 hover:text-yellow-300 hover:shadow-[0_0_14px_rgba(255,221,87,0.55)] cursor-pointer">
          <span className="text-lg">⚙️</span>
          <span className="font-medium">Settings</span>
        </motion.button>
      </div>

      <div className="mt-auto p-4 space-y-3 border-t border-slate-200 dark:border-slate-700">
        <motion.button whileHover={{ scale: 1.05, y: -2 }} transition={{ duration: 0.18 }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 hover:text-yellow-300 hover:shadow-[0_0_14px_rgba(255,221,87,0.55)] cursor-pointer">
          <span className="text-lg">💬</span>
          <span className="font-medium">Support Center</span>
        </motion.button>
        <motion.button whileHover={{ scale: 1.05, y: -2 }} transition={{ duration: 0.18 }} onClick={toggleTheme} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 hover:text-yellow-300 hover:shadow-[0_0_14px_rgba(255,221,87,0.55)] cursor-pointer">
          <span className="text-lg">{isDark ? '☀️' : '🌙'}</span>
          <span className="font-medium">Dark Mode</span>
        </motion.button>
        <motion.button whileHover={{ scale: 1.05, y: -2 }} transition={{ duration: 0.18 }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 hover:text-yellow-300 hover:shadow-[0_0_14px_rgba(255,221,87,0.55)] cursor-pointer">
          <span className="text-lg">👤</span>
          <span className="font-medium">Profile</span>
        </motion.button>
      </div>
    </div>
  )
}