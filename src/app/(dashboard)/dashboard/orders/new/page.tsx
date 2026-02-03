'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Package, MapPin, Truck, CreditCard, ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageTransition } from '@/components/animations/page-transition'
import { useToast } from '@/hooks/use-toast'
import { CARGO_TYPE_LABELS, formatCurrency, cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'

const orderSchema = z.object({
  pickupCity: z.string().min(1, 'Выберите город отправления'),
  pickupAddress: z.string().min(5, 'Введите адрес отправления'),
  pickupContact: z.string().min(2, 'Введите контактное лицо'),
  pickupPhone: z.string().min(10, 'Введите телефон'),
  deliveryCity: z.string().min(1, 'Выберите город назначения'),
  deliveryAddress: z.string().min(5, 'Введите адрес доставки'),
  deliveryContact: z.string().min(2, 'Введите контактное лицо'),
  deliveryPhone: z.string().min(10, 'Введите телефон'),
  cargoDescription: z.string().min(3, 'Опишите груз'),
  cargoType: z.string().min(1, 'Выберите тип груза'),
  weight: z.number().min(0.1, 'Укажите вес'),
  length: z.number().min(1, 'Укажите длину'),
  width: z.number().min(1, 'Укажите ширину'),
  height: z.number().min(1, 'Укажите высоту'),
  declaredValue: z.number().optional(),
  tariffId: z.string().min(1, 'Выберите тариф'),
  notes: z.string().optional(),
})

type OrderFormData = z.infer<typeof orderSchema>

const cities = ['Москва', 'Санкт-Петербург', 'Екатеринбург', 'Казань', 'Нижний Новгород', 'Краснодар', 'Новосибирск', 'Ростов-на-Дону']

const tariffs = [
  { id: '1', name: 'Стандарт', price: 2500, days: '3-5 дней' },
  { id: '2', name: 'Экспресс', price: 4500, days: '1-2 дня' },
  { id: '3', name: 'Эконом', price: 1800, days: '5-7 дней' },
]

const steps = [
  { id: 1, title: 'Отправление', icon: MapPin },
  { id: 2, title: 'Доставка', icon: Truck },
  { id: 3, title: 'Груз', icon: Package },
  { id: 4, title: 'Оплата', icon: CreditCard },
]

export default function NewOrderPage() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      cargoType: 'standard',
      tariffId: '1',
    },
  })

  const selectedTariff = tariffs.find(t => t.id === watch('tariffId'))
  const weight = watch('weight') || 0

  const calculateTotal = () => {
    if (!selectedTariff) return 0
    return selectedTariff.price + (weight * 50)
  }

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true)
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast({
          variant: 'destructive',
          title: 'Ошибка',
          description: 'Необходимо авторизоваться',
        })
        router.push('/login')
        return
      }

      // Calculate volume
      const volume = (data.length * data.width * data.height) / 1000000 // cm³ to m³

      // Create order in Supabase
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          client_id: user.id,
          pickup_address: `${data.pickupCity}, ${data.pickupAddress}`,
          delivery_address: `${data.deliveryCity}, ${data.deliveryAddress}`,
          cargo_description: data.cargoDescription,
          cargo_type: data.cargoType,
          weight_kg: data.weight,
          volume_m3: volume,
          declared_value: data.declaredValue || 0,
          total_cost: calculateTotal(),
          status: 'pending',
          payment_status: 'pending',
          sender_name: data.pickupContact,
          sender_phone: data.pickupPhone,
          receiver_name: data.deliveryContact,
          receiver_phone: data.deliveryPhone,
          notes: data.notes,
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: 'Заказ создан!',
        description: `Номер заказа: ${order.order_number}. Трек-номер: ${order.tracking_code}`,
      })
      router.push('/dashboard/orders')
    } catch (error: any) {
      console.error('Order creation error:', error)
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: error.message || 'Не удалось создать заказ',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => setStep(s => Math.min(s + 1, 4))
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/orders"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Новый заказ</h1>
            <p className="text-muted-foreground">Заполните данные для создания заказа</p>
          </div>
        </div>

        <div className="flex justify-between mb-8">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className={cn(
                'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors',
                step >= s.id ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30'
              )}>
                {step > s.id ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
              </div>
              <span className={cn('ml-2 hidden sm:block', step >= s.id ? 'text-foreground' : 'text-muted-foreground')}>{s.title}</span>
              {i < steps.length - 1 && <div className={cn('w-12 sm:w-24 h-0.5 mx-2', step > s.id ? 'bg-primary' : 'bg-muted')} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Адрес отправления</CardTitle>
                  <CardDescription>Укажите откуда забрать груз</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Город</Label>
                      <Select onValueChange={(v) => setValue('pickupCity', v)}>
                        <SelectTrigger><SelectValue placeholder="Выберите город" /></SelectTrigger>
                        <SelectContent>
                          {cities.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {errors.pickupCity && <p className="text-sm text-destructive">{errors.pickupCity.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Адрес</Label>
                      <Input {...register('pickupAddress')} placeholder="ул. Примерная, д. 1" />
                      {errors.pickupAddress && <p className="text-sm text-destructive">{errors.pickupAddress.message}</p>}
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Контактное лицо</Label>
                      <Input {...register('pickupContact')} placeholder="Иванов Иван" />
                    </div>
                    <div className="space-y-2">
                      <Label>Телефон</Label>
                      <Input {...register('pickupPhone')} placeholder="+7 (999) 123-45-67" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Адрес доставки</CardTitle>
                  <CardDescription>Укажите куда доставить груз</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Город</Label>
                      <Select onValueChange={(v) => setValue('deliveryCity', v)}>
                        <SelectTrigger><SelectValue placeholder="Выберите город" /></SelectTrigger>
                        <SelectContent>
                          {cities.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Адрес</Label>
                      <Input {...register('deliveryAddress')} placeholder="ул. Примерная, д. 2" />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Контактное лицо</Label>
                      <Input {...register('deliveryContact')} placeholder="Петров Пётр" />
                    </div>
                    <div className="space-y-2">
                      <Label>Телефон</Label>
                      <Input {...register('deliveryPhone')} placeholder="+7 (999) 987-65-43" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Информация о грузе</CardTitle>
                  <CardDescription>Опишите характеристики груза</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Описание груза</Label>
                    <Input {...register('cargoDescription')} placeholder="Электроника, коробки" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Тип груза</Label>
                      <Select defaultValue="standard" onValueChange={(v) => setValue('cargoType', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.entries(CARGO_TYPE_LABELS).map(([key, label]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Вес (кг)</Label>
                      <Input type="number" step="0.1" {...register('weight', { valueAsNumber: true })} placeholder="10" />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Длина (см)</Label>
                      <Input type="number" {...register('length', { valueAsNumber: true })} placeholder="50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Ширина (см)</Label>
                      <Input type="number" {...register('width', { valueAsNumber: true })} placeholder="40" />
                    </div>
                    <div className="space-y-2">
                      <Label>Высота (см)</Label>
                      <Input type="number" {...register('height', { valueAsNumber: true })} placeholder="30" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Объявленная стоимость (₽)</Label>
                    <Input type="number" {...register('declaredValue', { valueAsNumber: true })} placeholder="50000" />
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Выбор тарифа и оплата</CardTitle>
                  <CardDescription>Выберите подходящий тариф доставки</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    {tariffs.map(tariff => (
                      <div
                        key={tariff.id}
                        onClick={() => setValue('tariffId', tariff.id)}
                        className={cn(
                          'p-4 rounded-lg border-2 cursor-pointer transition-all',
                          watch('tariffId') === tariff.id ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
                        )}
                      >
                        <h3 className="font-semibold">{tariff.name}</h3>
                        <p className="text-2xl font-bold mt-2">{formatCurrency(tariff.price)}</p>
                        <p className="text-sm text-muted-foreground">{tariff.days}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Label>Примечания к заказу</Label>
                    <Input {...register('notes')} placeholder="Дополнительная информация..." />
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <div className="flex justify-between mb-2">
                      <span>Базовая стоимость:</span>
                      <span>{formatCurrency(selectedTariff?.price || 0)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Доплата за вес ({weight} кг):</span>
                      <span>{formatCurrency(weight * 50)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Итого:</span>
                      <span>{formatCurrency(calculateTotal())}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          <div className="flex justify-between mt-6">
            <Button type="button" variant="outline" onClick={prevStep} disabled={step === 1}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Назад
            </Button>
            {step < 4 ? (
              <Button type="button" onClick={nextStep}>
                Далее <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Создание...' : 'Создать заказ'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </PageTransition>
  )
}
