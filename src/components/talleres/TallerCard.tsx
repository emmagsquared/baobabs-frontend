import Link from 'next/link';
import { Taller } from '@/services/content/content.types';
import { buildTallerWhatsAppUrl } from '@/lib/whatsapp';
import { Clock, MessageCircle, ArrowRight, User } from 'lucide-react';

interface TallerCardProps {
  taller: Taller;
  showWhatsAppButton?: boolean;
}

export function TallerCard({ taller, showWhatsAppButton = true }: TallerCardProps) {
  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(taller.precioPorMes);

  const whatsappUrl = buildTallerWhatsAppUrl(taller.telefonoContacto, taller.nombre);
  const inscripcionUrl = `/contacto?asunto=talleres&item=${encodeURIComponent(taller.nombre)}#formulario`;

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-xl border border-surface-container-highest/80 bg-surface-container p-6 transition-all duration-300 hover:-translate-y-1 hover:border-teal-accent/50 hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)]">
      <div>
        {/* Chips superiores: Nivel y Frecuencia */}
        <div className="flex flex-wrap items-center gap-2">
          {taller.nivel && (
            <span className="inline-flex rounded-full border border-teal-accent/30 bg-teal-accent/10 px-2.5 py-0.5 text-[11px] font-semibold text-teal-accent">
              {taller.nivel}
            </span>
          )}
          <span className="inline-flex rounded-full border border-surface-container-highest bg-surface-container-high px-2.5 py-0.5 text-[11px] font-medium text-on-surface-variant">
            {taller.frecuencia === 'SEMANAL' ? 'Todas las semanas' : 'Semana de por medio'}
          </span>
        </div>

        {/* Nombre del taller */}
        <h3 className="mt-3.5 font-serif text-xl font-bold tracking-tight text-white group-hover:text-teal-accent transition-colors">
          {taller.nombre}
        </h3>

        {/* Docentes */}
        <div className="mt-2 flex items-center gap-1.5 text-[13px] text-primary font-medium">
          <User className="h-3.5 w-3.5 shrink-0" />
          <span>Coordina: {taller.docentes}</span>
        </div>

        {/* Descripción */}
        <p className="mt-3 text-xs leading-relaxed text-on-surface-variant line-clamp-3">
          {taller.descripcion}
        </p>

        {/* Horarios programados */}
        <div className="mt-4 flex flex-col gap-1.5 rounded-lg border border-surface-container-highest/60 bg-surface-container-low p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
            Días y Horarios:
          </span>
          <div className="flex flex-wrap gap-2">
            {taller.horarios.map((h, idx) => (
              <div key={idx} className="flex items-center gap-1 text-[12px] font-semibold text-white">
                <Clock className="h-3 w-3 text-teal-accent shrink-0" />
                <span>
                  {h.diaSemana} · {h.horaInicio} a {h.horaFin} hs
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pie de la tarjeta: Precio y Acciones */}
      <div className="mt-6 border-t border-surface-container-highest/60 pt-4">
        <div className="mb-4 flex items-baseline justify-between">
          <span className="text-xs uppercase text-on-surface-variant">Cuota Mensual</span>
          <span className="font-serif text-xl font-extrabold text-white">
            {formattedPrice} <span className="font-sans text-xs font-normal text-on-surface-variant">/ mes</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Botón Inscribirme */}
          <Link
            href={inscripcionUrl}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-center text-[13px] font-bold text-primary-dark shadow-cyan-glow transition-all hover:brightness-110 active:scale-[0.98]"
          >
            <span>Inscribirme</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          {/* Botón WhatsApp opcional */}
          {showWhatsAppButton && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Consultar por WhatsApp sobre ${taller.nombre}`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-surface-container-highest bg-surface-container-high text-teal-accent transition-colors hover:border-teal-accent hover:bg-surface-container"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
