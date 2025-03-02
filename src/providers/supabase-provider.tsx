"use client";


import { createContext, useContext, useEffect, useState } from 'react'
import supabase from '@/lib/supabase/client'
import type { SupabaseClient as Client, User as SupabaseUser, AuthChangeEvent, Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

type SupabaseContext = {
  supabase: Client
  user: SupabaseUser | null
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export default function SupabaseProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      if (session) {
        setUser(session.user)
      } else {
        setUser(null)
        router.push('/auth/signin')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  return (
    <Context.Provider value={{ supabase, user }}>
      {children}
    </Context.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider')
  }
  return context
} 