import type { Metadata } from 'next';
import { contentRepository } from '@/services/content';
import { CalendarioWorkspace } from '@/components/calendario/CalendarioWorkspace';

export const metadata: Metadata = {
  title: 'Calendario de Obras, Jams y Talleres · Baobabs Club de Teatro',
  description:
    'Consultá la grilla mensual y semanal de funciones teatrales, jam escénica y clases regulares en Córdoba. Reserva de entradas directa.',
};

export default async function CalendarioPage() {
  const [obras, talleres] = await Promise.all([
    contentRepository.getObras(),
    contentRepository.getTalleres(),
  ]);

  return (
    <div className="py-10 md:py-16">
      <div className="mx-auto max-w-[1360px] px-5 md:px-12">
        {/* Encabezado editorial */}
        <div className="mb-10 flex flex-col gap-2">
          <span className="label-caps text-teal-accent">Programación Unificada</span>
          <h1 className="font-serif text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Calendario de Sala & Actividades
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant max-w-2xl leading-relaxed">
            Explorá todas las funciones de obras, noches de Jam Escénica y horarios regulares de talleres en nuestra sala de Córdoba Capital.
          </p>
        </div>

        {/* Workspace del Calendario con Vistas Mes / Semana / Listado */}
        <CalendarioWorkspace obras={obras} talleres={talleres} />
      </div>
    </div>
  );
}
