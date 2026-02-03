import { supabase } from '@/lib/supabase/client'
import type { Route, InsertTables, UpdateTables } from '@/types'

export async function getRoutes(activeOnly = true): Promise<Route[]> {
  let query = supabase.from('routes').select('*')
  
  if (activeOnly) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query.order('name', { ascending: true })

  if (error) throw error
  return data
}

export async function getRouteById(id: string): Promise<Route | null> {
  const { data, error } = await supabase
    .from('routes')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function findRoute(originCity: string, destinationCity: string): Promise<Route | null> {
  const { data, error } = await supabase
    .from('routes')
    .select('*')
    .eq('origin_city', originCity)
    .eq('destination_city', destinationCity)
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function createRoute(route: InsertTables<'routes'>): Promise<Route> {
  const { data, error } = await supabase
    .from('routes')
    .insert(route)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateRoute(id: string, updates: UpdateTables<'routes'>): Promise<Route> {
  const { data, error } = await supabase
    .from('routes')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteRoute(id: string): Promise<void> {
  const { error } = await supabase
    .from('routes')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getCities(): Promise<string[]> {
  const { data, error } = await supabase
    .from('routes')
    .select('origin_city, destination_city')
    .eq('is_active', true)

  if (error) throw error

  const cities = new Set<string>()
  data.forEach((route: { origin_city: string; destination_city: string }) => {
    cities.add(route.origin_city)
    cities.add(route.destination_city)
  })

  return Array.from(cities).sort()
}
