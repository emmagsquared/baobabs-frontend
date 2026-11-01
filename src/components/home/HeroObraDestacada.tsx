import Image from 'next/image';
import Link from 'next/link';
import { Obra } from '@/services/content/content.types';
import { formatBadgeDate, getNextFuncion } from '@/lib/dates';
import { Clock, Sparkles, MapPin, Calendar, ArrowDown } from 'lucide-react';

interface HeroObraDestacadaProps {
  obra: Obra;
}

export function HeroObraDestacada({ obra }: HeroObraDestacadaProps) {
  const nextFuncion = getNextFuncion(obra.funciones);
  const badgeDate = nextFuncion ? formatBadgeDate(nextFuncion.fecha) : '';
  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(obra.precio);

  const reservaUrl = `/contacto?asunto=reserva-obras&item=${encodeURIComponent(obra.titulo)}#formulario`;

  return (
    <section className="relative overflow-hidden border-b border-surface-container-highest/60 bg-gradient-to-b from-surface-container-lowest to-surface py-12 md:py-16 lg:py-20">
      {/* Luz ambiental de fondo */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[140px]" />
      <div className="pointer-events-none absolute right-0 top-1/2 h-[450px] w-[450px] rounded-full bg-tertiary/10 blur-[130px]" />

      <div className="mx-auto max-w-[1360px] px-5 md:px-12">
        {/* Etiqueta superior */}
        <div className="mb-6 flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
          <span className="label-caps text-primary">Obra Destacada de Cartelera</span>
        </div>

        {/* Grilla Split de 12 columnas: 5 póster + 7 ficha */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Columna Izquierda (5 columnas): Póster vertical */}
          <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
            <div className="group relative aspect-[2/3] w-full overflow-hidden rounded-2xl border border-cyan-500/25 bg-surface-container shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
              <Image
                src={obra.imagen}
                alt={`Póster oficial de ${obra.titulo}`}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              
              {/* Overlay degradado escénico */}
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent" />

              {/* Badge de Próxima Fecha (Arriba Izquierda) */}
              {badgeDate && (
                <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-primary/40 bg-surface-container-lowest/90 px-3.5 py-1.5 backdrop-blur-md shadow-cyan-glow">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span className="label-caps text-[11px] text-white">
                    {badgeDate}
                  </span>
                </div>
              )}

              {/* Datos superpuestos al pie del póster */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-teal-accent">
                  {obra.subtitulo}
                </span>
                <h1 className="font-serif text-2xl font-bold tracking-tight text-white md:text-3xl">
                  {obra.titulo}
                </h1>
                <div className="mt-2 flex items-center gap-1.5 text-[13px] text-on-surface-variant">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span>{obra.espacioEscenico}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha (7 columnas): Ficha artística y detalle */}
          <div className="flex flex-col justify-between rounded-2xl border border-surface-container-highest/60 bg-surface-container/50 p-6 backdrop-blur-sm lg:col-span-7 lg:p-10">
            <div>
              {/* Chips de duración y Jam */}
              <div className="flex flex-wrap items-center gap-2.5">
                {obra.duracion && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-surface-container-highest bg-surface-container-high px-3 py-1 text-[12px] font-medium text-white">
                    <Clock className="h-3.5 w-3.5 text-teal-accent" />
                    Duración: {obra.duracion}
                  </span>
                )}
                {obra.esJam && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-tertiary/40 bg-tertiary/15 px-3 py-1 text-[12px] font-bold text-tertiary-light">
                    <Sparkles className="h-3.5 w-3.5" />
                    Jam Escénica
                  </span>
                )}
                <span className="inline-flex items-center rounded-full border border-teal-accent/30 bg-teal-accent/10 px-3 py-1 text-[12px] font-semibold text-teal-accent">
                  Temporada Oficial
                </span>
              </div>

              {/* Título editorial e introducción */}
              <h2 className="mt-5 font-serif text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
                {obra.titulo}
              </h2>
              <p className="mt-3 text-lg font-medium leading-snug text-primary">
                {obra.descripcionBreve}
              </p>

              {/* Descripción completa */}
              <p className="mt-4 text-[15px] leading-relaxed text-on-surface-variant">
                {obra.descripcion}
              </p>

              {/* Ficha Artística en Grilla */}
              <div className="mt-8 rounded-xl border border-surface-container-highest/70 bg-surface-container-lowest/60 p-5">
                <h3 className="label-caps mb-4 text-teal-accent">
                  Ficha Artística & Funciones
                </h3>
                <dl className="grid grid-cols-1 gap-x-6 gap-y-3.5 text-[14px] sm:grid-cols-2">
                  <div>
                    <dt className="text-xs uppercase text-on-surface-variant">Dirección General</dt>
                    <dd className="font-semibold text-white">{obra.direccionGeneral}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase text-on-surface-variant">Elenco & Voces</dt>
                    <dd className="font-semibold text-white">{obra.elencoYVoces}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase text-on-surface-variant">Espacio Escénico</dt>
                    <dd className="text-white">{obra.espacioEscenico}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase text-on-surface-variant">Producción</dt>
                    <dd className="text-white">{obra.produccion}</dd>
                  </div>
                </dl>

                {/* Lista de Fechas y Horas */}
                <div className="mt-5 border-t border-surface-container-highest/60 pt-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Fechas y Horarios Programados:
                  </span>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {obra.funciones.map((f, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-surface-container-highest bg-surface-container px-3 py-1 text-xs font-medium text-white"
                      >
                        <Calendar className="h-3 w-3 text-primary" />
                        {f.fecha} · <strong className="text-primary">{f.hora} hs</strong>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Barra Inferior del Hero: Precio, Botón Reservar y Scroll a Cartelera */}
            <div className="mt-8 flex flex-col gap-4 border-t border-surface-container-highest/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-on-surface-variant">Entrada General</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-3xl font-extrabold text-white">{formattedPrice}</span>
                  {nextFuncion && (
                    <span className="text-xs text-teal-accent">
                      Próxima: {nextFuncion.hora} hs
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="#cartelera"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-surface-container-highest px-4 py-3 text-[13px] font-semibold text-on-surface transition-colors hover:border-primary/40 hover:bg-surface-container"
                >
                  <span>Ver Cartelera</span>
                  <ArrowDown className="h-3.5 w-3.5 text-primary" />
                </a>

                {/* Botón primario Reservar Entradas */}
                <Link
                  href={reservaUrl}
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-[14px] font-bold text-primary-dark shadow-cyan-glow transition-all hover:brightness-110 hover:shadow-[0_0_24px_rgba(34,211,238,0.5)] active:scale-[0.98]"
                >
                  Reservar Entradas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
