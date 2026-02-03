'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, Filter, Eye, Edit, MoreHorizontal, Mail, Phone } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PageTransition } from '@/components/animations/page-transition'
import { getInitials, formatDate, cn } from '@/lib/utils'

const mockClients = [
  { id: '1', name: 'Иванов Иван Иванович', email: 'ivanov@company.ru', phone: '+7 999 123-45-67', company: 'ООО Ромашка', orders: 15, status: 'active', createdAt: '2024-01-10' },
  { id: '2', name: 'Петров Пётр Петрович', email: 'petrov@mail.ru', phone: '+7 999 234-56-78', company: 'ИП Петров', orders: 8, status: 'active', createdAt: '2024-01-05' },
  { id: '3', name: 'Сидорова Анна Михайловна', email: 'sidorova@techno.com', phone: '+7 999 345-67-89', company: 'АО Техноком', orders: 23, status: 'active', createdAt: '2023-12-15' },
  { id: '4', name: 'Козлов Дмитрий Александрович', email: 'kozlov@logistics.ru', phone: '+7 999 456-78-90', company: 'ООО Логистик Плюс', orders: 45, status: 'active', createdAt: '2023-11-20' },
  { id: '5', name: 'Михайлова Елена Сергеевна', email: 'mikhailova@stroy.ru', phone: '+7 999 567-89-01', company: 'ООО СтройМатериалы', orders: 3, status: 'inactive', createdAt: '2024-01-15' },
]

export default function AdminClientsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredClients = mockClients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Клиенты</h1>
          <p className="text-muted-foreground">Управление базой клиентов</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: 'Всего клиентов', value: '892', color: 'text-blue-500' },
            { label: 'Активных', value: '756', color: 'text-green-500' },
            { label: 'Новых за месяц', value: '45', color: 'text-purple-500' },
            { label: 'Корпоративных', value: '128', color: 'text-orange-500' },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={cn('text-3xl font-bold', stat.color)}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по имени, email или компании..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все</SelectItem>
                  <SelectItem value="active">Активные</SelectItem>
                  <SelectItem value="inactive">Неактивные</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Контакты</TableHead>
                    <TableHead>Компания</TableHead>
                    <TableHead>Заказов</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата регистрации</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client, index) => (
                    <motion.tr
                      key={client.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-muted/50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{client.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" /> {client.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" /> {client.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{client.company}</TableCell>
                      <TableCell className="font-medium">{client.orders}</TableCell>
                      <TableCell>
                        <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                          {client.status === 'active' ? 'Активен' : 'Неактивен'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(client.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />Просмотр</DropdownMenuItem>
                            <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Редактировать</DropdownMenuItem>
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
