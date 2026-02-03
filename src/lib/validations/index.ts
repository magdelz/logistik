import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
})

export const registerSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
  confirmPassword: z.string().min(6, 'Минимум 6 символов'),
  fullName: z.string().min(2, 'Введите ваше имя'),
  phone: z.string().optional(),
  companyName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
})

export const profileSchema = z.object({
  fullName: z.string().min(2, 'Введите ваше имя'),
  phone: z.string().optional(),
  companyName: z.string().optional(),
})

export const addressSchema = z.object({
  label: z.string().min(1, 'Введите название'),
  city: z.string().min(2, 'Введите город'),
  street: z.string().min(2, 'Введите улицу'),
  building: z.string().optional(),
  apartment: z.string().optional(),
  postalCode: z.string().optional(),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  notes: z.string().optional(),
  isDefault: z.boolean().optional(),
})

export const orderSchema = z.object({
  pickupCity: z.string().min(2, 'Введите город отправления'),
  pickupStreet: z.string().min(2, 'Введите адрес отправления'),
  pickupBuilding: z.string().optional(),
  pickupContactName: z.string().min(2, 'Введите имя контактного лица'),
  pickupContactPhone: z.string().min(10, 'Введите телефон'),
  pickupDate: z.string().optional(),
  
  deliveryCity: z.string().min(2, 'Введите город доставки'),
  deliveryStreet: z.string().min(2, 'Введите адрес доставки'),
  deliveryBuilding: z.string().optional(),
  deliveryContactName: z.string().min(2, 'Введите имя получателя'),
  deliveryContactPhone: z.string().min(10, 'Введите телефон получателя'),
  deliveryDate: z.string().optional(),
  
  cargoDescription: z.string().min(5, 'Опишите груз'),
  cargoType: z.enum(['standard', 'fragile', 'perishable', 'hazardous', 'oversized', 'valuable']),
  weightKg: z.number().min(0.1, 'Минимальный вес 0.1 кг').max(50000, 'Максимальный вес 50000 кг'),
  volumeM3: z.number().optional(),
  lengthCm: z.number().optional(),
  widthCm: z.number().optional(),
  heightCm: z.number().optional(),
  piecesCount: z.number().min(1).default(1),
  declaredValue: z.number().optional(),
  isFragile: z.boolean().default(false),
  requiresTemperatureControl: z.boolean().default(false),
  temperatureMin: z.number().optional(),
  temperatureMax: z.number().optional(),
  
  tariffId: z.string().uuid('Выберите тариф'),
  clientNotes: z.string().optional(),
})

export const tariffSchema = z.object({
  name: z.string().min(2, 'Введите название'),
  description: z.string().optional(),
  basePrice: z.number().min(0, 'Цена не может быть отрицательной'),
  pricePerKg: z.number().min(0, 'Цена не может быть отрицательной'),
  pricePerKm: z.number().min(0, 'Цена не может быть отрицательной'),
  pricePerM3: z.number().min(0).default(0),
  minWeight: z.number().min(0).default(0),
  maxWeight: z.number().optional(),
  deliveryDaysMin: z.number().min(1).default(1),
  deliveryDaysMax: z.number().min(1).default(3),
  cargoTypes: z.array(z.string()).min(1, 'Выберите типы грузов'),
  isExpress: z.boolean().default(false),
  isActive: z.boolean().default(true),
})

export const routeSchema = z.object({
  name: z.string().min(2, 'Введите название'),
  originCity: z.string().min(2, 'Введите город отправления'),
  destinationCity: z.string().min(2, 'Введите город назначения'),
  distanceKm: z.number().min(1, 'Введите расстояние'),
  estimatedHours: z.number().optional(),
  isActive: z.boolean().default(true),
})

export const calculatorSchema = z.object({
  originCity: z.string().min(2, 'Выберите город отправления'),
  destinationCity: z.string().min(2, 'Выберите город назначения'),
  weight: z.number().min(0.1, 'Минимальный вес 0.1 кг'),
  length: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  cargoType: z.string().default('standard'),
  declaredValue: z.number().optional(),
})

export const trackingSchema = z.object({
  trackingCode: z.string().min(8, 'Введите трек-номер'),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'pickup', 'in_transit', 'delivered', 'cancelled']),
  currentLocation: z.string().optional(),
  notes: z.string().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type AddressInput = z.infer<typeof addressSchema>
export type OrderInput = z.infer<typeof orderSchema>
export type TariffInput = z.infer<typeof tariffSchema>
export type RouteInput = z.infer<typeof routeSchema>
export type CalculatorInput = z.infer<typeof calculatorSchema>
export type TrackingInput = z.infer<typeof trackingSchema>
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>
