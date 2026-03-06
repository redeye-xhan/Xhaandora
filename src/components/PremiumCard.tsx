"use client"
import React from 'react'
import { motion } from 'framer-motion'

interface PremiumCardProps {
  title: string
  icon?: string
  children: React.ReactNode
  className?: string
  glowing?: boolean
}

export default function PremiumCard({
  title,
  icon,
  children,
  className = '',
  glowing = false
}: PremiumCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
      className={`w-full rounded-xl p-5 backdrop-blur-xl border border-slate-700/60 bg-slate-800/70 shadow-[0_0_40px_rgba(20,184,166,0.15)] hover:shadow-[0_0_50px_rgba(20,184,166,0.25)] transition-all duration-300 hover:scale-[1.02] ${glowing ? 'animate-pulse-glow' : ''} ${className}`}
    >
      {}
      {(title || icon) && (
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700/60">
          {icon && <span className="text-2xl">{icon}</span>}
          <h3 className="font-semibold text-lg bg-gradient-to-r from-teal-400 via-green-400 to-cyan-400 bg-clip-text text-transparent">
            {title}
          </h3>
        </div>
      )}

      {}
      <div className="space-y-4">
        {children}
      </div>
    </motion.div>
  )
}
