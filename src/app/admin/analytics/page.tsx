'use client'

import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Users, 
  DollarSign, 
  Truck,
  Calendar,
  Download
} from 'lucide-react'
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageTransition, SlideUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition'
import { formatCurrency, cn } from '@/lib/utils'

const revenueData = [
  { month: 'Янв', revenue: 2400000, orders: 120, clients: 45 },
  { month: 'Фев', revenue: 1800000, orders: 95, clients: 38 },
  { month: 'Мар', revenue: 3200000, orders: 156, clients: 62 },
  { month: 'Апр', revenue: 2800000, orders: 142, clients: 55 },
  { month: 'Май', revenue: 3600000, orders: 178, clients: 71 },
  { month: 'Июн', revenue: 4100000, orders: 195, clients: 82 },
  { month: 'Июл', revenue: 3900000, orders: 188, clients: 78 },
]

const routeData = [
  { name: 'Москва - СПб', value: 35 },
  { name: 'Москва - Казань', value: 25 },
  { name: 'Москва - Екб', value: 20 },
  { name: 'СПб - Казань', value: 12 },
  { name: 'Другие', value: 8 },
]

const cargoTypeData = [
  { type: 'Стандартный', count: 450 },
  { type: 'Хрупкий', count: 180 },
  { type: 'Ценный', count: 120 },
  { type: 'Негабарит', count: 85 },
  { type: 'Опасный', count: 45 },
]

const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#8b5cf6']

const stats = [
  { title: 'Выручка за месяц', value: '₽4.1M', change: '+12%', trend: 'up', icon: DollarSign },
  { title: 'Заказов за месяц', value: '195', change: '+8%', trend: 'up', icon: Package },
  { title: 'Новых клиентов', value: '82', change: '+23%', trend: 'up', icon: Users },
  { title: 'Среднее время доставки', value: '2.4 дн', change: '-5%', trend: 'up', icon: Truck },
]

export default function AdminAnalyticsPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Аналитика</h1>
            <p className="text-muted-foreground">Детальная статистика и отчёты</p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="month">
              <SelectTrigger className="w-[150px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Неделя</SelectItem>
                <SelectItem value="month">Месяц</SelectItem>
                <SelectItem value="quarter">Квартал</SelectItem>
                <SelectItem value="year">Год</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Экспорт
            </Button>
          </div>
        </div>

        <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StaggerItem key={stat.title}>
              <motion.div whileHover={{ y: -2 }}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-bold">{stat.value}</span>
                      <span className={cn(
                        'flex items-center text-sm font-medium',
                        stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      )}>
                        {stat.trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                        {stat.change}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList>
            <TabsTrigger value="revenue">Выручка</TabsTrigger>
            <TabsTrigger value="orders">Заказы</TabsTrigger>
            <TabsTrigger value="routes">Маршруты</TabsTrigger>
            <TabsTrigger value="cargo">Типы грузов</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue">
            <SlideUp>
              <Card>
                <CardHeader>
                  <CardTitle>Динамика выручки</CardTitle>
                  <CardDescription>Выручка за последние 7 месяцев</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                        <Tooltip formatter={(value: number) => [formatCurrency(value), 'Выручка']} />
                        <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </SlideUp>
          </TabsContent>

          <TabsContent value="orders">
            <SlideUp>
              <Card>
                <CardHeader>
                  <CardTitle>Количество заказов</CardTitle>
                  <CardDescription>Заказы и новые клиенты по месяцам</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="orders" name="Заказы" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="clients" name="Клиенты" fill="#22c55e" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </SlideUp>
          </TabsContent>

          <TabsContent value="routes">
            <SlideUp>
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Популярные маршруты</CardTitle>
                    <CardDescription>Распределение заказов по маршрутам</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={routeData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            dataKey="value"
                            label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {routeData.map((entry, index) => (
                              <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Топ маршрутов</CardTitle>
                    <CardDescription>Самые популярные направления</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {routeData.map((route, index) => (
                        <div key={route.name} className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: COLORS[index] }}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{route.name}</p>
                            <div className="w-full bg-muted rounded-full h-2 mt-1">
                              <div className="h-2 rounded-full" style={{ width: `${route.value}%`, backgroundColor: COLORS[index] }} />
                            </div>
                          </div>
                          <span className="font-bold">{route.value}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </SlideUp>
          </TabsContent>

          <TabsContent value="cargo">
            <SlideUp>
              <Card>
                <CardHeader>
                  <CardTitle>Типы грузов</CardTitle>
                  <CardDescription>Распределение заказов по типам грузов</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={cargoTypeData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis type="number" />
                        <YAxis dataKey="type" type="category" width={100} />
                        <Tooltip />
                        <Bar dataKey="count" name="Количество" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </SlideUp>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}
