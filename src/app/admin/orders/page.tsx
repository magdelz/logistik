'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PageTransition } from '@/components/animations/page-transition'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, formatCurrency, formatDate, cn } from '@/lib/utils'

const mockOrders = [
  { id: '1', orderNumber: 'LT24001234', client: 'ООО Ромашка', route: 'Москва → СПб', status: 'in_transit', weight: 150, cost: 12500, date: '2024-01-20' },
  { id: '2', orderNumber: 'LT24001233', client: 'ИП Иванов И.И.', route: 'Казань → Москва', status: 'delivered', weight: 45, cost: 8900, date: '2024-01-19' },
  { id: '3', orderNumber: 'LT24001232', client: 'АО Техноком', route: 'Москва → Екатеринбург', status: 'pending', weight: 320, cost: 25600, date: '2024-01-18' },
  { id: '4', orderNumber: 'LT24001231', client: 'ООО Логистик Плюс', route: 'Нижний Новгород → Москва', status: 'pickup', weight: 78, cost: 5400, date: '2024-01-17' },
  { id: '5', orderNumber: 'LT24001230', client: 'ЗАО ПромТорг', route: 'Москва → Казань', status: 'confirmed', weight: 210, cost: 18200, date: '2024-01-16' },
  { id: '6', orderNumber: 'LT24001229', client: 'ООО СтройМатериалы', route: 'Краснодар → Москва', status: 'in_transit', weight: 500, cost: 35000, date: '2024-01-15' },
  { id: '7', orderNumber: 'LT24001228', client: 'ИП Петров А.В.', route: 'Москва → Новосибирск', status: 'cancelled', weight: 25, cost: 4200, date: '2024-01-14' },
]

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Заказы</h1>
            <p className="text-muted-foreground">Управление всеми заказами системы</p>
          </div>
          <Button asChild>
            <Link href="/admin/orders/new">
              <Plus className="mr-2 h-4 w-4" />
              Создать заказ
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по номеру или клиенту..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
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
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Номер</TableHead>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Маршрут</TableHead>
                    <TableHead>Вес</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Стоимость</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>{order.client}</TableCell>
                      <TableCell>{order.route}</TableCell>
                      <TableCell>{order.weight} кг</TableCell>
                      <TableCell>
                        <Badge className={cn('text-xs', ORDER_STATUS_COLORS[order.status])}>
                          {ORDER_STATUS_LABELS[order.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(order.cost)}</TableCell>
                      <TableCell>{formatDate(order.date)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Просмотр
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Редактировать
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Удалить
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Показано {filteredOrders.length} из {mockOrders.length} заказов
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm"><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}
