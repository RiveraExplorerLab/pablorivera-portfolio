// src/components/FadeIn.tsx
import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type FadeInProps = {
  children: ReactNode
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number
  className?: string
  once?: boolean
  as?: 'div' | 'section' | 'article' | 'li' | 'span'
}

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.4,
  direction = 'up',
  distance = 20,
  className = '',
  once = true,
  as = 'div',
}: FadeInProps) {
  const prefersReducedMotion = useReducedMotion()

  // Calculate initial position based on direction
  const getInitialPosition = () => {
    if (prefersReducedMotion || direction === 'none') {
      return { x: 0, y: 0 }
    }
    switch (direction) {
      case 'up': return { x: 0, y: distance }
      case 'down': return { x: 0, y: -distance }
      case 'left': return { x: distance, y: 0 }
      case 'right': return { x: -distance, y: 0 }
      default: return { x: 0, y: 0 }
    }
  }

  const initial = getInitialPosition()

  const Component = motion[as] as typeof motion.div

  return (
    <Component
      initial={{ 
        opacity: prefersReducedMotion ? 1 : 0, 
        ...initial 
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      viewport={{ once, margin: '-50px' }}
      transition={{ 
        duration: prefersReducedMotion ? 0 : duration, 
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.25, 0.1, 0.25, 1] // Smooth ease-out
      }}
      className={className}
    >
      {children}
    </Component>
  )
}

// Stagger container for lists
type StaggerProps = {
  children: ReactNode
  staggerDelay?: number
  className?: string
}

export function StaggerContainer({ 
  children, 
  staggerDelay = 0.05, 
  className = '' 
}: StaggerProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ 
  children, 
  className = '' 
}: { 
  children: ReactNode
  className?: string 
}) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      variants={{
        hidden: { 
          opacity: prefersReducedMotion ? 1 : 0, 
          y: prefersReducedMotion ? 0 : 15 
        },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.35,
            ease: [0.25, 0.1, 0.25, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
