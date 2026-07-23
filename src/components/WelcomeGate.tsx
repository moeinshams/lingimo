'use client'

import { useEffect, useState } from 'react'
import LingimoMark from '@/components/LingimoMark'

export default function WelcomeGate() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 2350)
    return () => window.clearTimeout(timer)
  }, [])

  if (!visible) {
    return null
  }

  return (
    <div className="welcome-gate" aria-hidden="true">
      <div className="gate-panel gate-panel-left" />
      <div className="gate-panel gate-panel-right" />
      <div className="gate-scanline" />
      <div className="gate-content">
        <LingimoMark size="lg" />
        <p>INITIALIZING LINGIMO</p>
      </div>
    </div>
  )
}
