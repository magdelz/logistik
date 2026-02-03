import { supabase } from '@/lib/supabase/client'
import type { UserRole } from '@/types'

interface SignUpData {
  email: string
  password: string
  fullName: string
  phone?: string
  companyName?: string
  role?: UserRole
}

interface SignInData {
  email: string
  password: string
}

export async function signUp(data: SignUpData) {
  const { email, password, fullName, phone, companyName, role = 'client' } = data

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone,
        company_name: companyName,
        role
      }
    }
  })

  if (error) throw error
  return authData
}

export async function signIn(data: SignInData) {
  const { email, password } = data

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error
  return authData
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  })

  if (error) throw error
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (error) throw error
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback)
}
