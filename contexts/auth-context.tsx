"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type UserRole = "user" | "admin" | "guest"

interface User {
  id: string
  email: string
  role: UserRole
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  continueAsGuest: () => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface UserProfile {
  paymentMethods: { id: string; type: string; last4: string }[]
  phone?: string
}

const USER_PROFILES: Record<string, UserProfile> = {
  "1": {
    paymentMethods: [
      { id: "1", type: "Visa", last4: "4242" },
      { id: "2", type: "Mastercard", last4: "5555" },
    ],
    phone: "+1 (555) 123-4567",
  },
}

// Mock users for demo
const MOCK_USERS = [
  { id: "1", email: "user@cinema.com", password: "user123", role: "user" as UserRole, name: "John Doe" },
  { id: "2", email: "admin@cinema.com", password: "admin123", role: "admin" as UserRole, name: "Admin User" },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("cinema_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const foundUser = MOCK_USERS.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("cinema_user", JSON.stringify(userWithoutPassword))
      return true
    }

    return false
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Check if user already exists
    const existingUser = MOCK_USERS.find((u) => u.email === email)
    if (existingUser) {
      return false
    }

    // Create new user
    const newUser = {
      id: String(MOCK_USERS.length + 1),
      email,
      password,
      role: "user" as UserRole,
      name,
    }
    MOCK_USERS.push(newUser)

    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem("cinema_user", JSON.stringify(userWithoutPassword))
    return true
  }

  const continueAsGuest = () => {
    const guestUser: User = {
      id: "guest",
      email: "guest@cinema.com",
      role: "guest",
      name: "Guest User",
    }
    setUser(guestUser)
    localStorage.setItem("cinema_user", JSON.stringify(guestUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("cinema_user")
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, continueAsGuest, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function getUserProfile(userId: string): UserProfile | null {
  return USER_PROFILES[userId] || null
}

export function addPaymentMethod(userId: string, paymentMethod: { type: string; last4: string }) {
  if (!USER_PROFILES[userId]) {
    USER_PROFILES[userId] = { paymentMethods: [] }
  }
  const newMethod = {
    id: String(Date.now()),
    ...paymentMethod,
  }
  USER_PROFILES[userId].paymentMethods.push(newMethod)
}

export function removePaymentMethod(userId: string, paymentId: string) {
  if (USER_PROFILES[userId]) {
    USER_PROFILES[userId].paymentMethods = USER_PROFILES[userId].paymentMethods.filter(
      (method) => method.id !== paymentId,
    )
  }
}
