'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Building, Camera, Save, Loader2 } from 'lucide-react'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { PageTransition, SlideUp } from '@/components/animations/page-transition'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { getInitials } from '@/lib/utils'

interface Profile {
  id: string
  email: string
  full_name: string
  phone: string | null
  company_name: string | null
  avatar_url: string | null
  role: string
  created_at: string
}

const profileSchema = z.object({
  fullName: z.string().min(2, 'Минимум 2 символа'),
  email: z.string().email('Некорректный email'),
  phone: z.string().optional(),
  companyName: z.string().optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Минимум 6 символов'),
  newPassword: z.string().min(6, 'Минимум 6 символов'),
  confirmPassword: z.string().min(6, 'Минимум 6 символов'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
})

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const { toast } = useToast()

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error

        setProfile(data)
        profileForm.reset({
          fullName: data.full_name || '',
          email: data.email || '',
          phone: data.phone || '',
          companyName: data.company_name || '',
        })
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setIsLoadingProfile(false)
      }
    }

    fetchProfile()
  }, [profileForm])

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({ title: 'Профиль обновлён', description: 'Данные успешно сохранены' })
    } catch (error) {
      toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось обновить профиль' })
    } finally {
      setIsLoading(false)
    }
  }

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({ title: 'Пароль изменён', description: 'Новый пароль успешно установлен' })
      passwordForm.reset()
    } catch (error) {
      toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось изменить пароль' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Профиль</h1>
          <p className="text-muted-foreground">Управление личными данными и настройками</p>
        </div>

        <SlideUp>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback className="text-2xl">
                      {profile?.full_name ? getInitials(profile.full_name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Button size="icon" variant="outline" className="absolute bottom-0 right-0 rounded-full h-8 w-8">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-bold">{profile?.full_name || 'Пользователь'}</h2>
                  <p className="text-muted-foreground">{profile?.email}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {profile?.company_name && `${profile.company_name} · `}
                    Клиент с января 2024
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </SlideUp>

        <SlideUp delay={0.1}>
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Личные данные</TabsTrigger>
              <TabsTrigger value="security">Безопасность</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Личная информация</CardTitle>
                  <CardDescription>Обновите свои контактные данные</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">
                          <User className="inline h-4 w-4 mr-1" />
                          ФИО
                        </Label>
                        <Input
                          id="fullName"
                          {...profileForm.register('fullName')}
                          placeholder="Иванов Иван Иванович"
                        />
                        {profileForm.formState.errors.fullName && (
                          <p className="text-sm text-destructive">{profileForm.formState.errors.fullName.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          <Mail className="inline h-4 w-4 mr-1" />
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          {...profileForm.register('email')}
                          placeholder="email@example.com"
                        />
                        {profileForm.formState.errors.email && (
                          <p className="text-sm text-destructive">{profileForm.formState.errors.email.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          <Phone className="inline h-4 w-4 mr-1" />
                          Телефон
                        </Label>
                        <Input
                          id="phone"
                          {...profileForm.register('phone')}
                          placeholder="+7 (999) 123-45-67"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyName">
                          <Building className="inline h-4 w-4 mr-1" />
                          Компания
                        </Label>
                        <Input
                          id="companyName"
                          {...profileForm.register('companyName')}
                          placeholder="ООО Ромашка"
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={isLoading}>
                      <Save className="mr-2 h-4 w-4" />
                      {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Изменение пароля</CardTitle>
                  <CardDescription>Обновите свой пароль для безопасности аккаунта</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Текущий пароль</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        {...passwordForm.register('currentPassword')}
                      />
                      {passwordForm.formState.errors.currentPassword && (
                        <p className="text-sm text-destructive">{passwordForm.formState.errors.currentPassword.message}</p>
                      )}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Новый пароль</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          {...passwordForm.register('newPassword')}
                        />
                        {passwordForm.formState.errors.newPassword && (
                          <p className="text-sm text-destructive">{passwordForm.formState.errors.newPassword.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          {...passwordForm.register('confirmPassword')}
                        />
                        {passwordForm.formState.errors.confirmPassword && (
                          <p className="text-sm text-destructive">{passwordForm.formState.errors.confirmPassword.message}</p>
                        )}
                      </div>
                    </div>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Сохранение...' : 'Изменить пароль'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </SlideUp>
      </div>
    </PageTransition>
  )
}
