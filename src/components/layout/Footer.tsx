import Link from 'next/link';
import { FooterConfig } from '@/services/content/content.types';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { MapPin, Clock, Phone, Mail, ArrowUpRight } from 'lucide-react';

function InstagramIcon({ className = 'h-4 w-4' }: { className?: string }) {
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

interface FooterProps {
  footer: FooterConfig;
}

export function Footer({ footer }: FooterProps) {
  // REGLA OBLIGATORIA: Al hacer click en el número de teléfono del footer abre wa.me/<telefonoWhatsappNumero>
  const whatsappUrl = buildWhatsAppUrl(
    footer.telefonoWhatsappNumero,
    'Hola Baobabs! Me comunico desde la web oficial.'
  );

  return (
    <footer className="border-t border-surface-container-highest/60 bg-surface-container-lowest text-on-surface">
      {/* Cinta superior de temporada si está configurada */}
      {footer.cintaSuperiorTemporada && (
        <div className="border-b border-surface-container-highest/40 bg-surface-container-low/70 py-3 text-center">
          <p className="label-caps text-teal-accent">
            {footer.cintaSuperiorTemporada}
          </p>
        </div>
      )}

      <div className="mx-auto max-w-[1360px] px-5 py-16 md:px-12 lg:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Columna 1: Marca y Redes */}
          <div className="flex flex-col gap-4">
            <span className="font-serif text-2xl font-bold tracking-wider text-white">
              {footer.marcaTitulo}
            </span>
            <p className="text-[14px] leading-relaxed text-on-surface-variant">
              {footer.marcaDescripcion}
            </p>
            <div className="mt-2">
              <a
                href={footer.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-surface-container-highest bg-surface-container/40 px-3.5 py-2 text-[13px] font-medium text-secondary transition-all hover:border-secondary/40 hover:bg-surface-container"
              >
                <InstagramIcon className="h-4 w-4" />
                <span>{footer.instagramHandle}</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
              </a>
            </div>
          </div>

          {/* Columna 2: Ubicación */}
          <div className="flex flex-col gap-3">
            <h3 className="label-caps text-teal-accent">
              {footer.ubicacionTitulo}
            </h3>
            <p className="font-semibold text-white">{footer.salaNombre}</p>
            <div className="flex items-start gap-2 text-[14px] text-on-surface-variant">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-accent" />
              <span>
                {footer.salaDireccion}, {footer.salaCiudad}
              </span>
            </div>
            <div className="mt-3 flex flex-col gap-2 rounded-lg border border-surface-container-highest/50 bg-surface-container/30 p-3 text-[13px]">
              <div className="flex items-start gap-2 text-on-surface-variant">
                <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-accent" />
                <div>
                  <span className="font-medium text-white">Boletería: </span>
                  {footer.horarioBoleteria}
                </div>
              </div>
              <div className="flex items-start gap-2 text-on-surface-variant">
                <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
                <div>
                  <span className="font-medium text-white">Talleres: </span>
                  {footer.horarioTalleres}
                </div>
              </div>
            </div>
          </div>

          {/* Columna 3: Contacto y WhatsApp Directo */}
          <div className="flex flex-col gap-3">
            <h3 className="label-caps text-teal-accent">
              {footer.contactoTitulo}
            </h3>
            
            {/* REGLA OBLIGATORIA: Enlace directo a WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 rounded-lg border border-surface-container-highest bg-surface-container/30 p-3 text-[14px] font-medium text-white transition-all hover:border-teal-accent/50 hover:bg-surface-container"
            >
              <Phone className="h-4 w-4 text-teal-accent transition-transform group-hover:scale-110" />
              <div className="flex flex-col">
                <span className="text-[11px] text-on-surface-variant">WhatsApp Oficial</span>
                <span className="text-teal-accent font-semibold">{footer.telefonoVisible}</span>
              </div>
            </a>

            {footer.emailVisible && (
              <a
                href={`mailto:${footer.emailVisible}`}
                className="flex items-center gap-2.5 px-1 py-1 text-[13px] text-on-surface-variant hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 text-primary" />
                <span>{footer.emailVisible}</span>
              </a>
            )}
          </div>

          {/* Columna 4: CTA de Reserva/Inscripción */}
          <div className="flex flex-col gap-4">
            <h3 className="label-caps text-primary">
              Comunidad & Boletería
            </h3>
            <p className="text-[13px] leading-relaxed text-on-surface-variant">
              Reservá butacas para funciones de cartelera o preinscribite a nuestras clases de prueba semanales.
            </p>
            <Link
              href="/contacto#formulario"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-center text-[13px] font-bold text-primary-dark shadow-cyan-glow transition-all hover:brightness-110 hover:shadow-[0_0_22px_rgba(34,211,238,0.5)]"
            >
              {footer.ctaTexto}
            </Link>
          </div>
        </div>

        {/* Barra inferior de Copyright */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-surface-container-highest/40 pt-8 text-[12px] text-on-surface-variant md:flex-row">
          <p>{footer.copyrightTexto}</p>
          <p className="font-serif italic text-teal-accent/90">{footer.lemaDerecho}</p>
        </div>
      </div>
    </footer>
  );
}
