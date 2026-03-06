import { useEffect, useRef, useState } from 'react'

type Mode = 'work' | 'break'

export default function useTimer(
  defaultWork = 25 * 60,
  defaultBreak = 5 * 60,
  defaultLongBreak = 15 * 60,
  defaultCyclesBeforeLong = 4
) {
  const [mode, setMode] = useState<Mode>('work')
  const [remaining, setRemaining] = useState<number>(defaultWork)
  const [running, setRunning] = useState<boolean>(false)
  const [workDuration, setWorkDuration] = useState(defaultWork)
  const [breakDuration, setBreakDuration] = useState(defaultBreak)
  const [longBreakDuration, setLongBreakDuration] = useState(defaultLongBreak)
  const [cyclesBeforeLongBreak, setCyclesBeforeLongBreak] = useState(defaultCyclesBeforeLong)
  const [pomodoroCount, setPomodoroCount] = useState(0)
  const [autoStartNext, setAutoStartNext] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const isClientRef = useRef(false)

  useEffect(() => {
    isClientRef.current = true
    
    setMode((localStorage.getItem('x_mode') as Mode) || 'work')
    const savedRemaining = localStorage.getItem('x_remaining')
    if (savedRemaining) {
      const parsed = Number(savedRemaining)
      if (Number.isFinite(parsed) && parsed > 0) {
        setRemaining(parsed)
      }
    }
    setRunning(localStorage.getItem('x_running') === 'true')
    setWorkDuration(Number(localStorage.getItem('x_work') || defaultWork))
    setBreakDuration(Number(localStorage.getItem('x_break') || defaultBreak))
    setLongBreakDuration(Number(localStorage.getItem('x_long_break') || defaultLongBreak))
    setCyclesBeforeLongBreak(Number(localStorage.getItem('x_cycles') || defaultCyclesBeforeLong))
    setPomodoroCount(Number(localStorage.getItem('x_pomodoro_count') || 0))
    setAutoStartNext(localStorage.getItem('x_autostart') === 'true')
  }, [])

  useEffect(() => {
    if (isClientRef.current) localStorage.setItem('x_mode', mode)
  }, [mode])
  useEffect(() => {
    if (isClientRef.current) localStorage.setItem('x_remaining', String(remaining))
  }, [remaining])
  useEffect(() => {
    if (isClientRef.current) localStorage.setItem('x_running', String(running))
  }, [running])
  useEffect(() => {
    if (isClientRef.current) localStorage.setItem('x_work', String(workDuration))
  }, [workDuration])
  useEffect(() => {
    if (isClientRef.current) localStorage.setItem('x_break', String(breakDuration))
  }, [breakDuration])
  useEffect(() => {
    if (isClientRef.current) localStorage.setItem('x_long_break', String(longBreakDuration))
  }, [longBreakDuration])
  useEffect(() => {
    if (isClientRef.current) localStorage.setItem('x_cycles', String(cyclesBeforeLongBreak))
  }, [cyclesBeforeLongBreak])
  useEffect(() => {
    if (isClientRef.current) localStorage.setItem('x_pomodoro_count', String(pomodoroCount))
  }, [pomodoroCount])
  useEffect(() => {
    if (isClientRef.current) localStorage.setItem('x_autostart', String(autoStartNext))
  }, [autoStartNext])

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => {
        setRemaining((r) => {
          const next = r - 1
          return Number.isFinite(next) ? next : (mode === 'work' ? defaultWork : defaultBreak)
        })
      }, 1000)
    }
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [running, mode, defaultWork, defaultBreak])

  useEffect(() => {
    if (remaining <= 0 && isClientRef.current) {
      
      try {
        const history = JSON.parse(localStorage.getItem('x_history') || '[]')
        history.unshift({
          id: Date.now(),
          mode,
          duration: mode === 'work' ? workDuration : breakDuration,
          completedAt: Date.now()
        })
        localStorage.setItem('x_history', JSON.stringify(history.slice(0, 1000)))
      } catch {}

      if (mode === 'work') {
        const nextPom = pomodoroCount + 1
        setPomodoroCount(nextPom)
        
        if (nextPom % cyclesBeforeLongBreak === 0) {
          setMode('break')
          setRemaining(longBreakDuration)
        } else {
          setMode('break')
          setRemaining(breakDuration)
        }
      } else {
        setMode('work')
        setRemaining(workDuration)
      }

      setRunning(autoStartNext)
    }
  }, [remaining, mode, breakDuration, workDuration, longBreakDuration, pomodoroCount, cyclesBeforeLongBreak, autoStartNext])

  const start = () => setRunning(true)
  const pause = () => setRunning(false)
  const reset = (to?: Mode) => {
    const newMode = to || mode
    setMode(newMode)
    setRemaining(newMode === 'work' ? workDuration : breakDuration)
    setRunning(false)
  }

  const addTime = (seconds: number) => {
    setRemaining((r) => r + seconds)
  }

  const skipBreak = () => {
    if (mode === 'break') {
      setMode('work')
      setRemaining(workDuration)
      setRunning(true)
    }
  }

  const clearHistory = () => {
    if (isClientRef.current) localStorage.removeItem('x_history')
  }

  return {
    mode,
    remaining,
    running,
    start,
    pause,
    reset,
    setWorkDuration,
    setBreakDuration,
    workDuration,
    breakDuration,
    setMode,
    longBreakDuration,
    setLongBreakDuration,
    cyclesBeforeLongBreak,
    setCyclesBeforeLongBreak,
    pomodoroCount,
    setPomodoroCount,
    autoStartNext,
    setAutoStartNext,
    clearHistory,
    addTime,
    skipBreak
  }
}
