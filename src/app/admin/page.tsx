'use client'

import { motion } from 'framer-motion'
import { 
  Package, 
  Truck, 
  Users, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageTransition, SlideUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition'
import { formatCurrency, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, cn } from '@/lib/utils'

const stats = [
  { 
    title: 'Всего заказов', 
    value: '1,234', 
    change: '+12%',
    trend: 'up',
    icon: Package,
    color: 'text-blue-500'
  },
  { 
    title: 'В доставке', 
    value: '56', 
    change: '+8%',
    trend: 'up',
    icon: Truck,
    color: 'text-orange-500'
  },
  { 
    title: 'Клиентов', 
    value: '892', 
    change: '+23%',
    trend: 'up',
    icon: Users,
    color: 'text-green-500'
  },
  { 
    title: 'Выручка', 
    value: '₽4.2M', 
    change: '-3%',
    trend: 'down',
    icon: DollarSign,
    color: 'text-purple-500'
  },
]

const revenueData = [
  { month: 'Янв', value: 2400000 },
  { month: 'Фев', value: 1398000 },
  { month: 'Мар', value: 9800000 },
  { month: 'Апр', value: 3908000 },
  { month: 'Май', value: 4800000 },
  { month: 'Июн', value: 3800000 },
  { month: 'Июл', value: 4300000 },
]

const ordersData = [
  { day: 'Пн', orders: 45 },
  { day: 'Вт', orders: 52 },
  { day: 'Ср', orders: 38 },
  { day: 'Чт', orders: 65 },
  { day: 'Пт', orders: 78 },
  { day: 'Сб', orders: 32 },
  { day: 'Вс', orders: 28 },
]

const statusData = [
  { name: 'Доставлено', value: 650, color: '#22c55e' },
  { name: 'В пути', value: 280, color: '#3b82f6' },
  { name: 'Ожидает', value: 120, color: '#eab308' },
  { name: 'Отменено', value: 50, color: '#ef4444' },
]

const recentOrders = [
  { id: 'LT24001234', client: 'ООО Ромашка', route: 'Москва → СПб', status: 'in_transit', amount: 12500 },
  { id: 'LT24001233', client: 'ИП Иванов', route: 'Казань → Москва', status: 'delivered', amount: 8900 },
  { id: 'LT24001232', client: 'АО Техноком', route: 'Москва → Екб', status: 'pending', amount: 25600 },
  { id: 'LT24001231', client: 'ООО Логистик', route: 'НН → Москва', status: 'pickup', amount: 5400 },
  { id: 'LT24001230', client: 'ЗАО ПромТорг', route: 'Москва → Казань', status: 'confirmed', amount: 18200 },
]

export default function AdminDashboardPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Обзор ключевых показателей системы
          </p>
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
                    <stat.icon className={cn('h-5 w-5', stat.color)} />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline justify-between">
                      <span className="text-3xl font-bold">{stat.value}</span>
                      <span className={cn(
                        'flex items-center text-sm font-medium',
                        stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      )}>
                        {stat.trend === 'up' ? (
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 mr-1" />
                        )}
                        {stat.change}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="grid gap-6 lg:grid-cols-2">
          <SlideUp delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle>Выручка по месяцам</CardTitle>
                <CardDescription>Динамика выручки за последние 7 месяцев</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis 
                        className="text-xs" 
                        tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                      />
                      <Tooltip 
                        formatter={(value: number) => [formatCurrency(value), 'Выручка']}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </SlideUp>

          <SlideUp delay={0.2}>
            <Card>
              <CardHeader>
                <CardTitle>Заказы по дням</CardTitle>
                <CardDescription>Количество заказов за текущую неделю</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ordersData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="day" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        formatter={(value: number) => [value, 'Заказов']}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar 
                        dataKey="orders" 
                        fill="hsl(var(--primary))" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </SlideUp>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <SlideUp delay={0.3} className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Последние заказы</CardTitle>
                <CardDescription>Недавно созданные заказы в системе</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.client}</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm">{order.route}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={cn('text-xs', ORDER_STATUS_COLORS[order.status])}>
                          {ORDER_STATUS_LABELS[order.status]}
                        </Badge>
                        <span className="font-medium">{formatCurrency(order.amount)}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </SlideUp>

          <SlideUp delay={0.4}>
            <Card>
              <CardHeader>
                <CardTitle>Статусы заказов</CardTitle>
                <CardDescription>Распределение по статусам</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {statusData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-3 w-3 rounded-full" 
                          style={{ backgroundColor: item.color }} 
                        />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </SlideUp>
        </div>
      </div>
    </PageTransition>
  )
}
