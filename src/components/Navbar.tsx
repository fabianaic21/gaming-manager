'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Gamepad2, Users, Trophy, Monitor, Mic, DollarSign, BarChart3 } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  
  const items = [
    { name: 'Dashboard', href: '/dashboard', icon: Gamepad2 },
    { name: 'Jugadores', href: '/jugadores', icon: Users },
    { name: 'Equipos', href: '/equipos', icon: Trophy },
    { name: 'Torneos', href: '/torneos', icon: Monitor },
    { name: 'Periféricos', href: '/perifericos', icon: Monitor },
    { name: 'Streamers', href: '/streamers', icon: Mic },
    { name: 'Patrocinadores', href: '/patrocinadores', icon: DollarSign },
    { name: 'Reportes', href: '/reportes', icon: BarChart3 },
  ]

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 overflow-x-auto">
          <Link href="/dashboard" className="text-white font-bold text-xl flex items-center gap-2 whitespace-nowrap">
            <Gamepad2 className="text-purple-500" />
            GamingManager
          </Link>
          <div className="flex gap-1">
            {items.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm transition-all whitespace-nowrap flex items-center gap-1
                    ${active ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}