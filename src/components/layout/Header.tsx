'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MessageCircle, Sparkles } from 'lucide-react';
import { ContactoConfig } from '@/services/content/content.types';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

interface HeaderProps {
  contacto: ContactoConfig;
}

export function Header({ contacto }: HeaderProps) {
  const pathname = usePathname();
  const whatsappUrl = buildWhatsAppUrl(contacto.whatsappNumero, 'Hola Baobabs! Me comunico desde la web.');

  const navLinks = [
    { label: 'Cartelera', href: '/' },
    { label: 'Talleres y Clases', href: '/talleres' },
    { label: 'Calendario', href: '/calendario' },
    { label: 'Jam Escénica', href: '/?filtro=jam#cartelera' },
    { label: 'Contacto', href: '/contacto' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/?')) return false;
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-container-highest/70 bg-surface/85 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex h-16 max-w-[1360px] items-center justify-between px-5 md:px-12 lg:h-20">
        {/* Izquierda: Logo y Marca */}
        <Link
          href="/"
          className="group flex items-center gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          aria-label="Ir al inicio de Baobabs Club de Teatro"
        >
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-primary/30 bg-surface-container-high transition-transform duration-300 group-hover:scale-105 group-hover:border-primary/60 md:h-12 md:w-12">
            <Image
              src="/images/logo/logo-baobabs.svg"
              alt="Logo Baobabs Club de Teatro"
              width={40}
              height={40}
              className="h-8 w-8 object-contain md:h-10 md:w-10"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-extrabold tracking-[0.18em] text-white transition-colors group-hover:text-primary md:text-xl">
              BAOBABS
            </span>
            <span className="label-caps -mt-0.5 text-[10px] text-teal-accent">
              Club de Teatro
            </span>
          </div>
        </Link>

        {/* Centro: Navegación Desktop */}
        <nav className="hidden items-center gap-1.5 lg:flex" aria-label="Navegación principal">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative rounded-lg px-3.5 py-2 text-[14px] font-medium transition-all duration-200 ${
                  active
                    ? 'text-primary font-semibold'
                    : 'text-on-surface-variant hover:text-white hover:bg-surface-container/60'
                }`}
              >
                {link.label}
                {link.label === 'Jam Escénica' && (
                  <span className="ml-1.5 inline-flex items-center text-secondary">
                    <Sparkles className="h-3 w-3 animate-pulse" />
                  </span>
                )}
                {active && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] rounded-full bg-primary shadow-cyan-glow" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Derecha: Acciones (WhatsApp y Botón Reservar) - SIN LOGIN */}
        <div className="flex items-center gap-3">
          {/* Link directo de WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Contactar por WhatsApp a ${contacto.whatsappVisible}`}
            className="flex items-center gap-2 rounded-lg border border-surface-container-highest px-3 py-2 text-[13px] font-medium text-on-surface-variant transition-colors hover:border-teal-accent/50 hover:bg-surface-container hover:text-teal-accent"
          >
            <MessageCircle className="h-4 w-4 text-teal-accent" />
            <span className="hidden xl:inline">{contacto.whatsappVisible}</span>
          </a>

          {/* Botón primario cyan: Todo botón de reserva lleva a /contacto#formulario */}
          <Link
            href="/contacto#formulario"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-[13px] font-bold text-primary-dark shadow-cyan-glow transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_22px_rgba(34,211,238,0.5)] active:scale-[0.98] md:px-5 md:py-2.5 md:text-[14px]"
          >
            Inscribirme / Reservar
          </Link>
        </div>
      </div>
    </header>
  );
}
