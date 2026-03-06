"use client"
import React from 'react'

export default function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <div onClick={onClick} className="relative flex flex-col items-start gap-2 select-none cursor-pointer group logo-compact">
      <span
        className="text-white text-[34px] leading-none transform -rotate-2 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_10px_rgba(255,255,255,0.8),0_0_18px_rgba(255,221,87,0.7)]"
        style={{
          fontFamily: "'Great Vibes', cursive",
          textShadow: '0 2px 4px rgba(0,0,0,0.12), 0 6px 18px rgba(0,0,0,0.06)',
          letterSpacing: '-0.6px',
        }}
      >
        Xhaandora
      </span>

      <svg
        viewBox="0 0 800 100"
        className="absolute -bottom-4 left-[14%] w-[70%] h-[38px] text-white transition-colors duration-300 group-hover:text-yellow-300"
        fill="none"
        stroke="currentColor"
        strokeWidth={5}
        strokeLinecap="round"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,60 Q400,10 800,60"
          style={{
            strokeDasharray: 800,
            strokeDashoffset: 800,
            animation: 'drawPath 1.8s ease forwards',
            filter: 'drop-shadow(0 0 8px rgba(255,221,87,0.18))',
          }}
        />
      </svg>
    </div>
  )
}
