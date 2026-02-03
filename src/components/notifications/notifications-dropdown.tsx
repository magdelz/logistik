'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Package, Truck, CheckCircle, AlertCircle, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { supabase } from '@/lib/supabase/client'
import { formatDateTime, cn } from '@/lib/utils'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  is_read: boolean
  created_at: string
  link?: string | null
}

const notificationIcons: Record<string, typeof Package> = {
  order_update: Package,
  delivery: Truck,
  system: AlertCircle,
  promotion: CheckCircle,
  info: AlertCircle,
}

const notificationColors: Record<string, string> = {
  order_update: 'text-blue-500',
  delivery: 'text-green-500',
  system: 'text-orange-500',
  promotion: 'text-purple-500',
  info: 'text-blue-500',
}

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10)

        if (error) throw error

        setNotifications(data || [])
        setUnreadCount(data?.filter(n => !n.is_read).length || 0)
      } catch (error) {
        console.error('Error fetching notifications:', error)
        // Use mock data if table doesn't exist
        setNotifications([
          {
            id: '1',
            title: 'Заказ в пути',
            message: 'Ваш заказ LT24001234 отправлен и уже в пути',
            type: 'delivery',
            is_read: false,
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'Заказ доставлен',
            message: 'Заказ LT24001233 успешно доставлен',
            type: 'order_update',
            is_read: true,
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: '3',
            title: 'Скидка 10%',
            message: 'Используйте промокод WELCOME10 для скидки',
            type: 'promotion',
            is_read: true,
            created_at: new Date(Date.now() - 172800000).toISOString(),
          },
        ])
        setUnreadCount(1)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const markAsRead = async (id: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)

      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false)

      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
            >
              {unreadCount}
            </motion.span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold">Уведомления</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Прочитать все
            </Button>
          )}
        </div>
        
        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Нет уведомлений</p>
            </div>
          ) : (
            <AnimatePresence>
              {notifications.map((notification, index) => {
                const Icon = notificationIcons[notification.type] || AlertCircle
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'px-4 py-3 border-b last:border-0 hover:bg-muted/50 cursor-pointer transition-colors',
                      !notification.is_read && 'bg-primary/5'
                    )}
                    onClick={() => !notification.is_read && markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className={cn('mt-0.5', notificationColors[notification.type])}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn('text-sm font-medium', !notification.is_read && 'font-semibold')}>
                            {notification.title}
                          </p>
                          {!notification.is_read && (
                            <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDateTime(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="px-4 py-3 border-t">
            <Button variant="ghost" className="w-full" size="sm">
              Все уведомления
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
