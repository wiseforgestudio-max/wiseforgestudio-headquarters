'use client'

import * as React from 'react'
import { motion, useSpring, useTransform, type SpringOptions } from 'framer-motion'

import { cn } from '@/lib/utils'

type MouseSpotlightProps = {
  className?: string
  size?: number
  springOptions?: SpringOptions
}

export function MouseSpotlight({
  className,
  size = 220,
  springOptions = { bounce: 0 },
}: MouseSpotlightProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = React.useState(false)
  const [parentElement, setParentElement] = React.useState<HTMLElement | null>(null)

  const mouseX = useSpring(0, springOptions)
  const mouseY = useSpring(0, springOptions)

  const spotlightLeft = useTransform(mouseX, (x) => `${x - size / 2}px`)
  const spotlightTop = useTransform(mouseY, (y) => `${y - size / 2}px`)

  React.useEffect(() => {
    if (!containerRef.current) return
    const parent = containerRef.current.parentElement
    if (!parent) return
    parent.style.position = 'relative'
    parent.style.overflow = 'hidden'
    setParentElement(parent)
  }, [])

  const handleMouseMove = React.useCallback(
    (event: MouseEvent) => {
      if (!parentElement) return
      const { left, top } = parentElement.getBoundingClientRect()
      mouseX.set(event.clientX - left)
      mouseY.set(event.clientY - top)
    },
    [mouseX, mouseY, parentElement]
  )

  React.useEffect(() => {
    if (!parentElement) return

    const handleEnter = () => setIsHovered(true)
    const handleLeave = () => setIsHovered(false)

    parentElement.addEventListener('mousemove', handleMouseMove)
    parentElement.addEventListener('mouseenter', handleEnter)
    parentElement.addEventListener('mouseleave', handleLeave)

    return () => {
      parentElement.removeEventListener('mousemove', handleMouseMove)
      parentElement.removeEventListener('mouseenter', handleEnter)
      parentElement.removeEventListener('mouseleave', handleLeave)
    }
  }, [parentElement, handleMouseMove])

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'pointer-events-none absolute rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops),transparent_80%)] blur-xl transition-opacity duration-200',
        'from-zinc-50/90 via-orange-100/70 to-teal-200/60',
        isHovered ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{
        width: size,
        height: size,
        left: spotlightLeft,
        top: spotlightTop,
      }}
    />
  )
}
