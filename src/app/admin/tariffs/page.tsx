'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Plus, Edit, Trash2, MoreHorizontal, Check, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageTransition } from '@/components/animations/page-transition'
import { formatCurrency, cn } from '@/lib/utils'

const mockTariffs = [
  { id: '1', name: 'Стандарт', basePrice: 1500, pricePerKg: 50, pricePerKm: 15, minDays: 3, maxDays: 5, isExpress: false, isActive: true },
  { id: '2', name: 'Экспресс', basePrice: 3000, pricePerKg: 80, pricePerKm: 25, minDays: 1, maxDays: 2, isExpress: true, isActive: true },
  { id: '3', name: 'Эконом', basePrice: 800, pricePerKg: 30, pricePerKm: 10, minDays: 5, maxDays: 7, isExpress: false, isActive: true },
  { id: '4', name: 'Премиум', basePrice: 5000, pricePerKg: 100, pricePerKm: 35, minDays: 1, maxDays: 1, isExpress: true, isActive: true },
  { id: '5', name: 'Грузовой', basePrice: 2500, pricePerKg: 20, pricePerKm: 12, minDays: 4, maxDays: 6, isExpress: false, isActive: false },
]

export default function AdminTariffsPage() {
  const [tariffs, setTariffs] = useState(mockTariffs)

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Тарифы</h1>
            <p className="text-muted-foreground">Управление тарифами доставки</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />Добавить тариф</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Новый тариф</DialogTitle>
                <DialogDescription>Заполните данные нового тарифа</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Название</Label>
                  <Input placeholder="Название тарифа" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Базовая цена (₽)</Label>
                    <Input type="number" placeholder="1500" />
                  </div>
                  <div className="space-y-2">
                    <Label>Цена за кг (₽)</Label>
                    <Input type="number" placeholder="50" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Мин. дней</Label>
                    <Input type="number" placeholder="3" />
                  </div>
                  <div className="space-y-2">
                    <Label>Макс. дней</Label>
                    <Input type="number" placeholder="5" />
                  </div>
                </div>
                <Button className="w-full">Создать тариф</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: 'Всего тарифов', value: tariffs.length, color: 'text-blue-500' },
            { label: 'Активных', value: tariffs.filter(t => t.isActive).length, color: 'text-green-500' },
            { label: 'Экспресс', value: tariffs.filter(t => t.isExpress).length, color: 'text-orange-500' },
            { label: 'Средняя базовая цена', value: formatCurrency(tariffs.reduce((a, b) => a + b.basePrice, 0) / tariffs.length), color: 'text-purple-500' },
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
            <CardTitle>Список тарифов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Базовая цена</TableHead>
                    <TableHead>За кг</TableHead>
                    <TableHead>За км</TableHead>
                    <TableHead>Срок</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tariffs.map((tariff, index) => (
                    <motion.tr
                      key={tariff.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">{tariff.name}</TableCell>
                      <TableCell>{formatCurrency(tariff.basePrice)}</TableCell>
                      <TableCell>{formatCurrency(tariff.pricePerKg)}</TableCell>
                      <TableCell>{formatCurrency(tariff.pricePerKm)}</TableCell>
                      <TableCell>{tariff.minDays}-{tariff.maxDays} дн.</TableCell>
                      <TableCell>
                        {tariff.isExpress ? (
                          <Badge className="bg-orange-100 text-orange-800">Экспресс</Badge>
                        ) : (
                          <Badge variant="secondary">Стандарт</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {tariff.isActive ? (
                          <Badge className="bg-green-100 text-green-800"><Check className="h-3 w-3 mr-1" />Активен</Badge>
                        ) : (
                          <Badge variant="secondary"><X className="h-3 w-3 mr-1" />Неактивен</Badge>
                        )}
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
