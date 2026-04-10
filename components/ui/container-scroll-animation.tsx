'use client'

import * as React from 'react'
import { MotionValue, motion, useScroll, useTransform } from 'framer-motion'

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode
  children: React.ReactNode
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
  })
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const scaleDimensions = () => (isMobile ? [0.78, 0.92] : [1.04, 1])

  const rotate = useTransform(scrollYProgress, [0, 1], [18, 0])
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions())
  const translate = useTransform(scrollYProgress, [0, 1], [0, -90])

  return (
    <div
      className="relative flex h-[54rem] items-center justify-center px-3 py-16 md:h-[78rem] md:px-8 md:py-24"
      ref={containerRef}
    >
      <div
        className="relative w-full py-8 md:py-32"
        style={{
          perspective: '1000px',
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  )
}

const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>
  titleComponent: string | React.ReactNode
}) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="mx-auto max-w-5xl text-center"
    >
      {titleComponent}
    </motion.div>
  )
}

const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>
  scale: MotionValue<number>
  translate: MotionValue<number>
  children: React.ReactNode
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          '0 0 #00000033, 0 12px 24px #0000002e, 0 38px 42px #0000002a, 0 90px 68px #0000001a, 0 180px 96px #0000000d',
      }}
      className="mx-auto -mt-10 h-[24rem] w-full max-w-6xl rounded-[30px] border border-white/15 bg-[#161616] p-2 md:h-[39rem] md:p-5"
    >
      <div className="h-full w-full overflow-hidden rounded-[22px] bg-[#f4efe6] p-1 md:p-3">
        {children}
      </div>
    </motion.div>
  )
}
