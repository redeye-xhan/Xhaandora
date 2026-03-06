'use client'

import Navigation from "@/components/Navigation"
import { motion } from '@/lib/motion'
import Timer from "@/components/Timer"
import SessionStats from "@/components/SessionStats"
import PomodoroBadge from '@/components/PomodoroBadge'
import MusicPlayer from "@/components/MusicPlayer"
import DailyStats from "@/components/SessionStats"
import DailyPlan from "@/components/DailyPlan"
import Tasks from "@/components/Tasks"
import Community from "@/components/CommunityHighFives"

export default function Page() {
  return (
    <div className="w-screen h-screen bg-[#0b1220] text-white flex items-center justify-center overflow-visible">
      <div className="relative z-10 w-full h-full grid grid-cols-[260px_1fr_340px] gap-6 max-w-[1800px] mx-auto px-6 py-6">

        {/* LEFT SIDEBAR */}
        <aside className="flex flex-col gap-6 bg-[#0f172a] rounded-2xl p-5 border border-[#1e293b] overflow-y-auto">
          <Navigation />
        </aside>

        {/* CENTER TIMER */}
        <main className="flex items-center justify-center bg-[#0f172a] rounded-3xl border border-[#1e293b] shadow-[0_0_60px_rgba(0,255,200,0.15)] p-6 overflow-visible">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-20 w-full max-w-[900px] min-h-[420px] flex flex-col items-center justify-center gap-6 p-6">
            <Timer />
            <PomodoroBadge />
            <SessionStats />
            <MusicPlayer />
          </motion.div>
        </main>

        {/* RIGHT PANEL */}
        <aside className="relative z-10 flex flex-col gap-6 overflow-y-auto">
          <DailyStats />
          <DailyPlan />
          <Tasks />
          <Community />
        </aside>

      </div>
    </div>
  )
}
