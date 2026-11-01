import { ContactoConfig, FooterConfig } from '@/services/content/content.types';
import { MapPin, Clock, Sparkles } from 'lucide-react';

interface EditorialRibbonProps {
  contacto: ContactoConfig;
  footer: FooterConfig;
}

export function EditorialRibbon({ contacto, footer }: EditorialRibbonProps) {
  return (
    <div className="border-b border-surface-container-highest/60 bg-surface-container-lowest/90 px-4 py-2.5 text-xs text-on-surface-variant backdrop-blur-md">
      <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-3 px-1 md:px-8">
        {/* Temporada */}
        <div className="flex items-center gap-2">
          <Sparkles className="h-3 w-3 text-secondary animate-pulse" />
          <span className="font-semibold text-white">
            {footer.cintaSuperiorTemporada || 'Temporada Teatral 2026'}
          </span>
        </div>

        {/* Sede y Horario de Boletería */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-teal-accent" />
            <span>
              <strong className="text-white">{contacto.sedeNombre}</strong> · {contacto.sedeDireccion}
            </span>
          </div>

          <div className="hidden items-center gap-1.5 md:flex">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>Boletería: {footer.horarioBoleteria}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
