import Image from 'next/image';
import Link from 'next/link';
import { BannerPublicitario } from '@/services/content/content.types';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';

interface BannerPublicitarioSectionProps {
  banner: BannerPublicitario;
}

export function BannerPublicitarioSection({ banner }: BannerPublicitarioSectionProps) {
  return (
    <section className="relative overflow-hidden border-t border-surface-container-highest/60 bg-gradient-to-b from-surface to-surface-container-lowest py-16 md:py-24">
      {/* Luz de acento ambiental */}
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-[350px] w-[350px] rounded-full bg-teal-accent/10 blur-[130px]" />

      <div className="mx-auto max-w-[1360px] px-5 md:px-12">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-surface-container/70 p-8 shadow-[0_16px_50px_rgba(0,0,0,0.5)] backdrop-blur-md md:p-12 lg:p-16">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Columna Izquierda (5 columnas): Foto inclinada */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto aspect-[16/10] w-full max-w-lg overflow-hidden rounded-2xl border border-cyan-500/30 bg-surface-container-high shadow-2xl transition-transform duration-500 hover:rotate-0 lg:rotate-[-1.5deg]">
                <Image
                  src={banner.foto}
                  alt={banner.titulo}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full border border-teal-accent/30 bg-surface-container-lowest/80 px-3 py-1 backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5 text-teal-accent" />
                  <span className="label-caps text-[10px] text-white">Comunidad Baobabs</span>
                </div>
              </div>
            </div>

            {/* Columna Derecha (7 columnas): Contenido con modificaciones obligatorias */}
            <div className="flex flex-col items-start lg:col-span-7">
              <span className="label-caps text-teal-accent">
                Espacio de Formación & Comunidad
              </span>

              <h2 className="mt-3 font-serif text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {banner.titulo}
              </h2>

              {/* Subtítulo en cursiva cyan */}
              <p className="mt-3 font-serif text-xl italic text-primary sm:text-2xl">
                {banner.subtitulo}
              </p>

              <p className="mt-4 text-[15px] leading-relaxed text-on-surface-variant max-w-2xl">
                {banner.descripcion}
              </p>

              {/* Modificaciones de Stitch:
                  1. NO incluir "Primera clase libre"
                  2. Donde decía "Horarios flexibles", dejar únicamente "Horarios" como link clickeable a /talleres
                  3. Botón principal: "Probar mi primera clase" que navega a /contacto#formulario
              */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {/* Botón principal */}
                <Link
                  href="/contacto#formulario"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-[14px] font-bold text-primary-dark shadow-cyan-glow transition-all hover:brightness-110 hover:shadow-[0_0_24px_rgba(34,211,238,0.5)] active:scale-[0.98]"
                >
                  <span>Probar mi primera clase</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                {/* Enlace clickeable a /talleres que dice únicamente "Horarios" */}
                <Link
                  href="/talleres"
                  className="inline-flex items-center gap-2 rounded-lg border border-surface-container-highest bg-surface-container-high/60 px-5 py-3 text-[14px] font-medium text-teal-accent transition-colors hover:border-teal-accent/50 hover:bg-surface-container hover:text-white"
                >
                  <Clock className="h-4 w-4 text-teal-accent" />
                  <span>Horarios</span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-70" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
