"use client"
import React, { useEffect, useMemo, useState } from 'react'
import useTimer from '../hooks/useTimer'
import { playBell } from '../lib/audio'
import { motion } from '@/lib/motion'

function formatTime(s: number) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = Math.floor(s % 60)
  return [h, m, sec]
    .map((n) => String(n).padStart(2, '0'))
    .join(':')
}

export default function Timer() {
  const t = useTimer(25 * 60, 5 * 60)
  const [volume, setVolume] = useState(0.7)
  const [wakeLock, setWakeLock] = useState<any>(null)
  const [noteText, setNoteText] = useState('')
  const [lastSessionId, setLastSessionId] = useState<number | null>(null)
  const [showSessionModal, setShowSessionModal] = useState(false)
  const [sessionRating, setSessionRating] = useState(0)

  useEffect(() => {
    if (!t.running && t.remaining === (t.mode === 'work' ? t.workDuration : t.breakDuration)) return
    if (t.remaining <= 0) {
      playBell(volume)
      
      if (Notification && Notification.permission === 'granted') {
        new Notification(t.mode === 'work' ? 'Work session finished' : 'Break finished')
      }
      
      if (t.mode === 'work') {
        setShowSessionModal(true)
        setSessionRating(0)
        setNoteText('')
      }
    }
  }, [t.remaining])

  useEffect(() => {
    if (Notification && Notification.permission !== 'granted') {
      Notification.requestPermission().catch(() => {})
    }
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.code === 'Space') {
        e.preventDefault()
        t.running ? t.pause() : t.start()
      }
      if (e.key === 'r' || e.key === 'R') t.reset()
      if (e.key === '1') t.reset('work')
      if (e.key === '2') t.reset('break')
      if (e.key === 'd' || e.key === 'D') document.documentElement.classList.toggle('dark')
      if (e.key === 's' || e.key === 'S') {
        
        console.log('Settings toggle')
      }
      if (e.key === 't' || e.key === 'T') {
        
        const taskInput = document.querySelector('input[placeholder*="Add a task"]') as HTMLInputElement
        if (taskInput) taskInput.focus()
      }
      if (e.key === 'f' || e.key === 'F') {
        
        document.body.classList.toggle('focus-mode')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [t])

  async function enableWakeLock() {
    try {
      
      const wl = await (navigator as any).wakeLock.request('screen')
      setWakeLock(wl)
      wl.addEventListener('release', () => setWakeLock(null))
    } catch (e) {
      console.warn('Wake lock failed', e)
    }
  }

  const pct = useMemo(() => {
    const total = t.mode === 'work' ? t.workDuration : t.breakDuration
    return Math.max(0, Math.min(100, Math.round(((total - t.remaining) / total) * 100)))
  }, [t.remaining, t.mode, t.workDuration, t.breakDuration])

  const [h, m, s] = formatTime(t.remaining).split(':') as string[]
  const soundOptions = ['Bell', 'Digital beep', 'Wood block', 'Soft chime']
  const [sound, setSound] = useState('Bell')

  const baseBtn = 'px-4 py-2 rounded-lg font-semibold transition-all duration-200 ease-out cursor-pointer active:scale-95'
  const startBtn = `${baseBtn} bg-emerald-500 text-white hover:bg-emerald-400 hover:shadow-[0_0_12px_rgba(16,185,129,0.6)]`
  const pauseBtn = `${baseBtn} bg-yellow-400 text-white hover:bg-yellow-300`
  const neutralBtn = `${baseBtn} bg-slate-800 text-slate-200 hover:bg-slate-700`
  const smallBtn = `${baseBtn} bg-transparent text-slate-300 hover:bg-slate-800 px-3 py-1 rounded-md`

  return (
    <div className="timer-container flex flex-col items-center gap-4">
      <motion.div
        initial={{ scale: 0.98 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 120 }}
      >
        <div className="flex flex-col items-center">
        <div className="text-sm text-slate-500 mb-2">{t.mode === 'work' ? 'Work Session' : 'Break Session'}</div>
        <div className="relative overflow-visible">
          <svg width="220" height="220" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" stroke="rgba(15,23,42,0.06)" strokeWidth="12" fill="none" />
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="var(--accent)"
              strokeWidth="12"
              strokeDasharray={`${Math.PI * 2 * 54}`}
              strokeDashoffset={`${Math.PI * 2 * 54 * (1 - pct / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              fill="none"
            />
          </svg>

          <div className="flex items-center justify-center w-full overflow-visible">
            <div className="text-[120px] md:text-[140px] font-extrabold tracking-widest text-teal-400 leading-none text-center select-none">{`${h}:${m}:${s}`}</div>
          </div>
        </div>
        
        <div className="w-full max-w-xs mt-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">Progress: {pct}%</div>
            <div className="text-xs text-slate-500">Pomodoros: {t.pomodoroCount}</div>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded mt-2 overflow-hidden">
            <div className="h-full" style={{ width: `${pct}%`, background: 'var(--accent)', transition: 'width 0.4s' }} />
          </div>
        </div>
        </div>
      </motion.div>

      <div className="flex gap-3 flex-wrap justify-center">
        <motion.div whileHover={{ scale: 1.05, y: -2 }} transition={{ duration: 0.2 }}>
          <button onClick={() => { if (!t.running) playBell(volume); t.start() }} className={`${startBtn} hover:scale-105 active:scale-95 transition-transform duration-150`}>
            <span className="relative z-10">Start</span>
          </button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05, y: -2 }} transition={{ duration: 0.2 }}>
          <button onClick={() => t.pause()} className={`${pauseBtn} hover:scale-105 active:scale-95 transition-transform duration-150`}>
            <span className="relative z-10">Pause</span>
          </button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05, y: -2 }} transition={{ duration: 0.2 }}>
          <button onClick={() => t.reset()} className={`${neutralBtn} hover:scale-105 active:scale-95 transition-transform duration-150`}>
            <span className="relative z-10">Reset</span>
          </button>
        </motion.div>
      </div>

      {}
      <div className="flex gap-3 mt-4">
        <motion.div
          whileHover={{ 
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
            scale: 1.05
          }}
          whileTap={{ scale: 0.95 }}
        >
            <button onClick={() => t.addTime(5 * 60)} className={smallBtn}><span className="relative z-10">+5m</span></button>
        </motion.div>
        
        <motion.div
          whileHover={t.mode === 'break' ? { 
            boxShadow: "0 0 20px rgba(147, 51, 234, 0.4)",
            scale: 1.05
          } : {}}
          whileTap={t.mode === 'break' ? { scale: 0.95 } : {}}
        >
            <button onClick={() => t.skipBreak()} className={smallBtn} disabled={t.mode !== 'break'}><span className="relative z-10">Skip Break</span></button>
        </motion.div>
      </div>

      <div className="w-full flex flex-col gap-2 max-w-md">
        <div className="flex items-center justify-between">
          <label className="text-sm">Volume</label>
          <select value={sound} onChange={(e) => setSound(e.target.value)} className="px-2 py-1 border rounded text-sm">
            {soundOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <input type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
        <div className="flex gap-2 text-xs text-slate-500">
          <button onClick={() => enableWakeLock()} className="px-2 py-1 bg-slate-100 rounded">Prevent Sleep</button>
          <button onClick={() => { playBell(volume) }} className="px-2 py-1 bg-slate-100 rounded">Test Bell</button>
        </div>
      </div>
      <div className="mt-4 w-full">
        {lastSessionId && (
          <div className="mt-2 p-2 border rounded">
            <label className="text-sm">Add a note to last session</label>
            <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} className="w-full mt-1 p-2 border rounded" />
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  try {
                    const h = JSON.parse(localStorage.getItem('x_history') || '[]')
                    const idx = h.findIndex((it: any) => it.id === lastSessionId)
                    if (idx >= 0) {
                      h[idx].note = noteText
                      localStorage.setItem('x_history', JSON.stringify(h))
                      setNoteText('')
                      alert('Note saved')
                    }
                  } catch (e) {
                    console.warn(e)
                  }
                }}
                className="px-3 py-1 bg-emerald-500 text-white rounded"
              >
                Save Note
              </button>
              <button onClick={() => setLastSessionId(null)} className="px-3 py-1 bg-slate-200 rounded">Dismiss</button>
            </div>
          </div>
        )}
      </div>
      {showSessionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Session Complete! 🎉</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">How focused were you?</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setSessionRating(star)}
                    className={`text-2xl ${star <= sessionRating ? 'text-yellow-400' : 'text-slate-300'} hover:text-yellow-400 transition-colors`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Session Note (optional)</label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 resize-none"
                rows={3}
                placeholder="What did you work on? Any distractions?"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  
                  try {
                    const hist = JSON.parse(localStorage.getItem('x_history') || '[]')
                    if (hist && hist.length) {
                      const lastSession = hist[0]
                      lastSession.note = noteText.trim() || undefined
                      lastSession.rating = sessionRating || undefined
                      localStorage.setItem('x_history', JSON.stringify(hist))
                    }
                  } catch (e) {
                    console.warn(e)
                  }
                  setShowSessionModal(false)
                }}
                className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
              >
                Save & Continue
              </button>
              <button
                onClick={() => setShowSessionModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg font-medium transition-colors"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
