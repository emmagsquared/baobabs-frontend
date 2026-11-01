import Image from 'next/image';
import { SalaPropiaConfig, ContactoConfig } from '@/services/content/content.types';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { MapPin, Navigation, MessageCircle, Armchair, Maximize2, Wind, Bus, Car, Utensils, Lightbulb, Volume2, Sparkles, Layers } from 'lucide-react';

interface SalaPropiaSectionProps {
  sala: SalaPropiaConfig;
  contacto: ContactoConfig;
}

export function SalaPropiaSection({ sala, contacto }: SalaPropiaSectionProps) {
  // Comprobación defensiva: Si ningún campo relevante tiene valor, no renderizar nada
  const hasContent = Object.values(sala).some((val) => val !== null && val !== undefined && val !== '');
  if (!hasContent) {
    return null;
  }

  // Enlace WhatsApp para bloque "¿Buscás sala?"
  const buscasSalaWspUrl = buildWhatsAppUrl(
    contacto.whatsappNumero,
    sala.buscasSalaMensajeWsp || 'Hola Baobabs! Quisiera consultar disponibilidad para alquilar la sala.'
  );

  return (
    <section className="relative overflow-hidden rounded-3xl border border-surface-container-highest/80 bg-gradient-to-b from-surface-container/80 to-surface-container-lowest p-6 md:p-12 lg:p-16">
      <div className="mx-auto max-w-[1360px]">
        {/* Encabezado */}
        <div className="flex flex-col items-start gap-2">
          {sala.etiquetaSuperior && (
            <span className="label-caps text-teal-accent">
              {sala.etiquetaSuperior}
            </span>
          )}
          {sala.tituloSala && (
            <h2 className="font-serif text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
              {sala.tituloSala}
            </h2>
          )}
          {sala.descripcionSala && (
            <p className="mt-2 text-base leading-relaxed text-on-surface-variant max-w-3xl">
              {sala.descripcionSala}
            </p>
          )}
        </div>

        {/* 1. Métricas Principales (butacas, dimensiones, climatización) */}
        {(sala.butacas || sala.dimensionesEscenario || sala.climatizacion) && (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {sala.butacas && (
              <div className="flex items-center gap-3.5 rounded-xl border border-surface-container-highest/70 bg-surface-container-low p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal-accent/15 text-teal-accent">
                  <Armchair className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Capacidad</span>
                  <p className="font-bold text-white text-sm mt-0.5">{sala.butacas}</p>
                </div>
              </div>
            )}

            {sala.dimensionesEscenario && (
              <div className="flex items-center gap-3.5 rounded-xl border border-surface-container-highest/70 bg-surface-container-low p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Maximize2 className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Escenario</span>
                  <p className="font-bold text-white text-sm mt-0.5">{sala.dimensionesEscenario}</p>
                </div>
              </div>
            )}

            {sala.climatizacion && (
              <div className="flex items-center gap-3.5 rounded-xl border border-surface-container-highest/70 bg-surface-container-low p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary/15 text-secondary">
                  <Wind className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Climatización</span>
                  <p className="font-bold text-white text-sm mt-0.5">{sala.climatizacion}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. Galería de Fotos con Epígrafe (si existen) */}
        {(sala.foto1Url || sala.foto2Url) && (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {sala.foto1Url && (
              <div className="flex flex-col gap-2">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-surface-container-highest/80 bg-surface-container-high">
                  <Image
                    src={sala.foto1Url}
                    alt={sala.foto1Epigrafe || 'Foto de sala principal'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                {sala.foto1Epigrafe && (
                  <p className="text-xs text-on-surface-variant italic px-1">
                    {sala.foto1Epigrafe}
                  </p>
                )}
              </div>
            )}

            {sala.foto2Url && (
              <div className="flex flex-col gap-2">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-surface-container-highest/80 bg-surface-container-high">
                  <Image
                    src={sala.foto2Url}
                    alt={sala.foto2Epigrafe || 'Foto del escenario'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                {sala.foto2Epigrafe && (
                  <p className="text-xs text-on-surface-variant italic px-1">
                    {sala.foto2Epigrafe}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* 3. Ficha Técnica de Equipamiento */}
        {(sala.parrillaLuminica || sala.acusticaYSonido || sala.comodidades || sala.disposicionGradas) && (
          <div className="mt-10 rounded-2xl border border-surface-container-highest/70 bg-surface-container-lowest/60 p-6 md:p-8">
            <h3 className="label-caps mb-6 text-primary">Equipamiento & Prestaciones Técnicas</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {sala.parrillaLuminica && (
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-teal-accent shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs uppercase text-white block">Parrilla Lumínica</strong>
                    <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{sala.parrillaLuminica}</p>
                  </div>
                </div>
              )}

              {sala.acusticaYSonido && (
                <div className="flex items-start gap-3">
                  <Volume2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs uppercase text-white block">Acústica & Sonido</strong>
                    <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{sala.acusticaYSonido}</p>
                  </div>
                </div>
              )}

              {sala.comodidades && (
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs uppercase text-white block">Comodidades & Foyer</strong>
                    <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{sala.comodidades}</p>
                  </div>
                </div>
              )}

              {sala.disposicionGradas && (
                <div className="flex items-start gap-3">
                  <Layers className="h-5 w-5 text-tertiary-light shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs uppercase text-white block">Disposición Escénica</strong>
                    <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{sala.disposicionGradas}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. Accesibilidad y Ubicación con Botón "Cómo llegar" a Google Maps */}
        {(sala.direccionCompleta || sala.colectivos || sala.estacionamiento || sala.poloGastronomico) && (
          <div className="mt-8 rounded-2xl border border-surface-container-highest/70 bg-surface-container-low p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h3 className="label-caps text-teal-accent">Ubicación & Accesibilidad</h3>
                {sala.direccionCompleta && (
                  <p className="mt-1 text-sm font-semibold text-white flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-teal-accent shrink-0" />
                    <span>{sala.direccionCompleta}</span>
                  </p>
                )}
              </div>

              {/* Botón Cómo llegar -> Abre Google Maps */}
              {sala.googleMapsUrl && (
                <a
                  href={sala.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-teal-accent/40 bg-surface-container-high px-4 py-2.5 text-xs font-bold text-teal-accent transition-all hover:bg-teal-accent hover:text-primary-dark"
                >
                  <Navigation className="h-4 w-4" />
                  <span>Cómo llegar</span>
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs text-on-surface-variant">
              {sala.colectivos && (
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-surface-container/40 border border-surface-container-highest/50">
                  <Bus className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Transporte Público</strong>
                    <span>{sala.colectivos}</span>
                  </div>
                </div>
              )}

              {sala.estacionamiento && (
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-surface-container/40 border border-surface-container-highest/50">
                  <Car className="h-4 w-4 text-teal-accent shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Estacionamiento</strong>
                    <span>{sala.estacionamiento}</span>
                  </div>
                </div>
              )}

              {sala.poloGastronomico && (
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-surface-container/40 border border-surface-container-highest/50">
                  <Utensils className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Gastronomía y Entorno</strong>
                    <span>{sala.poloGastronomico}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. Bloque "¿Buscás sala?" con enlace directo a WhatsApp */}
        {(sala.buscasSalaTitulo || sala.buscasSalaDescripcion) && (
          <div className="mt-8 rounded-2xl border border-primary/30 bg-gradient-to-r from-surface-container-high to-surface-container p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-cyan-glow">
            <div>
              {sala.buscasSalaTitulo && (
                <h3 className="font-serif text-2xl font-bold text-white">
                  {sala.buscasSalaTitulo}
                </h3>
              )}
              {sala.buscasSalaDescripcion && (
                <p className="mt-1.5 text-xs md:text-sm text-on-surface-variant max-w-xl leading-relaxed">
                  {sala.buscasSalaDescripcion}
                </p>
              )}
            </div>

            {/* Botón WhatsApp directo */}
            <a
              href={buscasSalaWspUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-xs md:text-sm font-bold text-primary-dark shadow-cyan-glow transition-all hover:brightness-110 active:scale-[0.98]"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{sala.buscasSalaTextoBoton || 'Consultar por WhatsApp'}</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
