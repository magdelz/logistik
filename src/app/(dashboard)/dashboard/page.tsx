'use client'

import { motion } from 'framer-motion'
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  ArrowRight,
  Plus
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageTransition, SlideUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, formatCurrency, formatDate, cn } from '@/lib/utils'

const stats = [
  { 
    title: 'Всего заказов', 
    value: '12', 
    change: '+2 за месяц',
    icon: Package,
    color: 'text-blue-500'
  },
  { 
    title: 'В пути', 
    value: '3', 
    change: 'Ожидается доставка',
    icon: Truck,
    color: 'text-orange-500'
  },
  { 
    title: 'Доставлено', 
    value: '8', 
    change: '67% от всех',
    icon: CheckCircle,
    color: 'text-green-500'
  },
  { 
    title: 'Ожидают', 
    value: '1', 
    change: 'Подтверждение',
    icon: Clock,
    color: 'text-yellow-500'
  },
]

const recentOrders = [
  {
    id: '1',
    orderNumber: 'LT24000125',
    status: 'in_transit',
    route: 'Москва → Екатеринбург',
    date: '2024-01-20',
    cost: 4500,
  },
  {
    id: '2',
    orderNumber: 'LT24000124',
    status: 'delivered',
    route: 'Санкт-Петербург → Москва',
    date: '2024-01-18',
    cost: 2800,
  },
  {
    id: '3',
    orderNumber: 'LT24000123',
    status: 'pickup',
    route: 'Москва → Казань',
    date: '2024-01-17',
    cost: 3200,
  },
  {
    id: '4',
    orderNumber: 'LT24000122',
    status: 'pending',
    route: 'Нижний Новгород → Москва',
    date: '2024-01-16',
    cost: 1900,
  },
]

export default function DashboardPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Добро пожаловать!</h1>
            <p className="text-muted-foreground">
              Управляйте своими заказами и отслеживайте доставки
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/orders/new">
              <Plus className="mr-2 h-4 w-4" />
              Новый заказ
            </Link>
          </Button>
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
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.change}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="grid gap-6 lg:grid-cols-2">
          <SlideUp delay={0.2}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Последние заказы</CardTitle>
                  <CardDescription>Ваши недавние заказы на доставку</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/orders">
                    Все заказы
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
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
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{order.orderNumber}</span>
                          <Badge className={cn('text-xs', ORDER_STATUS_COLORS[order.status])}>
                            {ORDER_STATUS_LABELS[order.status]}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{order.route}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(order.cost)}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(order.date)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </SlideUp>

          <SlideUp delay={0.3}>
            <Card>
              <CardHeader>
                <CardTitle>Быстрые действия</CardTitle>
                <CardDescription>Часто используемые функции</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/dashboard/orders/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Создать новый заказ
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/calculator">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Рассчитать стоимость
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/tracking">
                    <Truck className="mr-2 h-4 w-4" />
                    Отследить груз
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/dashboard/orders">
                    <Package className="mr-2 h-4 w-4" />
                    Все мои заказы
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  Активная доставка
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Заказ</span>
                    <span className="font-medium">LT24000125</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Маршрут</span>
                    <span>Москва → Екатеринбург</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Статус</span>
                    <Badge className={ORDER_STATUS_COLORS['in_transit']}>
                      В пути
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Текущее положение</span>
                    <span>Казань</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }} />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Ожидаемая дата доставки: 22.01.2024
                  </p>
                </div>
              </CardContent>
            </Card>
          </SlideUp>
        </div>
      </div>
    </PageTransition>
  )
}
