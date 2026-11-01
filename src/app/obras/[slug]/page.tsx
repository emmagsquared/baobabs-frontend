import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { contentRepository } from '@/services/content';
import { formatBadgeDate, formatFechaLarga, getNextFuncion } from '@/lib/dates';
import { buildObraWhatsAppUrl } from '@/lib/whatsapp';
import { Calendar, Clock, MapPin, Sparkles, ArrowLeft, MessageCircle, ArrowRight } from 'lucide-react';

interface ObraPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const obras = await contentRepository.getObras();
  return obras.map((obra) => ({
    slug: obra.slug,
  }));
}

export async function generateMetadata({ params }: ObraPageProps): Promise<Metadata> {
  const { slug } = await params;
  const obra = await contentRepository.getObraBySlug(slug);

  if (!obra) {
    return {
      title: 'Obra no encontrada · Baobabs Club de Teatro',
    };
  }

  return {
    title: `${obra.titulo} · Baobabs Club de Teatro`,
    description: obra.descripcionBreve,
    openGraph: {
      title: `${obra.titulo} · Baobabs Club de Teatro`,
      description: obra.descripcionBreve,
      images: [obra.imagen],
    },
  };
}

export default async function ObraDetailPage({ params }: ObraPageProps) {
  const { slug } = await params;
  const [obra, siteConfig] = await Promise.all([
    contentRepository.getObraBySlug(slug),
    contentRepository.getSiteConfig(),
  ]);

  if (!obra) {
    notFound();
  }

  const nextFuncion = getNextFuncion(obra.funciones);
  const badgeDate = nextFuncion ? formatBadgeDate(nextFuncion.fecha) : '';
  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(obra.precio);

  const reservaUrl = `/contacto?asunto=reserva-obras&item=${encodeURIComponent(obra.titulo)}#formulario`;
  const whatsappUrl = buildObraWhatsAppUrl(siteConfig.contacto.whatsappNumero, obra.titulo);

  return (
    <article className="min-h-screen py-10 md:py-16">
      <div className="mx-auto max-w-[1360px] px-5 md:px-12">
        {/* Navegación y retorno */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/#cartelera"
            className="inline-flex items-center gap-2 rounded-lg border border-surface-container-highest bg-surface-container-low px-4 py-2 text-xs font-semibold text-on-surface-variant transition-colors hover:border-primary/50 hover:bg-surface-container hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 text-primary" />
            <span>Volver a la Cartelera</span>
          </Link>

          <span className="label-caps hidden text-teal-accent sm:inline">
            Baobabs · Temporada Oficial
          </span>
        </div>

        {/* Grilla Principal de Ficha Técnica: 5 columnas póster + 7 ficha */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Columna Izquierda: Póster de alta fidelidad */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl border border-cyan-500/30 bg-surface-container shadow-[0_16px_50px_rgba(0,0,0,0.6)]">
              <Image
                src={obra.imagen}
                alt={`Póster oficial de ${obra.titulo}`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 via-transparent to-transparent" />

              {/* Insignia de Próxima Función */}
              {badgeDate && (
                <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-primary/40 bg-surface-container-lowest/90 px-3.5 py-1.5 backdrop-blur-md shadow-cyan-glow">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span className="label-caps text-xs text-white">{badgeDate}</span>
                </div>
              )}

              {/* Insignia Jam */}
              {obra.esJam && (
                <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-tertiary/50 bg-surface-container-lowest/90 px-3.5 py-1.5 backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5 text-tertiary-light" />
                  <span className="text-xs font-bold uppercase tracking-wider text-tertiary-light">
                    Jam Escénica
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Columna Derecha: Toda la Ficha Técnica y Fechas */}
          <div className="flex flex-col lg:col-span-7">
            {/* Chips superiores */}
            <div className="flex flex-wrap items-center gap-2.5">
              {obra.duracion && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-surface-container-highest bg-surface-container-high px-3 py-1 text-xs font-medium text-white">
                  <Clock className="h-3.5 w-3.5 text-teal-accent" />
                  {obra.duracion}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-accent/30 bg-teal-accent/10 px-3 py-1 text-xs font-semibold text-teal-accent">
                <MapPin className="h-3.5 w-3.5" />
                {obra.espacioEscenico}
              </span>
            </div>

            {/* Títulos */}
            <span className="mt-4 text-sm font-semibold uppercase tracking-wider text-teal-accent">
              {obra.subtitulo}
            </span>
            <h1 className="mt-1 font-serif text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {obra.titulo}
            </h1>
            <p className="mt-4 text-lg font-medium leading-relaxed text-primary">
              {obra.descripcionBreve}
            </p>

            {/* Sinopsis completa */}
            <div className="mt-6 border-t border-surface-container-highest/60 pt-6">
              <h2 className="label-caps mb-3 text-white">Sinopsis & Puesta en Escena</h2>
              <div className="space-y-4 text-[15px] leading-relaxed text-on-surface-variant">
                {obra.descripcion.split('\n\n').map((parrafo, i) => (
                  <p key={i}>{parrafo}</p>
                ))}
              </div>
            </div>

            {/* Grilla de Ficha Artística y Técnica */}
            <div className="mt-8 rounded-xl border border-surface-container-highest/80 bg-surface-container p-6">
              <h2 className="label-caps mb-4 text-teal-accent">Ficha Artística & Técnica</h2>
              <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase text-on-surface-variant">Dirección General</dt>
                  <dd className="mt-0.5 font-bold text-white">{obra.direccionGeneral}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-on-surface-variant">Elenco & Voces</dt>
                  <dd className="mt-0.5 font-bold text-white">{obra.elencoYVoces}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-on-surface-variant">Espacio Escénico</dt>
                  <dd className="mt-0.5 text-white">{obra.espacioEscenico}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-on-surface-variant">Producción</dt>
                  <dd className="mt-0.5 text-white">{obra.produccion}</dd>
                </div>
              </dl>
            </div>

            {/* Todas las Fechas y Horarios */}
            <div className="mt-6 rounded-xl border border-surface-container-highest/80 bg-surface-container-low p-6">
              <h2 className="label-caps mb-3 text-primary">Todas las Funciones Programadas</h2>
              <div className="divide-y divide-surface-container-highest/50">
                {obra.funciones.map((f, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 text-sm">
                    <div className="flex items-center gap-2 text-white">
                      <Calendar className="h-4 w-4 text-teal-accent" />
                      <span className="font-semibold">{formatFechaLarga(f.fecha)}</span>
                    </div>
                    <span className="rounded-lg bg-surface-container-high px-3 py-1 text-xs font-bold text-primary">
                      {f.hora} hs
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Barra de Reserva y Precios */}
            <div className="mt-8 flex flex-col gap-4 rounded-xl border border-primary/30 bg-surface-container-lowest/80 p-6 shadow-cyan-glow sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-xs uppercase text-on-surface-variant">Valor de la Entrada</span>
                <div className="font-serif text-3xl font-extrabold text-white">
                  {formattedPrice}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Botón WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-surface-container-highest bg-surface-container px-4 py-3 text-xs font-semibold text-teal-accent transition-colors hover:border-teal-accent hover:bg-surface-container-high"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Consultar por WhatsApp</span>
                </a>

                {/* Botón Primario Reservar */}
                <Link
                  href={reservaUrl}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-xs font-bold text-primary-dark shadow-cyan-glow transition-all hover:brightness-110 active:scale-[0.98]"
                >
                  <span>Reservar Entradas</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
