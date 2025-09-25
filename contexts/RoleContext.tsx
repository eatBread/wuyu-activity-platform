'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type UserRole = 'STUDENT' | 'TEACHER' | 'GROUP_LEADER' | 'PRINCIPAL'

interface RoleContextType {
  currentRole: UserRole
  setCurrentRole: (role: UserRole) => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    // 从 localStorage 读取保存的角色，如果没有则默认为 STUDENT
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('currentRole') as UserRole
      return savedRole || 'STUDENT'
    }
    return 'STUDENT'
  })

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
