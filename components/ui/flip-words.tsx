"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

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

  const currentWord = words[currentWordIndex]
  const longestWord = words.reduce((a, b) => (a.length > b.length ? a : b), "")

  useEffect(() => {
    if (isTyping) {
      if (currentText.length < currentWord.length) {
        const timeout = setTimeout(() => {
          setCurrentText(currentWord.slice(0, currentText.length + 1))
        }, 100) // Typing speed
        return () => clearTimeout(timeout)
      } else {
        // Finished typing, wait then start erasing
        const timeout = setTimeout(() => {
          setIsTyping(false)
        }, duration)
        return () => clearTimeout(timeout)
      }
    } else {
      // Erasing
      if (currentText.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1))
        }, 50) // Erasing speed
        return () => clearTimeout(timeout)
      } else {
        // Finished erasing, move to next word
        setCurrentWordIndex((prev) => (prev + 1) % words.length)
        setIsTyping(true)
      }
    }
  }, [currentText, currentWord, isTyping, duration, words.length])

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)
    return () => clearInterval(cursorInterval)
  }, [])

  return (
    <span
      className={cn("inline-block relative", className)}
      style={{ width: `${longestWord.length + 1}ch` }}
    >
      <span className="text-lime-green absolute top-0 left-0">
        {currentText}
        <motion.span
          animate={{ opacity: showCursor ? 1 : 0 }}
          transition={{ duration: 0 }}
          className="inline"
        >
          |
        </motion.span>
      </span>
      <span className="invisible" aria-hidden="true">
        {longestWord}
      </span>
    </span>
  );
}
