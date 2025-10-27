'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface AccessibilityContextType {
  reducedMotion: boolean
  highContrast: boolean
  fontSize: 'small' | 'medium' | 'large'
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  reducedMotion: false,
  highContrast: false,
  fontSize: 'medium',
})

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium')

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    const contrastQuery = window.matchMedia('(prefers-contrast: high)')
    setHighContrast(contrastQuery.matches)
  }, [])

  return (
    <AccessibilityContext.Provider value={{ reducedMotion, highContrast, fontSize }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export const useAccessibility = () => useContext(AccessibilityContext)