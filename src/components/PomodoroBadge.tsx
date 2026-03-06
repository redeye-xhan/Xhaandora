"use client"
import React, { useEffect, useState } from 'react'
import { motion } from '@/lib/motion'

export default function PomodoroBadge() {
  const [count, setCount] = useState(0)

  function load() {
    try {
      const h = JSON.parse(localStorage.getItem('x_history') || '[]')
      const total = (h || []).filter((it: any) => it.mode === 'work').length
      setCount(total)
    } catch (e) {
      setCount(0)
    }
  }

  useEffect(() => {
    load()
    const handler = () => load()
    window.addEventListener('storage', handler)
    const iv = setInterval(load, 2000)
    return () => {
      window.removeEventListener('storage', handler)
      clearInterval(iv)
    }
  }, [])

  return (
    <div className="w-full flex justify-center items-center my-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="px-6 py-3 rounded-xl bg-slate-900/60 border border-teal-400/30 text-teal-300 text-sm font-medium tracking-wide shadow-[0_0_14px_rgba(0,255,200,0.18)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,200,0.35)] hover:border-teal-300"
      >
        Pomodoros completed: {count}
      </motion.div>
    </div>
  )
}
