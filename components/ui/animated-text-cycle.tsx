'use client'

import * as React from 'react'
import { AnimatePresence, motion, type Variants } from 'framer-motion'

interface AnimatedTextCycleProps {
  words: string[]
  interval?: number
  className?: string
}

export default function AnimatedTextCycle({
  words,
  interval = 5000,
  className = '',
}: AnimatedTextCycleProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [width, setWidth] = React.useState('auto')
  const measureRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!measureRef.current) return
    const elements = measureRef.current.children
    if (elements.length <= currentIndex) return
    const nextWidth = elements[currentIndex].getBoundingClientRect().width
    setWidth(`${nextWidth}px`)
  }, [currentIndex])

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length)
    }, interval)

    return () => window.clearInterval(timer)
  }, [interval, words.length])

  const containerVariants: Variants = {
    hidden: {
      y: -20,
      opacity: 0,
      filter: 'blur(8px)',
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
    exit: {
      y: 20,
      opacity: 0,
      filter: 'blur(8px)',
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    },
  }

  return (
    <>
      <div
        ref={measureRef}
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none"
        style={{ visibility: 'hidden' }}
      >
        {words.map((word) => (
          <span key={word} className={`font-bold ${className}`}>
            {word}
          </span>
        ))}
      </div>

      <motion.span
        className="relative inline-block"
        animate={{
          width,
          transition: {
            type: 'spring',
            stiffness: 150,
            damping: 15,
            mass: 1.2,
          },
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={words[currentIndex]}
            className={`inline-block font-bold ${className}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ whiteSpace: 'nowrap' }}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  )
}
