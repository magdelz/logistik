'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { 
  Search, 
  Package, 
  Truck, 
  MapPin, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ArrowRight
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageTransition, SlideUp } from '@/components/animations/page-transition'
import { trackingSchema, type TrackingInput } from '@/lib/validations'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, formatDateTime, cn } from '@/lib/utils'

interface TrackingData {
  orderNumber: string
  trackingCode: string
  status: string
  currentLocation: string | null
  estimatedDelivery: string | null
  pickupCity: string
  deliveryCity: string
  cargoDescription: string
  weight: number
  createdAt: string
  history: {
    status: string
    location: string
    timestamp: string
    notes: string | null
  }[]
}

const statusIcons: Record<string, typeof Package> = {
  pending: Clock,
  confirmed: CheckCircle,
  pickup: Package,
  in_transit: Truck,
  delivered: CheckCircle,
  cancelled: AlertCircle,
}

export default function TrackingPage() {
  const searchParams = useSearchParams()
  const initialCode = searchParams.get('code') || ''
  
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<TrackingInput>({
    resolver: zodResolver(trackingSchema),
    defaultValues: {
      trackingCode: initialCode,
    },
  })

  const onSubmit = async (data: TrackingInput) => {
    setIsSearching(true)
    setError(null)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (data.trackingCode.toUpperCase() === 'TEST123456') {
      setTrackingData({
        orderNumber: 'LT24000123',
        trackingCode: 'TEST123456',
        status: 'in_transit',
        currentLocation: 'Казань, сортировочный центр',
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        pickupCity: 'Москва',
        deliveryCity: 'Екатеринбург',
        cargoDescription: 'Электроника, 2 коробки',
        weight: 15.5,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        history: [
          {
            status: 'in_transit',
            location: 'Казань, сортировочный центр',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            notes: 'Груз прибыл на сортировочный центр',
          },
          {
            status: 'in_transit',
            location: 'Нижний Новгород',
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            notes: 'Груз в пути',
          },
          {
            status: 'pickup',
            location: 'Москва, склад отправления',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Груз забран у отправителя',
          },
          {
            status: 'confirmed',
            location: 'Москва',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Заказ подтверждён',
          },
          {
            status: 'pending',
            location: 'Москва',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Заказ создан',
          },
        ],
      })
    } else {
      setError('Груз с таким трек-номером не найден')
      setTrackingData(null)
    }
    
    setIsSearching(false)
  }

  const StatusIcon = trackingData ? statusIcons[trackingData.status] || Package : Package

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <PageTransition>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary mb-4">
                <Search className="h-4 w-4" />
                Отслеживание
              </div>
              <h1 className="text-4xl font-bold mb-4">Отследить груз</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Введите трек-номер для получения информации о местонахождении вашего груза
              </p>
            </div>
          </PageTransition>

          <SlideUp delay={0.1}>
            <Card className="mb-8">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Введите трек-номер (например: TEST123456)"
                      className="h-12 text-lg"
                      {...register('trackingCode')}
                      error={errors.trackingCode?.message}
                    />
                  </div>
                  <Button type="submit" size="lg" className="h-12" isLoading={isSearching}>
                    <Search className="mr-2 h-5 w-5" />
                    Найти
                  </Button>
                </form>
              </CardContent>
            </Card>
          </SlideUp>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-destructive">
                <CardContent className="py-8 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
                  <h3 className="text-lg font-semibold mb-2">Груз не найден</h3>
                  <p className="text-muted-foreground">{error}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {trackingData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Заказ {trackingData.orderNumber}
                        <Badge className={cn(ORDER_STATUS_COLORS[trackingData.status])}>
                          {ORDER_STATUS_LABELS[trackingData.status]}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Трек-номер: {trackingData.trackingCode}
                      </CardDescription>
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <StatusIcon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Маршрут</p>
                          <p className="font-medium flex items-center gap-2">
                            {trackingData.pickupCity}
                            <ArrowRight className="h-4 w-4" />
                            {trackingData.deliveryCity}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Груз</p>
                          <p className="font-medium">{trackingData.cargoDescription}</p>
                          <p className="text-sm text-muted-foreground">Вес: {trackingData.weight} кг</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {trackingData.currentLocation && (
                        <div className="flex items-center gap-3">
                          <Truck className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Текущее местоположение</p>
                            <p className="font-medium">{trackingData.currentLocation}</p>
                          </div>
                        </div>
                      )}

                      {trackingData.estimatedDelivery && (
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Ожидаемая дата доставки</p>
                            <p className="font-medium">{formatDateTime(trackingData.estimatedDelivery)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>История перемещений</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute left-[17px] top-2 bottom-2 w-0.5 bg-border" />
                    
                    <div className="space-y-6">
                      {trackingData.history.map((event, index) => {
                        const EventIcon = statusIcons[event.status] || Package
                        const isLatest = index === 0
                        
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative flex gap-4"
                          >
                            <div className={cn(
                              'relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2',
                              isLatest 
                                ? 'bg-primary border-primary text-primary-foreground' 
                                : 'bg-background border-muted-foreground/30'
                            )}>
                              <EventIcon className="h-4 w-4" />
                            </div>
                            
                            <div className="flex-1 pb-2">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className={cn('font-medium', !isLatest && 'text-muted-foreground')}>
                                    {ORDER_STATUS_LABELS[event.status]}
                                  </p>
                                  <p className="text-sm text-muted-foreground">{event.location}</p>
                                  {event.notes && (
                                    <p className="text-sm mt-1">{event.notes}</p>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground whitespace-nowrap">
                                  {formatDateTime(event.timestamp)}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {!trackingData && !error && (
            <SlideUp delay={0.2}>
              <Card className="border-dashed">
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="mb-2">Введите трек-номер для поиска груза</p>
                  <p className="text-sm">Для теста используйте: <code className="bg-muted px-2 py-1 rounded">TEST123456</code></p>
                </CardContent>
              </Card>
            </SlideUp>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
