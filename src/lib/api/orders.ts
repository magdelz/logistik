import { supabase } from '@/lib/supabase/client'
import type { Order, OrderWithRelations, InsertTables, UpdateTables, OrderFilters, PaginatedResponse } from '@/types'

export async function getOrders(filters: OrderFilters = {}): Promise<PaginatedResponse<OrderWithRelations>> {
  const { 
    page = 1, 
    pageSize = 10, 
    sortBy = 'created_at', 
    sortOrder = 'desc',
    status,
    paymentStatus,
    clientId,
    managerId,
    dateFrom,
    dateTo,
    search 
  } = filters

  let query = supabase
    .from('orders')
    .select(`
      *,
      client:profiles!orders_client_id_fkey(id, email, full_name, phone, company_name),
      manager:profiles!orders_manager_id_fkey(id, email, full_name),
      tariff:tariffs(id, name, is_express),
      route:routes(id, name, origin_city, destination_city)
    `, { count: 'exact' })

  if (status) query = query.eq('status', status)
  if (paymentStatus) query = query.eq('payment_status', paymentStatus)
  if (clientId) query = query.eq('client_id', clientId)
  if (managerId) query = query.eq('manager_id', managerId)
  if (dateFrom) query = query.gte('created_at', dateFrom)
  if (dateTo) query = query.lte('created_at', dateTo)
  if (search) {
    query = query.or(`order_number.ilike.%${search}%,tracking_code.ilike.%${search}%,cargo_description.ilike.%${search}%`)
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await query
    .order(sortBy, { ascending: sortOrder === 'asc' })
    .range(from, to)

  if (error) throw error

  return {
    data: data as OrderWithRelations[],
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize)
  }
}

export async function getOrderById(id: string): Promise<OrderWithRelations | null> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      client:profiles!orders_client_id_fkey(id, email, full_name, phone, company_name),
      manager:profiles!orders_manager_id_fkey(id, email, full_name),
      tariff:tariffs(*),
      route:routes(*),
      status_history:order_status_history(*)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data as OrderWithRelations
}

export async function getOrderByTrackingCode(trackingCode: string): Promise<OrderWithRelations | null> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      status_history:order_status_history(*)
    `)
    .eq('tracking_code', trackingCode.toUpperCase())
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data as OrderWithRelations
}

export async function createOrder(order: InsertTables<'orders'>): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateOrder(id: string, updates: UpdateTables<'orders'>): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteOrder(id: string): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getClientOrders(clientId: string, filters: OrderFilters = {}): Promise<PaginatedResponse<Order>> {
  return getOrders({ ...filters, clientId })
}

export async function updateOrderStatus(
  orderId: string, 
  status: Order['status'], 
  location?: string, 
  notes?: string
): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .update({ 
      status, 
      current_location: location 
    })
    .eq('id', orderId)
    .select()
    .single()

  if (error) throw error

  // Add to status history
  await supabase
    .from('order_status_history')
    .insert({
      order_id: orderId,
      status,
      location,
      notes
    })

  return data
}

export async function getOrderStats() {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('status, total_cost, created_at')

  if (error) throw error

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  type OrderData = { status: string; total_cost: number; created_at: string }
  
  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o: OrderData) => o.status === 'pending').length,
    inTransitOrders: orders.filter((o: OrderData) => o.status === 'in_transit').length,
    deliveredOrders: orders.filter((o: OrderData) => o.status === 'delivered').length,
    totalRevenue: orders.reduce((sum: number, o: OrderData) => sum + (o.total_cost || 0), 0),
    monthlyRevenue: orders
      .filter((o: OrderData) => new Date(o.created_at) >= startOfMonth)
      .reduce((sum: number, o: OrderData) => sum + (o.total_cost || 0), 0)
  }

  return stats
}
