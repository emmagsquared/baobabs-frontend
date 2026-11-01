'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Obra, Taller } from '@/services/content/content.types';
import { filterObrasHoy, filterObrasFinDeSemana } from '@/lib/dates';
import { ObraCard } from './ObraCard';
import { TallerCard } from '../talleres/TallerCard';
import { Sparkles, Calendar, Film, GraduationCap, Flame, AlertCircle } from 'lucide-react';

type FiltroTab = 'obras' | 'hoy' | 'fin-de-semana' | 'talleres' | 'jam';

interface HomeFilterableGridProps {
  obras: Obra[];
  talleres: Taller[];
}

function FilterableGridInner({ obras, talleres }: HomeFilterableGridProps) {
  const searchParams = useSearchParams();
  const filtroParam = searchParams.get('filtro');

  // Determinar pestaña inicial según query params (ej. ?filtro=jam)
  const defaultTab: FiltroTab =
    filtroParam === 'jam'
      ? 'jam'
      : filtroParam === 'hoy'
      ? 'hoy'
      : filtroParam === 'fin-de-semana'
      ? 'fin-de-semana'
      : filtroParam === 'talleres'
      ? 'talleres'
      : 'obras';

  const [userSelectedTab, setUserSelectedTab] = useState<FiltroTab | null>(null);
  const activeTab = userSelectedTab ?? defaultTab;

  // Filtrado de contenido según la pestaña activa
  const filteredObras = useMemo(() => {
    switch (activeTab) {
      case 'hoy':
        return filterObrasHoy(obras);
      case 'fin-de-semana':
        return filterObrasFinDeSemana(obras);
      case 'jam':
        return obras.filter((o) => o.esJam);
      case 'obras':
      default:
        return obras;
    }
  }, [activeTab, obras]);

  const vigentesTalleres = useMemo(() => {
    return talleres.filter((t) => t.estado === 'VIGENTE');
  }, [talleres]);

  const tabs: Array<{ id: FiltroTab; label: string; icon: React.ElementType; badge?: number }> = [
    { id: 'obras', label: 'Obras de Sala', icon: Film, badge: obras.length },
    { id: 'hoy', label: 'Hoy', icon: Flame, badge: filterObrasHoy(obras).length },
    { id: 'fin-de-semana', label: 'Fin de Semana', icon: Calendar, badge: filterObrasFinDeSemana(obras).length },
    { id: 'talleres', label: 'Talleres y Clases', icon: GraduationCap, badge: vigentesTalleres.length },
    { id: 'jam', label: 'Jam Escénica', icon: Sparkles, badge: obras.filter((o) => o.esJam).length },
  ];

  return (
    <section id="cartelera" className="scroll-mt-24 py-12 md:py-16">
      <div className="mx-auto max-w-[1360px] px-5 md:px-12">
        {/* Encabezado de la sección */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="label-caps text-teal-accent">Programación en Vivo</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="font-serif text-3xl font-extrabold text-white md:text-4xl">
                Cartelera & Actividades
              </h2>
              <p className="mt-1 text-sm text-on-surface-variant">
                Descubrí las próximas funciones, jams y clases abiertas en nuestra sala.
              </p>
            </div>
          </div>
        </div>

        {/* Barra Sticky de 5 Filtros */}
        <div className="sticky top-16 z-30 -mx-5 mt-8 border-y border-surface-container-highest/60 bg-surface/90 px-5 py-3 backdrop-blur-xl lg:top-20 md:-mx-12 md:px-12">
          <div className="mx-auto flex max-w-[1360px] items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              const isJam = tab.id === 'jam';

              return (
                <button
                  key={tab.id}
                  onClick={() => setUserSelectedTab(tab.id)}
                  type="button"
                  className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? isJam
                        ? 'bg-tertiary text-white shadow-[0_0_16px_rgba(168,85,247,0.4)]'
                        : 'bg-primary text-primary-dark shadow-cyan-glow'
                      : 'border border-surface-container-highest bg-surface-container-low text-on-surface-variant hover:border-surface-container-high hover:bg-surface-container hover:text-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span
                      className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                        isSelected
                          ? isJam
                            ? 'bg-white/20 text-white'
                            : 'bg-primary-dark/20 text-primary-dark'
                          : 'bg-surface-container-highest text-on-surface-variant'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grilla de Resultados */}
        <div className="mt-10">
          {activeTab === 'talleres' ? (
            /* Render de Talleres */
            vigentesTalleres.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {vigentesTalleres.map((taller) => (
                  <TallerCard key={taller.id} taller={taller} />
                ))}
              </div>
            ) : (
              <EmptyState onReset={() => setUserSelectedTab('obras')} />
            )
          ) : (
            /* Render de Obras */
            filteredObras.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {filteredObras.map((obra) => (
                  <ObraCard key={obra.id} obra={obra} />
                ))}
              </div>
            ) : (
              <EmptyState onReset={() => setUserSelectedTab('obras')} />
            )
          )}
        </div>
      </div>
    </section>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-container-highest/80 bg-surface-container-lowest/50 p-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-high text-teal-accent">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-serif text-xl font-bold text-white">
        No hay funciones programadas para este filtro
      </h3>
      <p className="mt-2 max-w-md text-sm text-on-surface-variant">
        No encontramos eventos con fecha para esta selección específica. Consultá toda la cartelera o escribinos para conocer próximas fechas.
      </p>
      <button
        onClick={onReset}
        type="button"
        className="mt-6 rounded-lg border border-primary/40 bg-surface-container-high px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-primary-dark"
      >
        Ver Todas las Obras de Sala
      </button>
    </div>
  );
}

export function HomeFilterableGrid(props: HomeFilterableGridProps) {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-on-surface-variant">Cargando cartelera...</div>}>
      <FilterableGridInner {...props} />
    </Suspense>
  );
}
