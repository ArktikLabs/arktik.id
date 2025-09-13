"use client"

import { useEffect } from 'react'

export function CursorPreloader() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if styles already exist to avoid duplicates
      if (!document.getElementById('custom-cursor-styles')) {
        const style = document.createElement('style')
        style.id = 'custom-cursor-styles'
        style.textContent = `
          html, body, body * {
            cursor: url('/cursor.svg') 4 4, auto !important;
          }
          
          body a, body button, body [role="button"], body input[type="submit"], body input[type="button"], body .cursor-pointer {
            cursor: url('/cursor-hover.svg') 8 8, pointer !important;
          }
        `
        
        document.head.appendChild(style)
      }
    }
  }, [])

  return null
}