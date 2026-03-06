"use client"
import React from 'react'
import { motion } from '@/lib/motion'

type HighFive = { name: string; count: number; avatarUrl?: string }

const sample: HighFive[] = [
  { name: 'Sarah', count: 50 },
  { name: 'Ben', count: 12 },
  { name: 'Alex', count: 1220 }
]

export default function CommunityHighFives() {
  return (
    <div className="space-y-2 w-full max-h-48 overflow-y-auto">
      {sample.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-3 text-slate-500 dark:text-slate-400 text-xs"
        >
          No high-fives yet 🙌
        </motion.div>
      ) : (
        sample.map((h, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="list-none flex items-center gap-3 p-3 rounded-xl border border-[#1e293b] bg-[#0f172a] text-slate-100 shadow-sm transition-all duration-200 hover:border-yellow-300 hover:shadow-[0_0_16px_rgba(255,221,87,0.35)] hover:scale-105"
          >
            <motion.div whileHover={{ scale: 1.12, y: -2 }} transition={{ duration: 0.18 }} className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-xs text-white font-semibold flex-shrink-0 shadow-md hover:shadow-[0_0_12px_rgba(255,221,87,0.45)]">
              {h.name[0]}
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-slate-100 text-xs">
                <span>{h.name}</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                <span className="font-semibold text-green-400">{h.count}</span>
                {' '}
                high-fives
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.15, y: -2 }} animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2 }} className="text-lg flex-shrink-0 hover:shadow-[0_0_12px_rgba(255,221,87,0.45)]">👍</motion.div>
          </motion.li>
        ))
      )}
    </div>
  )
}