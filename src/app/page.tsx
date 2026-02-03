'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  Shield, 
  Calculator, 
  Search,
  ArrowRight,
  CheckCircle,
  Users,
  Globe
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageTransition, SlideUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition'

const features = [
  {
    icon: Truck,
    title: 'Грузоперевозки',
    description: 'Доставка грузов любого объёма по всей России'
  },
  {
    icon: Clock,
    title: 'Экспресс-доставка',
    description: 'Срочная доставка за 1-2 дня'
  },
  {
    icon: Shield,
    title: 'Страхование',
    description: 'Полная страховка груза на всём пути'
  },
  {
    icon: MapPin,
    title: 'Отслеживание',
    description: 'Отслеживание груза в реальном времени'
  },
]

const stats = [
  { value: '10+', label: 'Лет на рынке' },
  { value: '50K+', label: 'Доставленных грузов' },
  { value: '100+', label: 'Городов доставки' },
  { value: '99%', label: 'Довольных клиентов' },
]

const advantages = [
  'Собственный автопарк более 200 единиц техники',
  'Сеть складов по всей России',
  'Индивидуальный подход к каждому клиенту',
  'Гибкая система скидок для постоянных клиентов',
  'Круглосуточная поддержка клиентов',
  'Электронный документооборот',
]

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-20 md:py-32">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="container relative">
            <PageTransition>
              <div className="mx-auto max-w-3xl text-center text-white">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur"
                >
                  <Truck className="h-4 w-4" />
                  Надёжная доставка по всей России
                </motion.div>
                
                <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
                  Логистика нового поколения
                </h1>
                
                <p className="mb-8 text-lg text-blue-100 md:text-xl">
                  Быстрая и надёжная доставка грузов. Отслеживайте посылки в реальном времени,
                  рассчитывайте стоимость онлайн и управляйте заказами в личном кабинете.
                </p>
                
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Button size="lg" asChild>
                    <Link href="/calculator">
                      <Calculator className="mr-2 h-5 w-5" />
                      Рассчитать стоимость
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700 dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-blue-700 bg-blue-600/30 dark:bg-blue-600/30" asChild>
                    <Link href="/tracking">
                      <Search className="mr-2 h-5 w-5" />
                      Отследить груз
                    </Link>
                  </Button>
                </div>
              </div>
            </PageTransition>
          </div>
          
          <div className="absolute -bottom-1 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-background"/>
            </svg>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container">
            <SlideUp>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Наши услуги</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Полный спектр логистических услуг для бизнеса и частных клиентов
                </p>
              </div>
            </SlideUp>
            
            <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <StaggerItem key={feature.title}>
                  <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                    <Card className="h-full border-2 hover:border-primary/50 transition-colors">
                      <CardHeader>
                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <feature.icon className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{feature.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        <section className="bg-muted/50 py-16 md:py-24">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <SlideUp>
                <div>
                  <h2 className="text-3xl font-bold mb-6">Почему выбирают нас?</h2>
                  <p className="text-muted-foreground mb-8">
                    Более 10 лет мы обеспечиваем надёжную доставку грузов по всей России. 
                    Наша команда профессионалов гарантирует сохранность вашего груза и 
                    своевременную доставку.
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    {advantages.map((advantage, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                        <span>{advantage}</span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  <Button asChild>
                    <Link href="/about">
                      Узнать больше
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </SlideUp>
              
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="text-center p-6">
                      <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container">
            <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 md:p-12 text-white text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-4">
                  Готовы начать сотрудничество?
                </h2>
                <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                  Зарегистрируйтесь сейчас и получите доступ к личному кабинету для управления 
                  заказами, отслеживания грузов и просмотра истории доставок.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link href="/register">
                      <Users className="mr-2 h-5 w-5" />
                      Зарегистрироваться
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700 dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-blue-700 bg-blue-600/30 dark:bg-blue-600/30" asChild>
                    <Link href="/contacts">
                      <Globe className="mr-2 h-5 w-5" />
                      Связаться с нами
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
