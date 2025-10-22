"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { apiClient, type User } from "./api-client"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, firstName: string, lastName: string, role: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const response = await apiClient.getCurrentUser()
    if (response.success && response.data) {
      setUser(response.data)
    }
    setLoading(false)
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    const response = await apiClient.login(email, password)
    if (response.success && response.data) {
      apiClient.setToken(response.data.token)
      setUser(response.data.user)
      return true
    }
    return false
  }

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: string,
  ): Promise<boolean> => {
    const response = await apiClient.register(email, password, firstName, lastName, role)
    if (response.success && response.data) {
      apiClient.setToken(response.data.token)
      setUser(response.data.user)
      return true
    }
    return false
  }

  const logout = () => {
    apiClient.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
