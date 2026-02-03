'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Package, MapPin, Truck, Calendar, 
  Clock, User, Phone, FileText, CheckCircle, Loader2 
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageTransition, SlideUp } from '@/components/animations/page-transition'
import { supabase } from '@/lib/supabase/client'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, formatCurrency, formatDate, formatDateTime, cn } from '@/lib/utils'

interface Order {
  id: string
  order_number: string
  tracking_code: string | null
  status: string
  payment_status: string
  pickup_city: string
  pickup_street: string
  pickup_contact_name: string
  pickup_contact_phone: string
  delivery_city: string
  delivery_street: string
  delivery_contact_name: string
  delivery_contact_phone: string
  cargo_description: string
  cargo_type: string
  weight_kg: number
  volume_m3: number | null
  declared_value: number | null
  total_cost: number
  client_notes: string | null
  created_at: string
  estimated_delivery_date: string | null
  current_location: string | null
}

interface StatusHistory {
  id: string
  status: string
  location: string | null
  notes: string | null
  created_at: string
}

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!params.id) return

      try {
        setIsLoading(true)
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', params.id as string)
          .single()

        if (orderError) throw orderError

        setOrder(orderData)

        // Fetch status history
        const { data: historyData } = await supabase
          .from('order_status_history')
          .select('*')
          .eq('order_id', params.id as string)
          .order('created_at', { ascending: false })

        setStatusHistory(historyData || [])
      } catch (err: any) {
        console.error('Error fetching order:', err)
        setError(err.message || 'Не удалось загрузить заказ')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">{error || 'Заказ не найден'}</p>
        <Button asChild>
          <Link href="/dashboard/orders">Вернуться к заказам</Link>
        </Button>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/orders"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Заказ {order.order_number}</h1>
            <p className="text-muted-foreground">Трек-номер: {order.tracking_code}</p>
          </div>
          <Badge className={cn('text-sm', ORDER_STATUS_COLORS[order.status])}>
            {ORDER_STATUS_LABELS[order.status]}
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <SlideUp>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Информация о грузе
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Описание</p>
                    <p className="font-medium">{order.cargo_description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Тип груза</p>
                    <p className="font-medium capitalize">{order.cargo_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Вес</p>
                    <p className="font-medium">{order.weight_kg} кг</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Объём</p>
                    <p className="font-medium">{order.volume_m3?.toFixed(3)} м³</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Объявленная стоимость</p>
                    <p className="font-medium">{formatCurrency(order.declared_value || 0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Стоимость доставки</p>
                    <p className="font-medium text-primary">{formatCurrency(order.total_cost)}</p>
                  </div>
                </CardContent>
              </Card>
            </SlideUp>

            <SlideUp delay={0.1}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Маршрут
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Откуда</p>
                      <p className="font-medium mb-2">{order.pickup_city}, {order.pickup_street}</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {order.pickup_contact_name}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {order.pickup_contact_phone}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Куда</p>
                      <p className="font-medium mb-2">{order.delivery_city}, {order.delivery_street}</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {order.delivery_contact_name}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {order.delivery_contact_phone}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SlideUp>

            {order.client_notes && (
              <SlideUp delay={0.2}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Примечания
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{order.client_notes}</p>
                  </CardContent>
                </Card>
              </SlideUp>
            )}
          </div>

          <div className="space-y-6">
            <SlideUp delay={0.1}>
              <Card>
                <CardHeader>
                  <CardTitle>Детали заказа</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Дата создания</p>
                      <p className="font-medium">{formatDateTime(order.created_at)}</p>
                    </div>
                  </div>
                  {order.estimated_delivery_date && (
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Ожидаемая доставка</p>
                        <p className="font-medium">{formatDate(order.estimated_delivery_date)}</p>
                      </div>
                    </div>
                  )}
                  {order.current_location && (
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Текущее местоположение</p>
                        <p className="font-medium">{order.current_location}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </SlideUp>

            <SlideUp delay={0.2}>
              <Card>
                <CardHeader>
                  <CardTitle>История статусов</CardTitle>
                </CardHeader>
                <CardContent>
                  {statusHistory.length > 0 ? (
                    <div className="space-y-4">
                      {statusHistory.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex gap-3"
                        >
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-primary" />
                            {index < statusHistory.length - 1 && (
                              <div className="w-0.5 h-full bg-border" />
                            )}
                          </div>
                          <div className="pb-4">
                            <p className="font-medium">{ORDER_STATUS_LABELS[item.status]}</p>
                            {item.location && (
                              <p className="text-sm text-muted-foreground">{item.location}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              {formatDateTime(item.created_at)}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <CheckCircle className="h-5 w-5" />
                      <span>Заказ создан {formatDateTime(order.created_at)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </SlideUp>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
