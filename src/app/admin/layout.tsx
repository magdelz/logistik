'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Truck, 
  LayoutDashboard, 
  Package, 
  Users, 
  Map, 
  DollarSign,
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  ChevronDown,
  Moon,
  Sun,
  BarChart3,
  FileText
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn, getInitials, ROLE_LABELS } from '@/lib/utils'
import { useAuthStore } from '@/store'
import { signOut } from '@/lib/api/auth'
import { useToast } from '@/hooks/use-toast'

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Заказы', icon: Package },
  { href: '/admin/clients', label: 'Клиенты', icon: Users },
  { href: '/admin/routes', label: 'Маршруты', icon: Map },
  { href: '/admin/tariffs', label: 'Тарифы', icon: DollarSign },
  { href: '/admin/analytics', label: 'Аналитика', icon: BarChart3 },
  { href: '/admin/logs', label: 'Логи', icon: FileText },
  { href: '/admin/settings', label: 'Настройки', icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuthStore()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      await signOut()
      logout()
      router.push('/login')
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось выйти из системы',
      })
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-20',
          'hidden lg:block'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Truck className="h-6 w-6 text-primary-foreground" />
            </div>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col"
              >
                <span className="text-lg font-bold">LogiTrack</span>
                <span className="text-xs text-muted-foreground">Админ-панель</span>
              </motion.div>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-1">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href || 
              (link.href !== '/admin' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                )}
              >
                <link.icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span className="text-sm">{link.label}</span>}
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className={cn('lg:pl-64', !sidebarOpen && 'lg:pl-20')}>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                5
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar_url || ''} />
                    <AvatarFallback>
                      {user?.full_name ? getInitials(user.full_name) : 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm">{user?.full_name || 'Администратор'}</span>
                    <Badge variant="secondary" className="text-[10px] px-1 py-0">
                      {user?.role ? ROLE_LABELS[user.role] : 'Admin'}
                    </Badge>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user?.full_name}</span>
                    <span className="text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Настройки
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed left-0 top-0 z-50 h-screen w-64 border-r bg-background lg:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b px-4">
                <Link href="/admin" className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <Truck className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold">LogiTrack</span>
                    <span className="text-xs text-muted-foreground">Админ-панель</span>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="p-4 space-y-1">
                {adminLinks.map((link) => {
                  const isActive = pathname === link.href ||
                    (link.href !== '/admin' && pathname.startsWith(link.href))
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <link.icon className="h-5 w-5" />
                      <span className="text-sm">{link.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
