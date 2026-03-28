'use client'

import { memo, useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotionSafe } from './useReducedMotionSafe'
import type { EmergingLabelProps, LabelStatus } from './types'

const STATUS_COLOR: Record<LabelStatus, string> = {
  ok:      '#4ADE80',
  warning: '#FBBF24',
  alert:   '#F87171',
  neutral: '#93C5FD',
}

/**
 * A label that cycles between hidden and visible on a timer loop.
 * Most of the time it is invisible; it surfaces briefly, then retreats.
 *
 * Timing:
 *   initial delay  →  show (activeDuration)  →  hide (idleDuration)  →  repeat
 *
 * CHANGED vs previous version:
 * - Entrance animation now includes filter: blur(4px) → blur(0px)
 *   so the label materialises from the atmospheric glow, not from
 *   thin air. This is the single biggest detail that makes labels
 *   feel like they belong to the mass instead of being pasted on.
 * - Uses custom useReducedMotionSafe hook.
 */
const EmergingLabel = memo(function EmergingLabel({
  text,
  status = 'neutral',
  activeDuration = 2800,
  idleDuration = 5500,
  delay = 0,
}: EmergingLabelProps) {
  const reducedMotion = useReducedMotionSafe()
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (reducedMotion) return

    let mounted = true

    function clearTimer() {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }

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

    // First cycle: respect explicit delay; fall back to idleDuration
    // so the page fully paints before the first label pops up.
    timerRef.current = setTimeout(show, delay > 0 ? delay : idleDuration)

    return () => {
      mounted = false
      clearTimer()
    }
  }, [reducedMotion, activeDuration, idleDuration, delay])

  const dotColor = STATUS_COLOR[status]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="label"
          initial={{ opacity: 0, y: 8,  scale: 0.96, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0,  scale: 1,    filter: 'blur(0px)' }}
          exit={{    opacity: 0, y: -6,  scale: 0.985 }}
          transition={{ duration: 0.42, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            display:              'inline-flex',
            alignItems:           'center',
            gap:                  6,
            padding:              '4px 10px 4px 8px',
            borderRadius:         6,
            background:           'rgba(8, 12, 20, 0.56)',
            border:               '1px solid rgba(255,255,255,0.08)',
            backdropFilter:       'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            color:                'rgba(255,255,255,0.94)',
            fontSize:             11,
            fontFamily:           'var(--font-sans, ui-sans-serif, system-ui, sans-serif)',
            fontWeight:           500,
            letterSpacing:        '0.04em',
            whiteSpace:           'nowrap',
            userSelect:           'none',
          }}
        >
          <span
            style={{
              width:        5,
              height:       5,
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
