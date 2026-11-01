'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Drama, GraduationCap, Calendar, Mail } from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();

  const tabs = [
    { label: 'Cartelera', href: '/', icon: Drama, exact: true },
    { label: 'Talleres', href: '/talleres', icon: GraduationCap, exact: false },
    { label: 'Calendario', href: '/calendario', icon: Calendar, exact: false },
    { label: 'Contacto', href: '/contacto', icon: Mail, exact: false },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-surface-container-highest/70 bg-surface-container-lowest/95 px-2 backdrop-blur-xl lg:hidden"
      aria-label="Navegación inferior móvil"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.label}
            href={tab.href}
            className={`flex flex-1 flex-col items-center justify-center py-1 transition-colors ${
              isActive ? 'text-primary' : 'text-on-surface-variant hover:text-white'
            }`}
          >
            <div className={`relative flex items-center justify-center p-1 rounded-full ${isActive ? 'bg-primary/10' : ''}`}>
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-medium tracking-tight mt-0.5">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
