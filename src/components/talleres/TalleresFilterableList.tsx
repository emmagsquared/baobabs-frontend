'use client';

import { useState, useMemo } from 'react';
import { Taller, DiaSemana } from '@/services/content/content.types';
import { TallerCard } from './TallerCard';
import { AlertCircle } from 'lucide-react';

interface TalleresFilterableListProps {
  talleres: Taller[];
}

const DIAS_ORDEN: Array<{ key: DiaSemana; label: string }> = [
  { key: 'LUNES', label: 'Lunes' },
  { key: 'MARTES', label: 'Martes' },
  { key: 'MIERCOLES', label: 'Miércoles' },
  { key: 'JUEVES', label: 'Jueves' },
  { key: 'VIERNES', label: 'Viernes' },
  { key: 'SABADO', label: 'Sábado' },
  { key: 'DOMINGO', label: 'Domingo' },
];

export function TalleresFilterableList({ talleres }: TalleresFilterableListProps) {
  // Solo consideramos talleres con estado VIGENTE
  const vigentes = useMemo(() => talleres.filter((t) => t.estado === 'VIGENTE'), [talleres]);

  // Días que tienen al menos un taller vigente
  const diasDisponibles = useMemo(() => {
    const diasConTalleres = new Set<DiaSemana>();
    vigentes.forEach((t) => {
      t.horarios.forEach((h) => diasConTalleres.add(h.diaSemana));
    });
    return DIAS_ORDEN.filter((d) => diasConTalleres.has(d.key));
  }, [vigentes]);

  const [selectedDia, setSelectedDia] = useState<DiaSemana | 'TODOS'>('TODOS');

  // Filtrar talleres según el día seleccionado
  const talleresFiltrados = useMemo(() => {
    if (selectedDia === 'TODOS') return vigentes;
    return vigentes.filter((t) =>
      t.horarios.some((h) => h.diaSemana === selectedDia)
    );
  }, [vigentes, selectedDia]);

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-[1360px] px-5 md:px-12">
        {/* Encabezado del listado */}
        <div className="flex flex-col gap-2">
          <span className="label-caps text-teal-accent">Cursado Regular & Laboratorios</span>
          <h2 className="font-serif text-3xl font-extrabold text-white md:text-4xl">
            Nuestros Talleres Vigentes
          </h2>
          <p className="text-sm text-on-surface-variant max-w-xl">
            Elegí la propuesta que mejor resuene con tu búsqueda escénica. Todos los talleres cuentan con clase de prueba previa.
          </p>
        </div>

        {/* Botones de Filtro por Día */}
        <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-surface-container-highest/60 pb-5">
          <button
            type="button"
            onClick={() => setSelectedDia('TODOS')}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
              selectedDia === 'TODOS'
                ? 'bg-primary text-primary-dark shadow-cyan-glow'
                : 'border border-surface-container-highest bg-surface-container-low text-on-surface-variant hover:text-white hover:bg-surface-container'
            }`}
          >
            Todos ({vigentes.length})
          </button>

          {diasDisponibles.map((dia) => {
            const isSelected = selectedDia === dia.key;
            const count = vigentes.filter((t) =>
              t.horarios.some((h) => h.diaSemana === dia.key)
            ).length;

            return (
              <button
                key={dia.key}
                type="button"
                onClick={() => setSelectedDia(dia.key)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-primary-dark shadow-cyan-glow'
                    : 'border border-surface-container-highest bg-surface-container-low text-on-surface-variant hover:text-white hover:bg-surface-container'
                }`}
              >
                <span>{dia.label}</span>
                <span className={`text-[10px] rounded-full px-1.5 py-0.2 ${isSelected ? 'bg-primary-dark/20' : 'bg-surface-container-highest'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grilla de Tarjetas de Talleres */}
        <div className="mt-10">
          {talleresFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {talleresFiltrados.map((taller) => (
                <TallerCard key={taller.id} taller={taller} showWhatsAppButton={true} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-container-highest/80 bg-surface-container-lowest/50 p-12 text-center">
              <AlertCircle className="h-8 w-8 text-teal-accent" />
              <h3 className="mt-3 font-serif text-lg font-bold text-white">
                No hay talleres para el día seleccionado
              </h3>
              <p className="mt-1 text-xs text-on-surface-variant">
                Probá seleccionando otro día o explorá todos los talleres vigentes.
              </p>
              <button
                type="button"
                onClick={() => setSelectedDia('TODOS')}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-dark"
              >
                Ver Todos los Talleres
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
