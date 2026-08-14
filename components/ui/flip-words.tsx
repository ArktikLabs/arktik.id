"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

/* Hallmark · design-system: design.md v2
 *
 * Three fixes over the original:
 *
 * 1. CLIPPING. It reserved width with `${longest.length + 1}ch`. `ch` is the
 *    advance of "0" in the current font — at 5.5rem Archivo that is much
 *    narrower than the caps, so the box under-measured and the absolutely
 *    positioned text was clipped by the hero's overflow-hidden ("without the
 *    black b"). The invisible sizer span below already reserves the correct
 *    width from real font metrics, so the explicit width is deleted, not
 *    recalculated. This is why the component can now carry phrases, not just
 *    one-word adjectives.
 *
 * 2. COLOUR. It hardcoded text-lime-green, so `className` could not set the
 *    colour. Now the caller decides and the token flows through.
 *
 * 3. REDUCED MOTION. It typed forever regardless. Now it renders the first
 *    word statically when the user asks for reduced motion — an endlessly
 *    animating headline is exactly what that preference exists to stop.
 */

export const FlipWords = ({
  words,
  duration = 3000,
  className,
}: {
  words: string[]
  duration?: number
  className?: string
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [showCursor, setShowCursor] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)

  const currentWord = words[currentWordIndex]
  const longestWord = words.reduce((a, b) => (a.length > b.length ? a : b), "")

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    if (isTyping) {
      if (currentText.length < currentWord.length) {
        const timeout = setTimeout(() => {
          setCurrentText(currentWord.slice(0, currentText.length + 1))
        }, 100)
        return () => clearTimeout(timeout)
      }
      const timeout = setTimeout(() => setIsTyping(false), duration)
      return () => clearTimeout(timeout)
    }
    if (currentText.length > 0) {
      const timeout = setTimeout(() => {
        setCurrentText(currentText.slice(0, -1))
      }, 50)
      return () => clearTimeout(timeout)
    }
    setCurrentWordIndex((prev) => (prev + 1) % words.length)
    setIsTyping(true)
  }, [currentText, currentWord, isTyping, duration, words.length, reducedMotion])

  useEffect(() => {
    if (reducedMotion) return
    const cursorInterval = setInterval(() => setShowCursor((p) => !p), 500)
    return () => clearInterval(cursorInterval)
  }, [reducedMotion])

  if (reducedMotion) {
    return <span className={className}>{words[0]}</span>
  }

  return (
    <span className={cn("relative inline-block", className)}>
      {/* Animated layer is decorative — a screen reader would otherwise read a
        * half-typed word. The accessible text is the sizer span below. */}
      <span className="absolute left-0 top-0" aria-hidden="true">
        {currentText}
        <motion.span
          animate={{ opacity: showCursor ? 1 : 0 }}
          transition={{ duration: 0 }}
          className="inline"
        >
          |
        </motion.span>
      </span>
      {/* Reserves the box from real font metrics. Do not replace with a width
        * in ch. Hidden from assistive tech because the LONGEST phrase is an
        * arbitrary thing to read aloud — the canonical first word is exposed
        * separately below, so the headline reads as one sentence. */}
      <span className="invisible" aria-hidden="true">{longestWord}</span>
      <span className="sr-only">{words[0]}</span>
    </span>
  )
}
