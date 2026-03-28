'use client'

import { memo, useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import type { EmergingLabelProps, LabelStatus } from './types'

// Status dot colors — semantic and legible at small size
const STATUS_COLOR: Record<LabelStatus, string> = {
  ok:      '#4ADE80',
  warning: '#FBBF24',
  alert:   '#F87171',
  neutral: '#93C5FD',
}

/**
 * A label that cycles between hidden and visible states on a timer loop.
 * Most of the time it is invisible; it surfaces briefly, then retreats.
 *
 * Timing:
 *   delay  →  show for activeDuration  →  hide for idleDuration  →  repeat
 */
const EmergingLabel = memo(function EmergingLabel({
  text,
  status = 'neutral',
  activeDuration = 2800,
  idleDuration = 5500,
  delay = 0,
}: EmergingLabelProps) {
  const shouldReduceMotion = useReducedMotion()
  const [visible, setVisible] = useState(false)
  // Single ref tracks the current active setTimeout ID so cleanup is exact
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (shouldReduceMotion) return

    let mounted = true

    function clearTimer() {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }

    // Each cycle: surface → sink → surface → …
    function show() {
      if (!mounted) return
      setVisible(true)
      timerRef.current = setTimeout(() => {
        if (!mounted) return
        setVisible(false)
        timerRef.current = setTimeout(() => {
          if (!mounted) return
          show()
        }, idleDuration)
      }, activeDuration)
    }

    // Initial delay before first appearance; fall back to idleDuration if
    // delay is 0 so the page fully paints before anything pops up
    timerRef.current = setTimeout(show, delay > 0 ? delay : idleDuration)

    return () => {
      mounted = false
      clearTimer()
    }
  }, [shouldReduceMotion, activeDuration, idleDuration, delay])

  const dotColor = STATUS_COLOR[status]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="label"
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          exit={{    opacity: 0, y: -6, scale: 0.985 }}
          transition={{ duration: 0.42, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            display:        'inline-flex',
            alignItems:     'center',
            gap:            6,
            padding:        '4px 10px 4px 8px',
            borderRadius:   6,
            background:     'rgba(8, 12, 20, 0.56)',
            border:         '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            color:          'rgba(255,255,255,0.94)',
            fontSize:       11,
            fontFamily:     'var(--font-sans, ui-sans-serif, system-ui, sans-serif)',
            fontWeight:     500,
            letterSpacing:  '0.04em',
            whiteSpace:     'nowrap',
            userSelect:     'none',
          }}
        >
          {/* Status indicator dot */}
          <span
            style={{
              width:      5,
              height:     5,
              borderRadius: '50%',
              background:   dotColor,
              boxShadow:    `0 0 6px ${dotColor}`,
              flexShrink:   0,
            }}
          />
          {text}
        </motion.div>
      )}
    </AnimatePresence>
  )
})

export default EmergingLabel
