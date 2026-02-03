'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageTransition, SlideUp, SlideInLeft, SlideInRight } from '@/components/animations/page-transition'
import { useToast } from '@/hooks/use-toast'

const contactSchema = z.object({
  name: z.string().min(2, 'Введите имя'),
  email: z.string().email('Введите корректный email'),
  phone: z.string().min(10, 'Введите телефон'),
  subject: z.string().min(3, 'Введите тему'),
  message: z.string().min(10, 'Сообщение должно быть не менее 10 символов'),
})

type ContactFormData = z.infer<typeof contactSchema>

const offices = [
  {
    city: 'Москва',
    address: 'ул. Логистическая, 15, офис 301',
    phone: '+7 (495) 123-45-67',
    email: 'moscow@logitrack.ru',
    hours: 'Пн-Пт: 9:00-18:00',
  },
  {
    city: 'Санкт-Петербург',
    address: 'пр. Невский, 100, офис 512',
    phone: '+7 (812) 234-56-78',
    email: 'spb@logitrack.ru',
    hours: 'Пн-Пт: 9:00-18:00',
  },
  {
    city: 'Екатеринбург',
    address: 'ул. Ленина, 50, офис 201',
    phone: '+7 (343) 345-67-89',
    email: 'ekb@logitrack.ru',
    hours: 'Пн-Пт: 9:00-18:00',
  },
]

export default function ContactsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: 'Сообщение отправлено!',
        description: 'Мы свяжемся с вами в ближайшее время.',
      })
      reset()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось отправить сообщение. Попробуйте позже.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <PageTransition>
          <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-background">
            <div className="container mx-auto px-4">
              <SlideUp>
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <h1 className="text-4xl md:text-5xl font-bold mb-6">Контакты</h1>
                  <p className="text-xl text-muted-foreground">
                    Свяжитесь с нами любым удобным способом. Мы всегда рады помочь!
                  </p>
                </div>
              </SlideUp>

              <div className="grid gap-8 lg:grid-cols-2">
                <SlideInLeft>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Напишите нам
                      </CardTitle>
                      <CardDescription>
                        Заполните форму, и мы свяжемся с вами в течение 24 часов
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="name">Имя *</Label>
                            <Input
                              id="name"
                              {...register('name')}
                              placeholder="Ваше имя"
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              {...register('email')}
                              placeholder="email@example.com"
                            />
                            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                          </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Телефон *</Label>
                            <Input
                              id="phone"
                              {...register('phone')}
                              placeholder="+7 (999) 123-45-67"
                            />
                            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="subject">Тема *</Label>
                            <Input
                              id="subject"
                              {...register('subject')}
                              placeholder="Тема обращения"
                            />
                            {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message">Сообщение *</Label>
                          <textarea
                            id="message"
                            {...register('message')}
                            placeholder="Ваше сообщение..."
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                          {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
                        </div>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                          <Send className="mr-2 h-4 w-4" />
                          {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </SlideInLeft>

                <SlideInRight>
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Контактная информация</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Phone className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">Телефон горячей линии</div>
                            <a href="tel:88001234567" className="text-primary hover:underline">8 800 123-45-67</a>
                            <div className="text-sm text-muted-foreground">Бесплатно по России</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Mail className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">Email</div>
                            <a href="mailto:info@logitrack.ru" className="text-primary hover:underline">info@logitrack.ru</a>
                            <div className="text-sm text-muted-foreground">Ответим в течение 24 часов</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Clock className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">Режим работы</div>
                            <div>Пн-Пт: 9:00 - 18:00</div>
                            <div className="text-sm text-muted-foreground">Сб-Вс: выходной</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Для экстренной связи</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">
                          Если у вас срочный вопрос по доставке, позвоните на горячую линию
                        </p>
                        <Button variant="outline" className="w-full" asChild>
                          <a href="tel:88001234567">
                            <Phone className="mr-2 h-4 w-4" />
                            8 800 123-45-67
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </SlideInRight>
              </div>
            </div>
          </section>

          <section className="py-20 bg-muted/50">
            <div className="container mx-auto px-4">
              <SlideUp>
                <h2 className="text-3xl font-bold text-center mb-12">Наши офисы</h2>
              </SlideUp>
              <div className="grid gap-6 md:grid-cols-3">
                {offices.map((office, index) => (
                  <motion.div
                    key={office.city}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          {office.city}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <div className="text-sm text-muted-foreground">Адрес</div>
                          <div>{office.address}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Телефон</div>
                          <a href={`tel:${office.phone.replace(/\D/g, '')}`} className="text-primary hover:underline">
                            {office.phone}
                          </a>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Email</div>
                          <a href={`mailto:${office.email}`} className="text-primary hover:underline">
                            {office.email}
                          </a>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Часы работы</div>
                          <div>{office.hours}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </PageTransition>
      </main>
      <Footer />
    </>
  )
}
