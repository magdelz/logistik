'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Calculator, Truck, Package, MapPin, ArrowRight, Info } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageTransition, SlideUp } from '@/components/animations/page-transition'
import { calculatorSchema, type CalculatorInput } from '@/lib/validations'
import { formatCurrency } from '@/lib/utils'
import type { CalculatorResult } from '@/types'

const cities = [
  'Москва', 'Санкт-Петербург', 'Казань', 'Нижний Новгород', 
  'Екатеринбург', 'Новосибирск', 'Краснодар'
]

const cargoTypes = [
  { value: 'standard', label: 'Стандартный' },
  { value: 'fragile', label: 'Хрупкий' },
  { value: 'perishable', label: 'Скоропортящийся' },
  { value: 'valuable', label: 'Ценный' },
  { value: 'oversized', label: 'Негабаритный' },
]

const mockTariffs = [
  { id: '1', name: 'Эконом', basePrice: 500, pricePerKg: 15, pricePerKm: 5, days: '5-10', express: false },
  { id: '2', name: 'Стандарт', basePrice: 800, pricePerKg: 20, pricePerKm: 7, days: '3-5', express: false },
  { id: '3', name: 'Экспресс', basePrice: 1500, pricePerKg: 35, pricePerKm: 12, days: '1-2', express: true },
]

const distances: Record<string, Record<string, number>> = {
  'Москва': { 'Санкт-Петербург': 710, 'Казань': 820, 'Нижний Новгород': 420, 'Екатеринбург': 1800, 'Новосибирск': 3300, 'Краснодар': 1350 },
  'Санкт-Петербург': { 'Москва': 710, 'Казань': 1530, 'Нижний Новгород': 1130, 'Екатеринбург': 2500, 'Новосибирск': 4000, 'Краснодар': 2060 },
}

export default function CalculatorPage() {
  const [results, setResults] = useState<CalculatorResult[] | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CalculatorInput>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      weight: 10,
      cargoType: 'standard',
    },
  })

  const originCity = watch('originCity')
  const destinationCity = watch('destinationCity')

  const onSubmit = async (data: CalculatorInput) => {
    setIsCalculating(true)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const distance = distances[data.originCity]?.[data.destinationCity] || 1000
    const volume = data.length && data.width && data.height 
      ? (data.length * data.width * data.height) / 1000000 
      : 0

    const calculatedResults: CalculatorResult[] = mockTariffs.map(tariff => {
      const baseCost = tariff.basePrice
      const weightCost = data.weight * tariff.pricePerKg
      const distanceCost = distance * tariff.pricePerKm
      const volumeCost = volume * 500
      const insuranceCost = (data.declaredValue || 0) * 0.005
      const totalCost = baseCost + weightCost + distanceCost + volumeCost + insuranceCost

      return {
        tariffId: tariff.id,
        tariffName: tariff.name,
        baseCost,
        weightCost,
        distanceCost,
        volumeCost,
        insuranceCost,
        totalCost,
        deliveryDays: tariff.days,
        isExpress: tariff.express,
      }
    })

    setResults(calculatedResults)
    setIsCalculating(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container">
          <PageTransition>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary mb-4">
                <Calculator className="h-4 w-4" />
                Онлайн-калькулятор
              </div>
              <h1 className="text-4xl font-bold mb-4">Расчёт стоимости доставки</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Рассчитайте примерную стоимость доставки груза. Укажите маршрут, 
                параметры груза и получите расчёт по всем доступным тарифам.
              </p>
            </div>
          </PageTransition>

          <div className="grid gap-8 lg:grid-cols-2">
            <SlideUp delay={0.1}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Параметры груза
                  </CardTitle>
                  <CardDescription>
                    Заполните информацию о вашем грузе
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Город отправления</Label>
                        <Select onValueChange={(value) => setValue('originCity', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите город" />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city} value={city} disabled={city === destinationCity}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.originCity && (
                          <p className="text-sm text-destructive">{errors.originCity.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Город назначения</Label>
                        <Select onValueChange={(value) => setValue('destinationCity', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите город" />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city} value={city} disabled={city === originCity}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.destinationCity && (
                          <p className="text-sm text-destructive">{errors.destinationCity.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight">Вес груза (кг)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        {...register('weight', { valueAsNumber: true })}
                        error={errors.weight?.message}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="length">Длина (см)</Label>
                        <Input
                          id="length"
                          type="number"
                          {...register('length', { valueAsNumber: true })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="width">Ширина (см)</Label>
                        <Input
                          id="width"
                          type="number"
                          {...register('width', { valueAsNumber: true })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">Высота (см)</Label>
                        <Input
                          id="height"
                          type="number"
                          {...register('height', { valueAsNumber: true })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Тип груза</Label>
                      <Select 
                        defaultValue="standard"
                        onValueChange={(value) => setValue('cargoType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {cargoTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="declaredValue">Объявленная стоимость (₽)</Label>
                      <Input
                        id="declaredValue"
                        type="number"
                        placeholder="Для расчёта страховки"
                        {...register('declaredValue', { valueAsNumber: true })}
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg" isLoading={isCalculating}>
                      <Calculator className="mr-2 h-5 w-5" />
                      Рассчитать стоимость
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </SlideUp>

            <SlideUp delay={0.2}>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Результаты расчёта
                </h2>

                {!results ? (
                  <Card className="border-dashed">
                    <CardContent className="py-12 text-center text-muted-foreground">
                      <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Заполните форму и нажмите "Рассчитать стоимость"</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {results.map((result, index) => (
                      <motion.div
                        key={result.tariffId}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className={result.isExpress ? 'border-primary' : ''}>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                  {result.tariffName}
                                  {result.isExpress && (
                                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                                      Экспресс
                                    </span>
                                  )}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  Срок доставки: {result.deliveryDays} дней
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-primary">
                                  {formatCurrency(result.totalCost)}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                              <div>Базовая стоимость:</div>
                              <div className="text-right">{formatCurrency(result.baseCost)}</div>
                              <div>За вес:</div>
                              <div className="text-right">{formatCurrency(result.weightCost)}</div>
                              <div>За расстояние:</div>
                              <div className="text-right">{formatCurrency(result.distanceCost)}</div>
                              {result.volumeCost > 0 && (
                                <>
                                  <div>За объём:</div>
                                  <div className="text-right">{formatCurrency(result.volumeCost)}</div>
                                </>
                              )}
                              {result.insuranceCost > 0 && (
                                <>
                                  <div>Страховка:</div>
                                  <div className="text-right">{formatCurrency(result.insuranceCost)}</div>
                                </>
                              )}
                            </div>

                            <Button className="w-full mt-4" variant={result.isExpress ? 'default' : 'outline'}>
                              Оформить заказ
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}

                    <div className="flex items-start gap-2 p-4 bg-muted rounded-lg text-sm">
                      <Info className="h-4 w-4 mt-0.5 shrink-0" />
                      <p className="text-muted-foreground">
                        Указанные цены являются предварительными. Окончательная стоимость 
                        будет рассчитана при оформлении заказа.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </SlideUp>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
