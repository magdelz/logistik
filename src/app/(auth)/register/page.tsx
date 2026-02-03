'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Truck, Mail, Lock, Eye, EyeOff, User, Phone, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { registerSchema, type RegisterInput } from '@/lib/validations'
import { signUp } from '@/lib/api/auth'
import { useToast } from '@/hooks/use-toast'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    try {
      await signUp({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        phone: data.phone,
        companyName: data.companyName,
      })
      toast({
        title: 'Регистрация успешна',
        description: 'Проверьте email для подтверждения аккаунта',
      })
      router.push('/login')
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Ошибка регистрации',
        description: error.message || 'Не удалось создать аккаунт',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Truck className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">LogiTrack</span>
          </Link>
          <h1 className="text-2xl font-bold">Создание аккаунта</h1>
          <p className="text-muted-foreground mt-2">
            Зарегистрируйтесь для доступа к личному кабинету
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Регистрация</CardTitle>
              <CardDescription>
                Заполните форму для создания аккаунта
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">ФИО *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    placeholder="Иванов Иван Иванович"
                    className="pl-10"
                    {...register('fullName')}
                    error={errors.fullName?.message}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@mail.ru"
                    className="pl-10"
                    {...register('email')}
                    error={errors.email?.message}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    className="pl-10"
                    {...register('phone')}
                    error={errors.phone?.message}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Название компании</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="companyName"
                    placeholder="ООО Компания"
                    className="pl-10"
                    {...register('companyName')}
                    error={errors.companyName?.message}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Пароль *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Минимум 6 символов"
                    className="pl-10 pr-10"
                    {...register('password')}
                    error={errors.password?.message}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Подтвердите пароль *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Повторите пароль"
                    className="pl-10"
                    {...register('confirmPassword')}
                    error={errors.confirmPassword?.message}
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Зарегистрироваться
              </Button>
              
              <p className="text-sm text-center text-muted-foreground">
                Уже есть аккаунт?{' '}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Войти
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
