"use client"
import React from 'react'

export default function Controls({ start, pause, reset, running }: any) {
  return (
    <div className="flex gap-2">
      <button onClick={start} className="px-3 py-2 bg-emerald-500 text-white rounded">
        Start
      </button>
      <button onClick={pause} className="px-3 py-2 bg-yellow-400 rounded">
        Pause
      </button>
      <button onClick={reset} className="px-3 py-2 bg-slate-200 rounded">
        Reset
      </button>
    </div>
  )
}
