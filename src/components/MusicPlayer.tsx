"use client"
import React, { useEffect, useRef, useState } from 'react'
import { motion } from '@/lib/motion'

export default function MusicPlayer({ onLevel }: { onLevel?: (v: number) => void }) {
  const sounds: Record<string, string> = {
    waves: '/sounds/sea-waves.mp3',
    wind: '/sounds/wind-leaves.mp3',
    river: '/sounds/river-flow.mp3',
    birds: '/sounds/birds-forest.mp3',
    productivity: '/sounds/productivity-music.mp3',
  }

  const soundOptions: { id: string; label: string }[] = [
    { id: 'waves', label: 'Sea Waves' },
    { id: 'wind', label: 'Wind in Trees' },
    { id: 'river', label: 'River Flow' },
    { id: 'birds', label: 'Birds (Forest)' },
    { id: 'productivity', label: 'Productivity Mix' },
  ]

  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.6)
  const [selectedSound, setSelectedSound] = useState<string>('waves')
  const [duration, setDuration] = useState<number>(25)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioElementRef = useRef<HTMLAudioElement | null>(null) 
  const analyserRef = useRef<AnalyserNode | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const rafRef = useRef<number | null>(null)
  const timeoutRef = useRef<number | null>(null)

  
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (ctxRef.current) {
        try {
          ctxRef.current.close()
        } catch {}
        ctxRef.current = null
      }
    }
  }, [])

  
  useEffect(() => {
    if (!analyserRef.current) return
    const buf = new Uint8Array(analyserRef.current.frequencyBinCount)
    const loop = () => {
      analyserRef.current!.getByteFrequencyData(buf)
      const sum = buf.reduce((a, b) => a + b, 0)
      const avg = sum / buf.length / 255
      onLevel?.(avg)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [analyserRef.current])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
    if (audioElementRef.current) audioElementRef.current.volume = volume
  }, [volume])

  const stopAmbient = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (audioElementRef.current) {
      audioElementRef.current.pause()
    }
    setPlaying(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    if (ctxRef.current) {
      try {
        ctxRef.current.close()
      } catch {}
      ctxRef.current = null
    }
    analyserRef.current = null
  }

  const startAmbient = async () => {
    stopAmbient()
    const srcUrl = sounds[selectedSound]
    if (!srcUrl) return
    const audio = new Audio(srcUrl)
    audio.crossOrigin = 'anonymous'
    audio.loop = true
    audio.volume = volume
    audioRef.current = audio

    try {
      await audio.play()
      setPlaying(true)
    } catch (e) {
      console.warn('Ambient play failed', e)
      
      startGeneratedAmbient(selectedSound)
      return
    }

    
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      ctxRef.current = ctx
      const src = ctx.createMediaElementSource(audio)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      src.connect(analyser)
      analyser.connect(ctx.destination)
      analyserRef.current = analyser
    } catch (e) {
      console.warn('AudioContext failed', e)
    }

    
    timeoutRef.current = window.setTimeout(() => {
      stopAmbient()
    }, duration * 60 * 1000)
  }

  
  const playMusic = async () => {
    
    if (!audioElementRef.current) return
    try {
      audioElementRef.current.currentTime = 0
      audioElementRef.current.volume = volume
      await audioElementRef.current.play()
      setPlaying(true)

      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = window.setTimeout(() => {
        stopMusic()
      }, duration * 60 * 1000)
    } catch (err) {
      console.error('Audio play failed:', err)
    }
  }

  const stopMusic = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause()
      audioElementRef.current.currentTime = 0
    }
    setPlaying(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const filterRef = useRef<BiquadFilterNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  const startGeneratedAmbient = async (type: string) => {
    stopAmbient()
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      ctxRef.current = ctx

      
      const bufferSize = ctx.sampleRate
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.2

      const src = ctx.createBufferSource()
      src.buffer = buffer
      src.loop = true
      sourceRef.current = src

      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.Q.value = 0.7
      filterRef.current = filter

      const gain = ctx.createGain()
      gain.gain.value = volume * 0.6
      gainNodeRef.current = gain

      
      switch (type) {
        case 'waves':
          filter.frequency.value = 800
          gain.gain.value = volume * 0.5
          break
        case 'wind':
          filter.frequency.value = 1200
          gain.gain.value = volume * 0.45
          break
        case 'river':
          filter.frequency.value = 1000
          gain.gain.value = volume * 0.5
          break
        case 'birds':
          filter.frequency.value = 3000
          gain.gain.value = volume * 0.35
          break
        default:
          filter.frequency.value = 1000
      }

      src.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      
      try {
        const analyser = ctx.createAnalyser()
        filter.connect(analyser)
        analyserRef.current = analyser
      } catch (e) {}

      src.start()
      setPlaying(true)

      timeoutRef.current = window.setTimeout(() => {
        stopAmbient()
      }, duration * 60 * 1000)
    } catch (e) {
      console.warn('generated ambient failed', e)
    }
  }

  const toggle = async () => {
    
    if (selectedSound === 'productivity') {
      if (!playing) await playMusic()
      else stopMusic()
      return
    }

    if (!playing) await startAmbient()
    else stopAmbient()
  }

  const baseBtn = 'px-4 py-2 rounded-lg font-semibold transition-all duration-200 ease-out cursor-pointer active:scale-95'
  const playBtn = `${baseBtn} bg-emerald-500 text-white hover:bg-emerald-400 hover:shadow-[0_0_12px_rgba(16,185,129,0.6)]`

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-5 shadow-md transition-all duration-300 text-slate-100 hover:shadow-[0_0_18px_rgba(0,255,200,0.25)] hover:border-teal-400">
      {}
      <link rel="preload" as="audio" href="/sounds/sea-waves.mp3" />
      <link rel="preload" as="audio" href="/sounds/wind-leaves.mp3" />
      <link rel="preload" as="audio" href="/sounds/river-flow.mp3" />
      <link rel="preload" as="audio" href="/sounds/birds-forest.mp3" />
      <link rel="preload" as="audio" href="/sounds/productivity-music.mp3" />

      {}
      <audio ref={audioElementRef} src="/sounds/productivity-music.mp3" preload="auto" loop />

      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-semibold text-slate-100">🎵 Focus Music</div>
        <motion.button onClick={toggle} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className={playBtn}>
          {playing ? '⏸' : '▶'}
          <span className="ml-2 text-sm">{playing ? 'Pause' : 'Play'}</span>
        </motion.button>
      </div>

      <div className="flex items-center gap-4">
        <select
          value={selectedSound}
          onChange={(e) => setSelectedSound(e.target.value)}
          className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
        >
          {soundOptions.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>

        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-28 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
        >
          <option value={10}>10 min</option>
          <option value={25}>25 min</option>
        </select>

        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="flex-1 h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-teal-400"
          style={{
            background: `linear-gradient(to right, rgb(20, 184, 166), rgb(20, 184, 166)) 0% ${volume * 100}% / ${volume * 100}% 100%, rgb(55, 65, 81) ${volume * 100}% 100% / ${(1 - volume) * 100}% 100%`
          }}
        />
        <span className="text-xs text-slate-400 font-medium min-w-[2.5rem]">{Math.round(volume * 100)}%</span>
      </div>
    </div>
  )
}
