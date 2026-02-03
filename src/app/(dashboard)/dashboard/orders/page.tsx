'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageTransition, SlideUp } from '@/components/animations/page-transition'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, formatCurrency, formatDate, cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'

interface Order {
  id: string
  order_number: string
  tracking_code: string
  status: string
  pickup_address: string
  delivery_address: string
  cargo_description: string
  weight_kg: number
  total_cost: number
  created_at: string
  estimated_delivery_date: string | null
}

const mockOrders = [
  {
    id: '1',
    orderNumber: 'LT24000125',
    trackingCode: 'ABC123XYZ789',
    status: 'in_transit',
    pickupCity: 'Москва',
    deliveryCity: 'Екатеринбург',
    cargoDescription: 'Электроника, 2 коробки',
    weight: 15.5,
    totalCost: 4500,
    createdAt: '2024-01-20',
    estimatedDelivery: '2024-01-24',
  },
  {
    id: '2',
    orderNumber: 'LT24000124',
    trackingCode: 'DEF456UVW012',
    status: 'delivered',
    pickupCity: 'Санкт-Петербург',
    deliveryCity: 'Москва',
    cargoDescription: 'Одежда, 5 коробок',
    weight: 25,
    totalCost: 2800,
    createdAt: '2024-01-18',
    estimatedDelivery: '2024-01-20',
  },
  {
    id: '3',
    orderNumber: 'LT24000123',
    trackingCode: 'GHI789RST345',
    status: 'pickup',
    pickupCity: 'Москва',
    deliveryCity: 'Казань',
    cargoDescription: 'Документы, 1 коробка',
    weight: 2,
    totalCost: 3200,
    createdAt: '2024-01-17',
    estimatedDelivery: '2024-01-19',
  },
  {
    id: '4',
    orderNumber: 'LT24000122',
    trackingCode: 'JKL012MNO678',
    status: 'pending',
    pickupCity: 'Нижний Новгород',
    deliveryCity: 'Москва',
    cargoDescription: 'Запчасти, 3 коробки',
    weight: 45,
    totalCost: 1900,
    createdAt: '2024-01-16',
    estimatedDelivery: '2024-01-21',
  },
  {
    id: '5',
    orderNumber: 'LT24000121',
    trackingCode: 'PQR345STU901',
    status: 'confirmed',
    pickupCity: 'Краснодар',
    deliveryCity: 'Москва',
    cargoDescription: 'Продукты питания',
    weight: 100,
    totalCost: 8500,
    createdAt: '2024-01-15',
    estimatedDelivery: '2024-01-19',
  },
]

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalOrders, setTotalOrders] = useState(0)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        let query = supabase
          .from('orders')
          .select('*', { count: 'exact' })
          .eq('client_id', user.id)
          .order('created_at', { ascending: false })

        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter)
        }

        if (searchTerm) {
          query = query.or(`order_number.ilike.%${searchTerm}%,tracking_code.ilike.%${searchTerm}%,cargo_description.ilike.%${searchTerm}%`)
        }

        const pageSize = 10
        const from = (page - 1) * pageSize
        const to = from + pageSize - 1

        const { data, count, error } = await query.range(from, to)

        if (error) throw error

        setOrders(data || [])
        setTotalOrders(count || 0)
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [page, statusFilter, searchTerm])

  const filteredOrders = orders

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Мои заказы</h1>
            <p className="text-muted-foreground">
              Управление и отслеживание ваших заказов
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/orders/new">
              <Plus className="mr-2 h-4 w-4" />
              Новый заказ
            </Link>
          </Button>
        </div>

        <SlideUp>
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Поиск по номеру или описанию..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все статусы</SelectItem>
                      <SelectItem value="pending">Ожидает</SelectItem>
                      <SelectItem value="confirmed">Подтверждён</SelectItem>
                      <SelectItem value="pickup">Забран</SelectItem>
                      <SelectItem value="in_transit">В пути</SelectItem>
                      <SelectItem value="delivered">Доставлен</SelectItem>
                      <SelectItem value="cancelled">Отменён</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Номер заказа</TableHead>
                      <TableHead>Маршрут</TableHead>
                      <TableHead>Груз</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Стоимость</TableHead>
                      <TableHead>Дата</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                          <p className="text-muted-foreground">Заказы не найдены</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order, index) => (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b transition-colors hover:bg-muted/50"
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.order_number}</p>
                              <p className="text-xs text-muted-foreground">{order.tracking_code}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="truncate max-w-[200px]">{order.pickup_address?.split(',')[0]} → {order.delivery_address?.split(',')[0]}</p>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="truncate max-w-[200px]">{order.cargo_description}</p>
                              <p className="text-xs text-muted-foreground">{order.weight_kg} кг</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn('text-xs', ORDER_STATUS_COLORS[order.status])}>
                              {ORDER_STATUS_LABELS[order.status]}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(order.total_cost)}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p>{formatDate(order.created_at)}</p>
                              {order.estimated_delivery_date && (
                                <p className="text-xs text-muted-foreground">
                                  Доставка: {formatDate(order.estimated_delivery_date)}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/dashboard/orders/${order.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TableCell>
                        </motion.tr>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Показано {filteredOrders.length} из {totalOrders} заказов
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={page === 1 || isLoading}
                    onClick={() => setPage(p => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={page * 10 >= totalOrders || isLoading}
                    onClick={() => setPage(p => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </SlideUp>
      </div>
    </PageTransition>
  )
}
