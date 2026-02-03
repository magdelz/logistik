export * from './database.types'

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface OrderFilters extends PaginationParams {
  status?: string
  paymentStatus?: string
  clientId?: string
  managerId?: string
  dateFrom?: string
  dateTo?: string
  search?: string
}

export interface DashboardStats {
  totalOrders: number
  pendingOrders: number
  inTransitOrders: number
  deliveredOrders: number
  totalRevenue: number
  monthlyRevenue: number
  newClients: number
  activeClients: number
}

export interface ChartData {
  name: string
  value: number
  [key: string]: string | number
}

export interface CalculatorParams {
  originCity: string
  destinationCity: string
  weight: number
  volume?: number
  cargoType: string
  declaredValue?: number
}

export interface CalculatorResult {
  tariffId: string
  tariffName: string
  baseCost: number
  weightCost: number
  distanceCost: number
  volumeCost: number
  insuranceCost: number
  totalCost: number
  deliveryDays: string
  isExpress: boolean
}

export interface TrackingResult {
  order: {
    orderNumber: string
    status: string
    currentLocation: string | null
    estimatedDelivery: string | null
    pickupCity: string
    deliveryCity: string
    cargoDescription: string
  }
  history: {
    status: string
    location: string | null
    timestamp: string
    notes: string | null
  }[]
}
