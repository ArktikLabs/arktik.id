"use client"

import { useEffect } from 'react'

export function CursorPreloader() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if styles already exist to avoid duplicates
      if (!document.getElementById('custom-cursor-styles')) {
        const style = document.createElement('style')
        style.id = 'custom-cursor-styles'
        // Scoped deliberately: the old rule was `body *` with !important, which
        // also overrode the I-beam on inputs and `not-allowed` on disabled
        // controls — the cursor stopped telling the user anything.
        style.textContent = `
          html, body,
          body *:not(input):not(textarea):not(select):not([disabled]):not([aria-disabled="true"]) {
            cursor: url('/assets/cursor.svg') 4 4, auto;
          }

          body a, body button, body [role="button"],
          body input[type="submit"], body input[type="button"],
          body .cursor-pointer {
            cursor: url('/assets/cursor-hover.svg') 8 8, pointer;
          }

          body input:not([type="submit"]):not([type="button"]), body textarea {
            cursor: text;
          }

          body [disabled], body [aria-disabled="true"] {
            cursor: not-allowed;
          }
        `;
        
        document.head.appendChild(style)
      }
    }
  }, [])

  return null
}