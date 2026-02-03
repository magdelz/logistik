'use client'

import { motion } from 'framer-motion'
import { Truck, Package, Clock, Shield, MapPin, Warehouse, Globe, HeadphonesIcon } from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageTransition, SlideUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition'

const services = [
  {
    icon: Truck,
    title: 'Автомобильные перевозки',
    description: 'Доставка грузов автотранспортом по всей России. Полная и сборная загрузка.',
    features: ['Доставка от двери до двери', 'Отслеживание в реальном времени', 'Страхование груза'],
  },
  {
    icon: Package,
    title: 'Экспресс-доставка',
    description: 'Срочная доставка документов и посылок в кратчайшие сроки.',
    features: ['Доставка за 1-2 дня', 'Приоритетная обработка', 'SMS-уведомления'],
  },
  {
    icon: Warehouse,
    title: 'Складские услуги',
    description: 'Ответственное хранение грузов на современных складских комплексах.',
    features: ['Климат-контроль', 'Инвентаризация', 'Комплектация заказов'],
  },
  {
    icon: Globe,
    title: 'Международные перевозки',
    description: 'Доставка грузов в страны СНГ и Европы с таможенным оформлением.',
    features: ['Таможенное оформление', 'Мультимодальные перевозки', 'Консолидация грузов'],
  },
  {
    icon: Shield,
    title: 'Страхование грузов',
    description: 'Полное страхование грузов от всех рисков при перевозке.',
    features: ['100% компенсация', 'Быстрое оформление', 'Любые типы грузов'],
  },
  {
    icon: HeadphonesIcon,
    title: 'Персональный менеджер',
    description: 'Индивидуальное сопровождение крупных клиентов и проектов.',
    features: ['Личный менеджер 24/7', 'Гибкие условия', 'Приоритетная поддержка'],
  },
]

const stats = [
  { value: '10+', label: 'лет опыта' },
  { value: '50K+', label: 'доставок в год' },
  { value: '500+', label: 'городов доставки' },
  { value: '99%', label: 'довольных клиентов' },
]

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <PageTransition>
          <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-background">
            <div className="container mx-auto px-4">
              <SlideUp>
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <h1 className="text-4xl md:text-5xl font-bold mb-6">Наши услуги</h1>
                  <p className="text-xl text-muted-foreground">
                    Полный спектр логистических решений для вашего бизнеса. 
                    От экспресс-доставки до комплексного управления цепочкой поставок.
                  </p>
                </div>
              </SlideUp>

              <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <StaggerItem key={service.title}>
                    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                            <service.icon className="h-6 w-6 text-primary" />
                          </div>
                          <CardTitle>{service.title}</CardTitle>
                          <CardDescription>{service.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {service.features.map((feature) => (
                              <li key={feature} className="flex items-center gap-2 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          <section className="py-20 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4">
              <div className="grid gap-8 md:grid-cols-4 text-center">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                    <div className="text-primary-foreground/80">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-20">
            <div className="container mx-auto px-4 text-center">
              <SlideUp>
                <h2 className="text-3xl font-bold mb-6">Готовы начать?</h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Рассчитайте стоимость доставки прямо сейчас или свяжитесь с нами для консультации
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Button size="lg" asChild>
                    <Link href="/calculator">Рассчитать стоимость</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/contacts">Связаться с нами</Link>
                  </Button>
                </div>
              </SlideUp>
            </div>
          </section>
        </PageTransition>
      </main>
      <Footer />
    </>
  )
}
