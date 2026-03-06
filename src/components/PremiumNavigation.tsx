"use client"
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from '@/lib/motion'
import SoundSettings from './SoundSettings'

interface NavItem {
  id: string
  label: string
  icon: string
  active?: boolean
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '⏱️', active: true },
  { id: 'timeline', label: 'Timeline', icon: '📅' },
  { id: 'insights', label: 'Insights', icon: '📈' },
  { id: 'forest', label: 'Forest', icon: '🌲' },
  { id: 'integrations', label: 'Integrations', icon: '🔗' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
  { id: 'support', label: 'Support', icon: '💬' },
]

export default function PremiumNavigation() {
  const [isDark, setIsDark] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark')
    setIsDark(!isDark)
  }

  const handleNavClick = (id: string) => {
    setActiveTab(id)
    
    console.log('Navigate to:', id)
  }

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`glass-card h-full flex flex-col transition-all duration-300 relative z-50 ${
        isCollapsed ? 'w-20' : 'w-64'
      } border-r pointer-events-auto`}
      style={{ pointerEvents: 'auto' }}
    >
      {}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center justify-between">
          <motion.div
            animate={{ scale: isCollapsed ? 0.8 : 1, opacity: isCollapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Xhaandora
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Focus & Productivity</p>
          </motion.div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Toggle sidebar"
          >
            {isCollapsed ? '→' : '←'}
          </motion.button>
        </div>
      </div>

      {}
      <nav className="flex-1 p-4 space-y-2 pointer-events-auto" style={{ pointerEvents: 'auto' }}>
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            onMouseEnter={() => {}}
            whileHover={{ x: isCollapsed ? 0 : 4 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 relative group pointer-events-auto cursor-pointer ${
              activeTab === item.id || item.active
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
            }`}
            style={{ pointerEvents: 'auto' }}
          >
            {}
            {(activeTab === item.id || item.active) && (
              <motion.div
                layoutId="active-indicator"
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-teal-500/20 to-cyan-500/20 -z-10 blur-lg"
                transition={{ type: 'spring', stiffness: 200, damping: 30 }}
              />
            )}

            <span className="text-xl flex-shrink-0 pointer-events-none">{item.icon}</span>
            
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-medium text-sm pointer-events-none"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>

            {}
            <AnimatePresence>
              {isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 10 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="absolute left-full ml-3 px-3 py-2 bg-slate-900 dark:bg-slate-700 text-white text-sm rounded-lg whitespace-nowrap pointer-events-none z-50"
                >
                  {item.label}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </nav>

      {}
      <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 space-y-3 pointer-events-auto" style={{ pointerEvents: 'auto' }}>
        {}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors pointer-events-auto cursor-pointer"
          style={{ pointerEvents: 'auto' }}
        >
          <span className="text-xl pointer-events-none">{isDark ? '☀️' : '🌙'}</span>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium pointer-events-none"
              >
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-200/50 dark:border-slate-700/50 pt-3 pointer-events-auto"
            style={{ pointerEvents: 'auto' }}
          >
            <SoundSettings />
          </motion.div>
        )}
      </div>

      {}
      <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 pointer-events-auto" style={{ pointerEvents: 'auto' }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full p-2.5 rounded-lg bg-gradient-to-r from-teal-500/10 to-cyan-500/10 hover:from-teal-500/20 hover:to-cyan-500/20 text-teal-600 dark:text-teal-400 font-medium text-sm transition-all pointer-events-auto cursor-pointer"
          style={{ pointerEvents: 'auto' }}
        >
          {isCollapsed ? '👤' : 'View Profile'}
        </motion.button>
      </div>
    </motion.div>
  )
}
