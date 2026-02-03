import { supabase } from '@/lib/supabase/client'
import type { Profile, InsertTables, UpdateTables, PaginatedResponse, PaginationParams, UserRole } from '@/types'

interface ProfileFilters extends PaginationParams {
  role?: UserRole
  search?: string
  isActive?: boolean
}

export async function getProfiles(filters: ProfileFilters = {}): Promise<PaginatedResponse<Profile>> {
  const { 
    page = 1, 
    pageSize = 10, 
    sortBy = 'created_at', 
    sortOrder = 'desc',
    role,
    search,
    isActive
  } = filters

  let query = supabase
    .from('profiles')
    .select('*', { count: 'exact' })

  if (role) query = query.eq('role', role)
  if (isActive !== undefined) query = query.eq('is_active', isActive)
  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,company_name.ilike.%${search}%`)
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await query
    .order(sortBy, { ascending: sortOrder === 'asc' })
    .range(from, to)

  if (error) throw error

  return {
    data: data || [],
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize)
  }
}

export async function getProfileById(id: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  return getProfileById(user.id)
}

export async function updateProfile(id: string, updates: UpdateTables<'profiles'>): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateCurrentProfile(updates: UpdateTables<'profiles'>): Promise<Profile> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  return updateProfile(user.id, updates)
}

export async function getClients(filters: PaginationParams = {}): Promise<PaginatedResponse<Profile>> {
  return getProfiles({ ...filters, role: 'client' })
}

export async function getManagers(filters: PaginationParams = {}): Promise<PaginatedResponse<Profile>> {
  return getProfiles({ ...filters, role: 'manager' })
}

export async function getClientStats() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, created_at')
    .eq('role', 'client')

  if (error) throw error

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  return {
    totalClients: data.length,
    newClients: data.filter((p: { id: string; created_at: string }) => new Date(p.created_at) >= startOfMonth).length,
    activeClients: data.length // Can be enhanced with order activity
  }
}
