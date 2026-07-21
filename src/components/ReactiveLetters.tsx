'use client'

import { MouseEvent, PointerEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'

const ambientLetters = 'LINGIMOCLINICALLANGUAGELEARNFLOW'.split('')
const words = ['learn', 'speak', 'hello', 'flow', 'calm', 'focus', 'bright']

type Burst = {
  id: number
  word: string
  x: number
  y: number
}

export default function ReactiveLetters() {
  const [bursts, setBursts] = useState<Burst[]>([])
  const fieldRef = useRef<HTMLDivElement>(null)
  const lastBloom = useRef({ time: 0, x: 0, y: 0 })
  const letters = useMemo(
    () =>
      ambientLetters.map((letter, index) => ({
        letter,
        left: `${8 + ((index * 17) % 84)}%`,
        top: `${10 + ((index * 23) % 76)}%`,
        delay: `${-(index % 9) * 0.8}s`,
        size: `${0.72 + (index % 4) * 0.1}rem`,
      })),
    [],
  )

  const bloomAt = useCallback((clientX: number, clientY: number) => {
    const rect = fieldRef.current?.getBoundingClientRect()

    if (!rect) {
      return
    }

    const now = Date.now()
    const x = clientX - rect.left
    const y = clientY - rect.top

    if (now - lastBloom.current.time < 140 && Math.abs(x - lastBloom.current.x) < 8 && Math.abs(y - lastBloom.current.y) < 8) {
      return
    }

    lastBloom.current = { time: now, x, y }
    const id = Date.now()
    const next = {
      id,
      word: words[id % words.length],
      x,
      y,
    }

    setBursts((items) => [...items.slice(-5), next])
    window.setTimeout(() => {
      setBursts((items) => items.filter((item) => item.id !== id))
    }, 2100)
  }, [])

  useEffect(() => {
    const handleHeroTouch = (event: globalThis.PointerEvent | globalThis.MouseEvent) => {
      const field = fieldRef.current
      const hero = field?.closest('.hero-pod')

      if (!field || !hero || !hero.contains(event.target as Node)) {
        return
      }

      bloomAt(event.clientX, event.clientY)
    }

    document.addEventListener('pointerdown', handleHeroTouch, { passive: true })
    document.addEventListener('click', handleHeroTouch, { passive: true })

    return () => {
      document.removeEventListener('pointerdown', handleHeroTouch)
      document.removeEventListener('click', handleHeroTouch)
    }
  }, [bloomAt])

  const bloom = (event: PointerEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>) => {
    bloomAt(event.clientX, event.clientY)
  }

  return (
    <div ref={fieldRef} className="letter-field" onPointerDown={bloom} onClick={bloom} aria-hidden="true">
      <div className="letter-grid" />
      {letters.map((item, index) => (
        <span
          key={`${item.letter}-${index}`}
          className="ambient-letter"
          style={{
            left: item.left,
            top: item.top,
            animationDelay: item.delay,
            fontSize: item.size,
          }}
        >
          {item.letter}
        </span>
      ))}
      {bursts.map((burst) => (
        <span
          key={burst.id}
          className="word-burst"
          style={{
            left: burst.x,
            top: burst.y,
          }}
        >
          {burst.word.split('').map((letter, index) => (
            <span key={`${burst.id}-${letter}-${index}`} style={{ animationDelay: `${index * 70}ms` }}>
              {letter}
            </span>
          ))}
        </span>
      ))}
    </div>
  )
}
