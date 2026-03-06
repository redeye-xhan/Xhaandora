"use client"
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function todayKey() {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

function AnimatedNumber({ value, label }: { value: number | string; label: string }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (typeof value !== 'number') return

    let start = 0
    const end = value
    const duration = 1000
    const increment = end / (duration / 16)

    const timeout = setInterval(() => {
      start += increment
      if (start >= end) {
        setDisplayValue(end)
        clearInterval(timeout)
      } else {
        setDisplayValue(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timeout)
  }, [value])

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex flex-col items-center justify-center p-3 rounded-lg bg-[#0f172a] border border-[#1e293b] text-slate-100 min-h-24 w-full">
      <motion.div
        className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent text-center"
        key={displayValue}
      >
        {typeof value === 'number' ? displayValue : value}
      </motion.div>
      <div className="text-xs text-slate-400 mt-1.5 font-medium text-center">{label}</div>
    </motion.div>
  )
}

export default function SessionStats() {
  const [history, setHistory] = useState<any[]>([])
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    function loadHistory() {
      try {
        const h = JSON.parse(localStorage.getItem('x_history') || '[]')
        setHistory(h.filter((it: any) => new Date(it.completedAt).toISOString().startsWith(todayKey())))
      } catch {
        setHistory([])
      }
    }

    // Load on mount
    loadHistory()

    // Listen to storage changes for real-time updates
    const handleStorageChange = () => loadHistory()
    window.addEventListener('storage', handleStorageChange)

    // Also update when timer completes (within same tab)
    const checkInterval = setInterval(loadHistory, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(checkInterval)
    }
  }, [])

  const totalPom = history.filter((h) => h.mode === 'work').length
  const totalFocus = Math.round(history.filter((h) => h.mode === 'work').reduce((a, b) => a + (b.duration || 0), 0) / 60)

  useEffect(() => {
    if (!history.length) {
      setStreak(0)
      return
    }

    const days = Array.from(
      new Set(history.map((h) => new Date(h.completedAt).toISOString().slice(0, 10)))
    ).sort()

    let count = 0
    let prev: string | null = null

    for (let i = days.length - 1; i >= 0; i--) {
      if (prev === null) {
        prev = days[i]
        count = 1
      } else {
        const diff = (new Date(prev).getTime() - new Date(days[i]).getTime()) / (1000 * 60 * 60 * 24)
        if (diff === 1) {
          count++
          prev = days[i]
        } else break
      }
    }
    setStreak(count)
  }, [history])

  return (
    <div className="space-y-4 w-full">
      {/* Stats Grid - 3 Equal Columns */}
      <div className="grid grid-cols-3 gap-3 w-full">
        <div className="transition-all duration-200 ease-out hover:border-yellow-300 hover:shadow-[0_0_16px_rgba(255,221,87,0.35)] hover:scale-105">
          <AnimatedNumber value={totalPom} label="Sessions" />
        </div>
        <div className="transition-all duration-200 ease-out hover:border-yellow-300 hover:shadow-[0_0_16px_rgba(255,221,87,0.35)] hover:scale-105">
          <AnimatedNumber value={`${totalFocus}m`} label="Focus Time" />
        </div>
        <div className="transition-all duration-200 ease-out hover:border-yellow-300 hover:shadow-[0_0_16px_rgba(255,221,87,0.35)] hover:scale-105">
          <AnimatedNumber value={streak} label="Streak 🔥" />
        </div>
      </div>

      {/* Date Info */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-3 rounded-lg bg-[#0f172a] border border-[#1e293b] text-slate-100 text-center text-xs transition-all duration-200 ease-out hover:border-yellow-300 hover:shadow-[0_0_16px_rgba(255,221,87,0.35)] hover:scale-105">
        <span className="font-medium">Today: </span>
        <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
      </motion.div>
    </div>
  )
}
