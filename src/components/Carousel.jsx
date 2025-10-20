import React, { memo, useEffect, useMemo, useRef, useState } from 'react'
import { assetUrl } from '../utils/assetUrl'

function Carousel({ slides = [], interval = 6000, renderOverlay, className = '' }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef(null)
  const pointerStartX = useRef(null)
  const pointerActive = useRef(false)

  const boundedInterval = useMemo(() => Math.max(interval, 3000), [interval])
  const resolvedSlides = useMemo(
    () =>
      slides.map((slide, index) => ({
        ...slide,
        id: slide.id ?? `slide-${index}`,
        image: resolveImage(slide.image),
      })),
    [slides]
  )

  useEffect(() => {
    clearInterval(timerRef.current)
    if (resolvedSlides.length <= 1) return undefined

    timerRef.current = setInterval(() => {
      if (!isPaused) {
        setActiveIndex((index) => (index + 1) % resolvedSlides.length)
      }
    }, boundedInterval)

    return () => {
      clearInterval(timerRef.current)
    }
  }, [boundedInterval, isPaused, resolvedSlides.length])

  const goTo = (nextIndex) => {
    if (resolvedSlides.length === 0) return
    const normalized = (nextIndex + resolvedSlides.length) % resolvedSlides.length
    setActiveIndex(normalized)
  }

  const goNext = () => goTo(activeIndex + 1)
  const goPrevious = () => goTo(activeIndex - 1)

  const handlePointerDown = (clientX) => {
    pointerActive.current = true
    pointerStartX.current = clientX
  }

  const handlePointerMove = (clientX) => {
    if (!pointerActive.current || pointerStartX.current === null) return
    const delta = clientX - pointerStartX.current
    if (Math.abs(delta) > 60) {
      pointerActive.current = false
      pointerStartX.current = null
      if (delta > 0) {
        goPrevious()
      } else {
        goNext()
      }
    }
  }

  const handlePointerUp = () => {
    pointerActive.current = false
    pointerStartX.current = null
  }

  return (
    <section
      className={`relative w-full overflow-hidden rounded-3xl border border-white/5 bg-neutral-950 ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="relative h-full w-full touch-pan-y"
        onPointerDown={(event) => handlePointerDown(event.clientX)}
        onPointerMove={(event) => handlePointerMove(event.clientX)}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTouchStart={(event) => {
          if (event.touches?.length) {
            handlePointerDown(event.touches[0].clientX)
          }
        }}
        onTouchMove={(event) => {
          if (event.touches?.length) {
            handlePointerMove(event.touches[0].clientX)
          }
        }}
        onTouchEnd={handlePointerUp}
      >
        <div
          className="flex h-full w-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {resolvedSlides.map((slide, index) => (
            <div key={slide.id} className="relative h-full w-full flex-shrink-0">
              <img
                src={slide.image}
                alt={slide.alt ?? slide.title ?? `Slide ${index + 1}`}
                loading="lazy"
                className="h-full w-full object-cover brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/60 to-transparent" />
            </div>
          ))}
        </div>

        {typeof renderOverlay === 'function' && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center">
            <div className="pointer-events-auto w-full">
              {renderOverlay(resolvedSlides[activeIndex], activeIndex)}
            </div>
          </div>
        )}

        {resolvedSlides.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Precedent"
              className="absolute left-6 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/10 bg-neutral-900/70 p-3 text-white transition hover:border-violet-500/80 hover:bg-neutral-900/90 md:inline-flex"
              onClick={goPrevious}
            >
              <span className="sr-only">Precedent</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.25 19.25 8.75 12l6.5-7.25" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Suivant"
              className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/10 bg-neutral-900/70 p-3 text-white transition hover:border-violet-500/80 hover:bg-neutral-900/90 md:inline-flex"
              onClick={goNext}
            >
              <span className="sr-only">Suivant</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m8.75 19.25 6.5-7.25-6.5-7.25" />
              </svg>
            </button>
          </>
        )}
      </div>

      {resolvedSlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-2">
          {resolvedSlides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={`h-2.5 rounded-full transition ${
                index === activeIndex ? 'w-8 bg-violet-500' : 'w-2.5 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Aller a la diapositive ${index + 1}`}
              aria-current={index === activeIndex}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default memo(Carousel)

function resolveImage(path) {
  if (!path) return ''
  if (/^(https?:)?\/\//i.test(path)) {
    return path
  }
  if (path.startsWith(assetUrl(''))) {
    return path
  }
  return assetUrl(path)
}
