'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Settings, Bell, Shield, Palette, Globe, Save, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageTransition, SlideUp } from '@/components/animations/page-transition'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'

const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  orderUpdates: z.boolean(),
  promotions: z.boolean(),
})

type NotificationSettings = z.infer<typeof notificationSchema>

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [theme, setTheme] = useState('system')
  const { toast } = useToast()

  const { register, handleSubmit, setValue } = useForm<NotificationSettings>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      orderUpdates: true,
      promotions: false,
    },
  })

  const onNotificationSubmit = async (data: NotificationSettings) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      toast({ title: 'Настройки сохранены', description: 'Уведомления обновлены' })
    } catch (error) {
      toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось сохранить настройки' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.classList.toggle('dark', isDark)
    }
    localStorage.setItem('theme', newTheme)
    toast({ title: 'Тема изменена' })
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'system'
    setTheme(savedTheme)
  }, [])

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Настройки</h1>
          <p className="text-muted-foreground">Управление настройками аккаунта</p>
        </div>

        <Tabs defaultValue="notifications">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Уведомления
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="mr-2 h-4 w-4" />
              Внешний вид
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="mr-2 h-4 w-4" />
              Безопасность
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="mt-6">
            <SlideUp>
              <Card>
                <CardHeader>
                  <CardTitle>Настройки уведомлений</CardTitle>
                  <CardDescription>Выберите, какие уведомления вы хотите получать</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onNotificationSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Email-уведомления</p>
                          <p className="text-sm text-muted-foreground">Получать уведомления на email</p>
                        </div>
                        <input type="checkbox" {...register('emailNotifications')} className="h-5 w-5" />
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">SMS-уведомления</p>
                          <p className="text-sm text-muted-foreground">Получать уведомления по SMS</p>
                        </div>
                        <input type="checkbox" {...register('smsNotifications')} className="h-5 w-5" />
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Обновления заказов</p>
                          <p className="text-sm text-muted-foreground">Уведомления об изменении статуса заказов</p>
                        </div>
                        <input type="checkbox" {...register('orderUpdates')} className="h-5 w-5" />
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Акции и предложения</p>
                          <p className="text-sm text-muted-foreground">Получать информацию о скидках</p>
                        </div>
                        <input type="checkbox" {...register('promotions')} className="h-5 w-5" />
                      </div>
                    </div>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      Сохранить
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </SlideUp>
          </TabsContent>

          <TabsContent value="appearance" className="mt-6">
            <SlideUp>
              <Card>
                <CardHeader>
                  <CardTitle>Внешний вид</CardTitle>
                  <CardDescription>Настройте внешний вид приложения</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Label>Тема оформления</Label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: 'light', label: 'Светлая', icon: '☀️' },
                        { value: 'dark', label: 'Тёмная', icon: '🌙' },
                        { value: 'system', label: 'Системная', icon: '💻' },
                      ].map((t) => (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => handleThemeChange(t.value)}
                          className={`p-4 border rounded-lg text-center transition-all ${
                            theme === t.value ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                          }`}
                        >
                          <div className="text-2xl mb-2">{t.icon}</div>
                          <div className="font-medium">{t.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SlideUp>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <SlideUp>
              <Card>
                <CardHeader>
                  <CardTitle>Безопасность</CardTitle>
                  <CardDescription>Настройки безопасности аккаунта</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Двухфакторная аутентификация</p>
                        <p className="text-sm text-muted-foreground">Дополнительная защита аккаунта</p>
                      </div>
                      <Button variant="outline">Настроить</Button>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Активные сессии</p>
                        <p className="text-sm text-muted-foreground">Управление активными устройствами</p>
                      </div>
                      <Button variant="outline">Просмотреть</Button>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg border-destructive/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-destructive">Удалить аккаунт</p>
                        <p className="text-sm text-muted-foreground">Безвозвратное удаление всех данных</p>
                      </div>
                      <Button variant="destructive">Удалить</Button>
                    </div>
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
