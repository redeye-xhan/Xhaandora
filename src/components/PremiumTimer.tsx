"use client"
import React, { useEffect, useMemo, useState, useRef } from 'react'
import useTimer from '@/hooks/useTimer'
import { playBell, playStart, playStop } from '@/lib/audio'
import { motion } from '@/lib/motion'
import gsap from 'gsap'

function formatTime(s: number) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = Math.floor(s % 60)
  return {
    h: String(h).padStart(2, '0'),
    m: String(m).padStart(2, '0'),
    s: String(sec).padStart(2, '0')
  }
}

export default function PremiumTimer() {
  const t = useTimer(25 * 60, 5 * 60)
  const [wakeLock, setWakeLock] = useState<any>(null)
  const timerRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<SVGCircleElement>(null)
   

  const pct = useMemo(() => {
    const total = t.mode === 'work' ? t.workDuration : t.breakDuration
    return Math.max(0, Math.min(100, Math.round(((total - t.remaining) / total) * 100)))
  }, [t.remaining, t.mode, t.workDuration, t.breakDuration])

  
  useEffect(() => {
    if (circleRef.current) {
       const circumference = 2 * Math.PI * 54;
       gsap.to(circleRef.current, { strokeDashoffset: circumference * (1 - pct / 100), duration: 0.5, ease: 'power2.out' });
    }
  }, [pct])

  
   

  
  useEffect(() => {
    if (t.remaining <= 0 && !t.running && t.remaining < (t.mode === 'work' ? t.workDuration : t.breakDuration)) {
      playBell(0.5)
      if (Notification && Notification.permission === 'granted') {
        const message = t.mode === 'work' ? '✨ Work session complete! Time for a break.' : '🚀 Break finished! Ready to focus?'
        new Notification(message)
      }
    }
  }, [t.remaining])

  
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.code === 'Space') {
        e.preventDefault()
        if (t.running) {
          t.pause()
          playStop(0.5)
        } else {
          t.start()
          playStart(0.6)
        }
      }
      if (e.key === 'r' || e.key === 'R') t.reset()
      if (e.key === '1') t.reset('work')
      if (e.key === '2') t.reset('break')
      if (e.key === 'd' || e.key === 'D') document.documentElement.classList.toggle('dark')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [t])

  
  useEffect(() => {
    if (Notification && Notification.permission !== 'granted') {
      Notification.requestPermission().catch(() => {})
    }
  }, [])

  
  async function enableWakeLock() {
    try {
      
      const wl = await (navigator as any).wakeLock.request('screen')
      setWakeLock(wl)
      wl.addEventListener('release', () => setWakeLock(null))
    } catch (e) {
      console.warn('Wake lock failed', e)
    }
  }

  const { h, m, s } = formatTime(t.remaining)
  const accentColor = t.mode === 'work' ? '#00d4aa' : '#3b82f6'

  return (
     <div className="flex flex-col items-center justify-center gap-6 w-full">
      {}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className={`inline-block px-4 py-2 rounded-full font-semibold text-sm ${
          t.mode === 'work'
            ? 'bg-teal-500/20 border border-teal-400/30 text-teal-300'
            : 'bg-blue-500/20 border border-blue-400/30 text-blue-300'
        }`}>
          {t.mode === 'work' ? '🎯 Focus Session' : '☕ Break Time'}
        </div>
      </motion.div>

      {}
      <div className="relative flex items-center justify-center w-[400px] h-[400px]">
        <motion.svg
          width="100%"
          height="100%"
          viewBox="0 0 120 120"
          className="absolute w-full h-full opacity-30 transform -rotate-90"
          preserveAspectRatio="xMidYMid meet"
        >
          {}
          <circle
            cx="60"
            cy="60"
            r="54"
            stroke="rgba(100, 116, 139, 0.3)"
            strokeWidth="3"
            fill="none"
          />
          
          {}
          <circle
            ref={circleRef}
            cx="60"
            cy="60"
            r="54"
            stroke={accentColor}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={2 * Math.PI * 54}
            strokeDashoffset={2 * Math.PI * 54}
            style={{
              filter: 'drop-shadow(0 0 18px rgba(45,212,191,0.6))',
              opacity: 1
            }}
          />
        </motion.svg>

        {}
        {Number.isFinite(t.remaining) && (
         <div className="text-[120px] font-black tracking-widest text-teal-400">
              {h}:{m}:{s}
            </div>
        )}
      </div>

      {}
      <div className="flex items-center justify-center gap-10 text-base text-slate-300">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <div className="text-base font-bold text-teal-400">{pct}%</div>
          <div className="text-base font-semibold text-slate-300 mt-1">Progress</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <div className="text-base font-bold text-teal-400">{t.pomodoroCount}</div>
          <div className="text-base font-semibold text-slate-300 mt-1">Completed</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="text-base font-bold text-teal-400">
            {t.pomodoroCount > 0 ? Math.round((t.pomodoroCount * 25) / 60) : 0}h
          </div>
          <div className="text-base font-semibold text-slate-300 mt-1">Focus Time</div>
        </motion.div>
      </div>

      {}
      <div className="flex gap-4 w-full justify-center flex-wrap">
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (t.running) {
              t.pause()
              playStop(0.5)
            } else {
              t.start()
              playStart(0.6)
            }
          }}
          className="h-12 btn-premium btn-primary text-sm font-medium flex items-center justify-center px-6 rounded-xl"
        >
          <span className="w-4 h-4 mr-2 flex items-center justify-center text-lg">{t.running ? '⏸' : '▶'}</span>
          {t.running ? 'Pause' : 'Start'}
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            t.reset()
            playStop(0.45)
          }}
          className="h-12 btn-premium btn-secondary text-sm font-medium flex items-center justify-center px-6 rounded-xl"
        >
          <span className="w-4 h-4 mr-2 text-lg">↻</span>
          Reset
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => t.addTime(5 * 60)}
          className="h-12 btn-premium bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400 font-medium text-sm flex items-center justify-center px-6 rounded-xl"
        >
          <span className="w-4 h-4 mr-2 text-lg">➕</span>
          +5 min
        </motion.button>
        
        <motion.button
          whileHover={t.mode === 'break' ? { scale: 1.03, y: -1 } : {}}
          whileTap={t.mode === 'break' ? { scale: 0.95 } : {}}
          onClick={() => t.skipBreak()}
          disabled={t.mode !== 'break'}
          className="h-12 btn-premium bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400 font-medium text-sm flex items-center justify-center px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="w-4 h-4 mr-2 text-lg">⏭</span>
          Skip Break
        </motion.button>
      </div>

      {}
      {!wakeLock ? (
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.95 }}
          onClick={enableWakeLock}
          className="w-full max-w-[550px] h-12 btn-premium bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-600 dark:text-yellow-400 font-medium text-sm flex items-center justify-center gap-2 px-6 rounded-xl"
        >
          <span className="w-5 h-5 text-lg">🔒</span>
          Keep Screen Awake
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-[550px] h-12 flex items-center justify-center gap-2 px-6 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium"
        >
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Screen locked
        </motion.div>
      )}
    </div>
  )
}
