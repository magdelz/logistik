import Link from 'next/link'
import { Truck, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Truck className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">LogiTrack</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Надёжная логистическая компания с многолетним опытом грузоперевозок по всей России.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Услуги</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">
                  Грузоперевозки
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">
                  Экспресс-доставка
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">
                  Негабаритные грузы
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">
                  Температурный режим
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Клиентам</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/calculator" className="hover:text-primary transition-colors">
                  Калькулятор стоимости
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="hover:text-primary transition-colors">
                  Отследить груз
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primary transition-colors">
                  Личный кабинет
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  О компании
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Контакты</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+78001234567" className="hover:text-primary transition-colors">
                  8 (800) 123-45-67
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@logitrack.ru" className="hover:text-primary transition-colors">
                  info@logitrack.ru
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>г. Москва, ул. Логистическая, д. 1</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2024 LogiTrack. Все права защищены.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Политика конфиденциальности
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
