"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export const AnimatedBeam = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const beamRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (beamRef.current) {
        const rect = beamRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div ref={beamRef} className="relative h-full w-full overflow-hidden">
      <motion.div
        className="pointer-events-none absolute inset-0 z-30 h-full w-full bg-[radial-gradient(circle_at_var(--x)_var(--y),rgba(120,119,198,0.15)_0%,transparent_80%)]"
        animate={{
          "--x": `${mousePosition.x}px`,
          "--y": `${mousePosition.y}px`,
        } as any}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      />
    </div>
  )
}

