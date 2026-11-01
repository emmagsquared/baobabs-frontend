import Image from 'next/image';
import Link from 'next/link';
import { BannerTalleres } from '@/services/content/content.types';
import { Calendar, ArrowRight, CheckCircle2, MapPin } from 'lucide-react';

interface TalleresHeroBannerProps {
  banner: BannerTalleres;
}

export function TalleresHeroBanner({ banner }: TalleresHeroBannerProps) {
  return (
    <div className="border-b border-surface-container-highest/60 bg-gradient-to-b from-surface-container-lowest to-surface">
      {/* 1. Cinta Superior: etiquetaSuperior + Preinscripción Online → a /contacto#formulario */}
      <div className="border-b border-surface-container-highest/50 bg-surface-container-low/70 py-2.5 px-5 md:px-12">
        <div className="mx-auto flex max-w-[1360px] items-center justify-between text-xs">
          <span className="label-caps text-teal-accent">
            {banner.etiquetaSuperior || 'Ciclo de Formación Teatral'}
          </span>
          <Link
            href="/contacto#formulario"
            className="group inline-flex items-center gap-1 font-semibold text-primary transition-colors hover:text-white"
          >
            <span>Preinscripción Online</span>
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>

      {/* 2. Hero Banner de Talleres (Split 12 cols: 7 texto + 5 foto) */}
      <div className="mx-auto max-w-[1360px] px-5 py-12 md:px-12 lg:py-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Columna Izquierda (7 columnas) */}
          <div className="flex flex-col items-start lg:col-span-7">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-accent">
              {banner.subtitulo}
            </span>

            <h1 className="mt-2 font-serif text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {banner.titulo}
            </h1>

            <p className="mt-4 text-base leading-relaxed text-on-surface-variant max-w-2xl">
              {banner.descripcion}
            </p>

            {/* Badges si existen */}
            {banner.badges && banner.badges.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2.5">
                {banner.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-full border border-surface-container-highest bg-surface-container px-3 py-1 text-xs font-medium text-white"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    <span>{badge}</span>
                  </span>
                ))}
              </div>
            )}

            {/* 2 Botones obligatorios:
                1. "Grilla Semanal" -> navega a /calendario
                2. "Probar clases" (texto exacto) -> navega a /contacto?asunto=talleres#formulario
            */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/calendario"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-[14px] font-bold text-primary-dark shadow-cyan-glow transition-all hover:brightness-110 active:scale-[0.98]"
              >
                <Calendar className="h-4 w-4" />
                <span>Grilla Semanal</span>
              </Link>

              <Link
                href="/contacto?asunto=talleres#formulario"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-teal-accent/40 bg-surface-container px-6 py-3.5 text-[14px] font-bold text-teal-accent transition-all hover:bg-surface-container-high hover:border-teal-accent hover:text-white"
              >
                <span>Probar clases</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Columna Derecha (5 columnas): Foto con tarjeta flotante de sede */}
          <div className="relative mx-auto w-full max-w-lg lg:col-span-5 lg:max-w-none">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-surface-container-highest/80 bg-surface-container shadow-2xl">
              <Image
                src={banner.foto}
                alt={banner.titulo}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 via-transparent to-transparent" />

              {/* Tarjeta flotante inferior de sede si está definida */}
              {(banner.sedeTarjetaTitulo || banner.sedeTarjetaSubtitulo) && (
                <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-surface-container-highest/80 bg-surface-container-lowest/90 p-3.5 backdrop-blur-md">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      {banner.sedeTarjetaTitulo && (
                        <p className="text-xs font-bold text-white">
                          {banner.sedeTarjetaTitulo}
                        </p>
                      )}
                      {banner.sedeTarjetaSubtitulo && (
                        <p className="text-[11px] text-on-surface-variant">
                          {banner.sedeTarjetaSubtitulo}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
