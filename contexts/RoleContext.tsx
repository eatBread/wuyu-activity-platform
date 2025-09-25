'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type UserRole = 'STUDENT' | 'TEACHER' | 'GROUP_LEADER' | 'PRINCIPAL'

interface RoleContextType {
  currentRole: UserRole
  setCurrentRole: (role: UserRole) => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('STUDENT')
  const [isClient, setIsClient] = useState(false)

  // 确保在客户端渲染后再从localStorage读取角色
  useEffect(() => {
    setIsClient(true)
    const savedRole = localStorage.getItem('currentRole') as UserRole
    if (savedRole) {
      setCurrentRole(savedRole)
    }
  }, [])

  const handleSetCurrentRole = (role: UserRole) => {
    setCurrentRole(role)
    // 保存到 localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentRole', role)
    }
  }

  return (
    <RoleContext.Provider value={{ currentRole, setCurrentRole: handleSetCurrentRole }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider')
  }
  return context
}
