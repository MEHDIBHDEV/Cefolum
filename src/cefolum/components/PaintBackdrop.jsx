import React from 'react'

export default function PaintBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#0b0b0f]">
      <div className="absolute -top-32 -left-24 h-[32rem] w-[32rem] rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-rose-400 opacity-25 blur-3xl mix-blend-screen" />
      <div className="absolute top-[45%] -right-40 h-[36rem] w-[36rem] rounded-full bg-gradient-to-tl from-cyan-400 via-sky-500 to-violet-500 opacity-20 blur-3xl mix-blend-screen" />
      <div className="absolute -bottom-20 left-1/3 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 opacity-20 blur-3xl mix-blend-screen" />
      <div className="absolute inset-0 opacity-[0.07] mix-blend-screen">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>
    </div>
  )
}
