import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'LogiTrack - Логистическая платформа',
  description: 'Современная платформа для управления грузоперевозками. Отслеживание грузов, расчёт стоимости доставки, управление заказами.',
  keywords: ['логистика', 'грузоперевозки', 'доставка', 'отслеживание грузов', 'транспорт'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
