"use client"
import React from 'react'
import { motion } from '@/lib/motion'

export default function MenuBar() {
  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="glass-card h-16 border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between px-6 backdrop-blur-xl sticky top-0 z-50"
    >
      {}
      <div className="flex items-center gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="font-bold text-lg bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent"
        >
          Xhaandora
        </motion.div>
      </div>

      {}
      <div className="flex items-center gap-3">
        {}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-all"
          title="Google Calendar Sync"
        >
          <span className="text-sm">📅</span>
          <span className="text-xs font-medium text-green-600 dark:text-green-400">Synced</span>
        </motion.button>

        {}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-all"
          title="Todoist Sync"
        >
          <span className="text-sm">📝</span>
          <span className="text-xs font-medium text-green-600 dark:text-green-400">Synced</span>
        </motion.button>

        {}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-3 py-2 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-all font-medium text-sm"
          title="Keyboard Shortcuts (?)"
        >
          ?
        </motion.button>
      </div>
    </motion.div>
  )
}