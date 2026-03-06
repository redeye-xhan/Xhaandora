"use client"
import React, { useState } from 'react'
import { motion } from '@/lib/motion'

const soundOptions = ['Bell', 'Digital beep', 'Wood block', 'Soft chime']

export default function SoundSettings({ onVolumeChange }: { onVolumeChange?: (v: number) => void }) {
  const [volume, setVolume] = useState(0.7)
  const [sound, setSound] = useState('Bell')
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-transparent rounded-lg p-0 w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Sound Settings</h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-lg"
        >
          {expanded ? '✕' : '🔊'}
        </button>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Sound Type</label>
              <select
                value={sound}
                onChange={(e) => setSound(e.target.value)}
                className="w-full mt-1 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-sm"
              >
                {soundOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Volume</label>
                <span className="text-xs text-slate-500">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  setVolume(val)
                  onVolumeChange?.(val)
                }}
                className="w-full sound-range"
              />
            </div>

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ duration: 0.18 }}
                className="group flex-1 px-3 py-1 text-xs rounded-md text-slate-800 font-medium transition-all duration-200 hover:scale-105 hover:shadow-[0_0_10px_rgba(187,247,208,0.6)] active:scale-95"
                style={{ background: 'linear-gradient(135deg, #fef9c3, #bbf7d0)' }}
              >
                <span className="mr-2 text-slate-800 transition-all duration-200 group-hover:text-yellow-400 group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_rgba(187,247,208,0.6)]">🔔</span>
                Test Sound
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ duration: 0.18 }}
                className="group flex-1 px-3 py-1 text-xs rounded-md text-slate-800 font-medium transition-all duration-200 hover:scale-105 hover:shadow-[0_0_10px_rgba(187,247,208,0.6)] active:scale-95"
                style={{ background: 'linear-gradient(135deg, #fef9c3, #bbf7d0)' }}
              >
                <span className="mr-2 text-slate-800 transition-all duration-200 group-hover:text-yellow-400 group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_rgba(187,247,208,0.6)]">🛡️</span>
                Keep Awake
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
