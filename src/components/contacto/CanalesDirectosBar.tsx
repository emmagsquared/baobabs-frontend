import { ContactoConfig } from '@/services/content/content.types';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { MessageCircle, MapPin, Sparkles, ArrowUpRight } from 'lucide-react';

function InstagramIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface CanalesDirectosBarProps {
  contacto: ContactoConfig;
}

export function CanalesDirectosBar({ contacto }: CanalesDirectosBarProps) {
  const whatsappUrl = buildWhatsAppUrl(
    contacto.whatsappNumero,
    'Hola Baobabs! Me contacto desde el formulario web.'
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col justify-between rounded-xl border border-surface-container-highest/80 bg-surface-container/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-teal-accent/50 hover:bg-surface-container"
      >
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-accent/15 text-teal-accent">
            <MessageCircle className="h-5 w-5" />
          </div>
          <ArrowUpRight className="h-4 w-4 text-on-surface-variant group-hover:text-teal-accent transition-colors" />
        </div>
        <div className="mt-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-accent">WhatsApp Directo</span>
          <p className="mt-0.5 font-bold text-white text-base">{contacto.whatsappVisible}</p>
          {contacto.whatsappHorario && (
            <p className="mt-1 text-[11px] text-on-surface-variant">{contacto.whatsappHorario}</p>
          )}
        </div>
      </a>

      {/* 2. Instagram */}
      <a
        href={contacto.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col justify-between rounded-xl border border-surface-container-highest/80 bg-surface-container/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-secondary/50 hover:bg-surface-container"
      >
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/15 text-secondary">
            <InstagramIcon className="h-5 w-5" />
          </div>
          <ArrowUpRight className="h-4 w-4 text-on-surface-variant group-hover:text-secondary transition-colors" />
        </div>
        <div className="mt-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">Instagram Oficial</span>
          <p className="mt-0.5 font-bold text-white text-base">{contacto.instagramUsuario}</p>
          <p className="mt-1 text-[11px] text-on-surface-variant">Comunidad y novedades de sala</p>
        </div>
      </a>

      {/* 3. Sede Teatral */}
      <div className="flex flex-col justify-between rounded-xl border border-surface-container-highest/80 bg-surface-container/60 p-5">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <MapPin className="h-5 w-5" />
          </div>
          <span className="label-caps text-[10px] text-primary">Córdoba</span>
        </div>
        <div className="mt-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Sede Principal</span>
          <p className="mt-0.5 font-bold text-white text-base">{contacto.sedeNombre}</p>
          <p className="mt-1 text-[11px] text-on-surface-variant">{contacto.sedeDireccion}</p>
        </div>
      </div>

      {/* 4. Dirección Artística */}
      <a
        href={contacto.direccionArtisticaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col justify-between rounded-xl border border-surface-container-highest/80 bg-surface-container/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-tertiary/50 hover:bg-surface-container"
      >
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tertiary/15 text-tertiary-light">
            <Sparkles className="h-5 w-5" />
          </div>
          <ArrowUpRight className="h-4 w-4 text-on-surface-variant group-hover:text-tertiary-light transition-colors" />
        </div>
        <div className="mt-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-tertiary-light">Equipo Curatorial</span>
          <p className="mt-0.5 font-bold text-white text-base">{contacto.direccionArtisticaNombre}</p>
          <p className="mt-1 text-[11px] text-on-surface-variant">{contacto.direccionArtisticaHandle}</p>
        </div>
      </a>
    </div>
  );
}
