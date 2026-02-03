'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Award, Users, Target, Heart, CheckCircle } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent } from '@/components/ui/card'
import { PageTransition, SlideUp, SlideInLeft, SlideInRight, StaggerContainer, StaggerItem } from '@/components/animations/page-transition'

const values = [
  {
    icon: Target,
    title: 'Надёжность',
    description: 'Мы гарантируем доставку в срок и сохранность вашего груза на каждом этапе перевозки.',
  },
  {
    icon: Users,
    title: 'Клиентоориентированность',
    description: 'Индивидуальный подход к каждому клиенту и гибкие решения под ваши задачи.',
  },
  {
    icon: Award,
    title: 'Профессионализм',
    description: 'Команда опытных специалистов с многолетним стажем в логистике.',
  },
  {
    icon: Heart,
    title: 'Ответственность',
    description: 'Мы относимся к вашему грузу как к своему и несём полную ответственность.',
  },
]

const milestones = [
  { year: '2014', title: 'Основание компании', description: 'Начало работы с 5 автомобилями в Москве' },
  { year: '2016', title: 'Расширение географии', description: 'Открытие филиалов в 10 городах России' },
  { year: '2018', title: 'Международные перевозки', description: 'Запуск направления СНГ и Европа' },
  { year: '2020', title: 'Цифровая трансформация', description: 'Внедрение системы онлайн-отслеживания' },
  { year: '2022', title: 'Лидер рынка', description: 'Топ-10 логистических компаний России' },
  { year: '2024', title: '10 лет успеха', description: 'Более 500 000 успешных доставок' },
]

const team = [
  { name: 'Александр Петров', role: 'Генеральный директор', experience: '15 лет в логистике' },
  { name: 'Елена Сидорова', role: 'Коммерческий директор', experience: '12 лет в продажах' },
  { name: 'Дмитрий Козлов', role: 'Директор по операциям', experience: '10 лет в управлении' },
  { name: 'Анна Михайлова', role: 'Директор по развитию', experience: '8 лет в логистике' },
]

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <PageTransition>
          <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-background">
            <div className="container mx-auto px-4">
              <div className="grid gap-12 lg:grid-cols-2 items-center">
                <SlideInLeft>
                  <h1 className="text-4xl md:text-5xl font-bold mb-6">О компании LogiTrack</h1>
                  <p className="text-xl text-muted-foreground mb-6">
                    Мы — одна из ведущих логистических компаний России с более чем 10-летним опытом 
                    в сфере грузоперевозок. Наша миссия — сделать логистику простой, надёжной и доступной.
                  </p>
                  <p className="text-muted-foreground mb-6">
                    За годы работы мы выстроили надёжную сеть партнёров, внедрили современные 
                    технологии отслеживания и автоматизации, и заслужили доверие тысяч клиентов 
                    по всей стране.
                  </p>
                  <div className="flex gap-8">
                    <div>
                      <div className="text-3xl font-bold text-primary">10+</div>
                      <div className="text-sm text-muted-foreground">лет на рынке</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary">500+</div>
                      <div className="text-sm text-muted-foreground">сотрудников</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary">50K+</div>
                      <div className="text-sm text-muted-foreground">доставок в год</div>
                    </div>
                  </div>
                </SlideInLeft>
                <SlideInRight>
                  <div className="relative h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-primary mb-4">LogiTrack</div>
                      <div className="text-xl text-muted-foreground">Ваш надёжный партнёр в логистике</div>
                    </div>
                  </div>
                </SlideInRight>
              </div>
            </div>
          </section>

          <section className="py-20">
            <div className="container mx-auto px-4">
              <SlideUp>
                <h2 className="text-3xl font-bold text-center mb-12">Наши ценности</h2>
              </SlideUp>
              <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {values.map((value) => (
                  <StaggerItem key={value.title}>
                    <Card className="h-full text-center hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <value.icon className="h-7 w-7 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                        <p className="text-sm text-muted-foreground">{value.description}</p>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          <section className="py-20 bg-muted/50">
            <div className="container mx-auto px-4">
              <SlideUp>
                <h2 className="text-3xl font-bold text-center mb-12">История компании</h2>
              </SlideUp>
              <div className="max-w-4xl mx-auto">
                <div className="relative">
                  <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary/20" />
                  {milestones.map((milestone, index) => (
                    <motion.div
                      key={milestone.year}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className={`relative flex items-center mb-8 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                        <div className="bg-background p-4 rounded-lg shadow-sm border">
                          <div className="text-primary font-bold text-lg">{milestone.year}</div>
                          <div className="font-semibold">{milestone.title}</div>
                          <div className="text-sm text-muted-foreground">{milestone.description}</div>
                        </div>
                      </div>
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="py-20">
            <div className="container mx-auto px-4">
              <SlideUp>
                <h2 className="text-3xl font-bold text-center mb-12">Руководство</h2>
              </SlideUp>
              <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {team.map((member) => (
                  <StaggerItem key={member.name}>
                    <Card className="text-center hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl font-bold text-primary">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-primary">{member.role}</p>
                        <p className="text-xs text-muted-foreground mt-1">{member.experience}</p>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          <section className="py-20 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 text-center">
              <SlideUp>
                <h2 className="text-3xl font-bold mb-6">Почему выбирают нас?</h2>
                <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto mt-12">
                  {[
                    'Собственный автопарк 200+ единиц',
                    'Филиалы в 50+ городах России',
                    'Круглосуточная поддержка клиентов',
                    'Онлайн-отслеживание грузов',
                    'Страхование каждой отправки',
                    'Гибкая система скидок',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 justify-center">
                      <CheckCircle className="h-5 w-5" />
                      <span>{item}</span>
                    </div>
                  ))}
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
