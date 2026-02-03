import { supabase } from '@/lib/supabase/client'
import type { Tariff, InsertTables, UpdateTables } from '@/types'

export async function getTariffs(activeOnly = true): Promise<Tariff[]> {
  let query = supabase.from('tariffs').select('*')
  
  if (activeOnly) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query.order('base_price', { ascending: true })

  if (error) throw error
  return data
}

export async function getTariffById(id: string): Promise<Tariff | null> {
  const { data, error } = await supabase
    .from('tariffs')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createTariff(tariff: InsertTables<'tariffs'>): Promise<Tariff> {
  const { data, error } = await supabase
    .from('tariffs')
    .insert(tariff)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTariff(id: string, updates: UpdateTables<'tariffs'>): Promise<Tariff> {
  const { data, error } = await supabase
    .from('tariffs')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTariff(id: string): Promise<void> {
  const { error } = await supabase
    .from('tariffs')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function calculateDeliveryCost(
  tariffId: string,
  weightKg: number,
  distanceKm: number,
  volumeM3 = 0,
  declaredValue = 0
) {
  const tariff = await getTariffById(tariffId)
  if (!tariff) throw new Error('Tariff not found')

  const baseCost = tariff.base_price
  const weightCost = weightKg * tariff.price_per_kg
  const distanceCost = distanceKm * tariff.price_per_km
  const volumeCost = volumeM3 * tariff.price_per_m3
  const insuranceCost = declaredValue * 0.005

  const totalCost = baseCost + weightCost + distanceCost + volumeCost + insuranceCost

  return {
    tariffId,
    tariffName: tariff.name,
    baseCost,
    weightCost,
    distanceCost,
    volumeCost,
    insuranceCost,
    totalCost,
    deliveryDays: `${tariff.delivery_days_min}-${tariff.delivery_days_max}`,
    isExpress: tariff.is_express
  }
}
