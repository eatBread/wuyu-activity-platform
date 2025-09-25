'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface NavigationContextType {
  lastPage: string | null
  setLastPage: (page: string | null) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [lastPage, setLastPage] = useState<string | null>(null)

  return (
    <NavigationContext.Provider value={{ lastPage, setLastPage }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
