"use client"
import React, { useEffect, useState } from 'react'

export default function SettingsPanel() {
  const [open, setOpen] = useState(false)
  const [work, setWork] = useState(() => Number(localStorage.getItem('x_work') || 1500))
  const [brk, setBrk] = useState(() => Number(localStorage.getItem('x_break') || 300))

  useEffect(() => {
    localStorage.setItem('x_work', String(work))
  }, [work])
  useEffect(() => {
    localStorage.setItem('x_break', String(brk))
  }, [brk])

  return (
    <div>
      <button onClick={() => setOpen((s) => !s)} className="px-3 py-2 bg-slate-200 rounded">
        Settings
      </button>
      {open && (
        <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-800 rounded">
          <div className="flex flex-col gap-2">
            <label>Work minutes</label>
            <input type="number" value={Math.round(work / 60)} onChange={(e) => setWork(Number(e.target.value) * 60)} />
            <label>Break minutes</label>
            <input type="number" value={Math.round(brk / 60)} onChange={(e) => setBrk(Number(e.target.value) * 60)} />
            <label>Theme</label>
            <div className="flex gap-2">
              <button onClick={() => document.documentElement.classList.remove('dark')} className="px-2 py-1 bg-slate-100 rounded">
                Light
              </button>
              <button onClick={() => document.documentElement.classList.add('dark')} className="px-2 py-1 bg-slate-800 text-white rounded">
                Dark
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
