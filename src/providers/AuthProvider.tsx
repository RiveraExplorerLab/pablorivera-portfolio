// src/providers/AuthProvider.tsx
import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth } from '../lib/firebase'

// Allowed admin email(s) - loaded from environment variables
const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map((e: string) => e.trim().toLowerCase())
  .filter(Boolean)

// Debug: Remove after fixing
console.log('[Auth Debug] Admin emails configured:', ADMIN_EMAILS.length, 'Raw env:', import.meta.env.VITE_ADMIN_EMAILS ? 'SET' : 'EMPTY')
console.log('[Auth Debug] Emails list:', ADMIN_EMAILS)

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if current user is in admin whitelist (case-insensitive)
  const isAdmin = user ? ADMIN_EMAILS.includes((user.email ?? '').toLowerCase()) : false

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('[Auth Debug] User changed:', firebaseUser?.email)
      console.log('[Auth Debug] Is in admin list:', firebaseUser ? ADMIN_EMAILS.includes((firebaseUser.email ?? '').toLowerCase()) : false)
      setUser(firebaseUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  async function signIn(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function signOut() {
    await firebaseSignOut(auth)
  }

  const value: AuthContextType = {
    user,
    isAdmin,
    loading,
    signIn,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
