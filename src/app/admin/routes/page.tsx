'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Map, Plus, Edit, Trash2, MoreHorizontal, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { PageTransition } from '@/components/animations/page-transition'
import { formatDistance, cn } from '@/lib/utils'

const mockRoutes = [
  { id: '1', name: 'Москва - Санкт-Петербург', origin: 'Москва', destination: 'Санкт-Петербург', distance: 700, estimatedHours: 10, isActive: true },
  { id: '2', name: 'Москва - Екатеринбург', origin: 'Москва', destination: 'Екатеринбург', distance: 1800, estimatedHours: 24, isActive: true },
  { id: '3', name: 'Москва - Казань', origin: 'Москва', destination: 'Казань', distance: 820, estimatedHours: 12, isActive: true },
  { id: '4', name: 'Санкт-Петербург - Казань', origin: 'Санкт-Петербург', destination: 'Казань', distance: 1530, estimatedHours: 20, isActive: true },
  { id: '5', name: 'Москва - Краснодар', origin: 'Москва', destination: 'Краснодар', distance: 1350, estimatedHours: 16, isActive: true },
  { id: '6', name: 'Москва - Новосибирск', origin: 'Москва', destination: 'Новосибирск', distance: 3300, estimatedHours: 48, isActive: false },
]

export default function AdminRoutesPage() {
  const [routes] = useState(mockRoutes)

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Маршруты</h1>
            <p className="text-muted-foreground">Управление маршрутами доставки</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />Добавить маршрут</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Новый маршрут</DialogTitle>
                <DialogDescription>Создайте новый маршрут доставки</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Название</Label>
                  <Input placeholder="Москва - Казань" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Город отправления</Label>
                    <Input placeholder="Москва" />
                  </div>
                  <div className="space-y-2">
                    <Label>Город назначения</Label>
                    <Input placeholder="Казань" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Расстояние (км)</Label>
                    <Input type="number" placeholder="820" />
                  </div>
                  <div className="space-y-2">
                    <Label>Время в пути (ч)</Label>
                    <Input type="number" placeholder="12" />
                  </div>
                </div>
                <Button className="w-full">Создать маршрут</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: 'Всего маршрутов', value: routes.length, color: 'text-blue-500' },
            { label: 'Активных', value: routes.filter(r => r.isActive).length, color: 'text-green-500' },
            { label: 'Общая дистанция', value: formatDistance(routes.reduce((a, b) => a + b.distance, 0)), color: 'text-purple-500' },
            { label: 'Городов', value: new Set(routes.flatMap(r => [r.origin, r.destination])).size, color: 'text-orange-500' },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={cn('text-2xl font-bold', stat.color)}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Список маршрутов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Маршрут</TableHead>
                    <TableHead>Направление</TableHead>
                    <TableHead>Расстояние</TableHead>
                    <TableHead>Время в пути</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {routes.map((route, index) => (
                    <motion.tr
                      key={route.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">{route.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{route.origin}</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <span>{route.destination}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDistance(route.distance)}</TableCell>
                      <TableCell>{route.estimatedHours} ч</TableCell>
                      <TableCell>
                        <Badge variant={route.isActive ? 'default' : 'secondary'}>
                          {route.isActive ? 'Активен' : 'Неактивен'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Редактировать</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Удалить</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}
