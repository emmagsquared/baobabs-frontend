import type { Metadata } from 'next';
import { contentRepository } from '@/services/content';
import { TalleresHeroBanner } from '@/components/talleres/TalleresHeroBanner';
import { TalleresFilterableList } from '@/components/talleres/TalleresFilterableList';

export const metadata: Metadata = {
  title: 'Talleres y Clases de Teatro · Baobabs Club de Teatro',
  description:
    'Explorá los talleres regulares, laboratorios escénicos y seminarios de formación teatral en Córdoba. Principiantes y avanzados.',
};

export default async function TalleresPage() {
  const [talleres, siteConfig] = await Promise.all([
    contentRepository.getTalleres(),
    contentRepository.getSiteConfig(),
  ]);

  return (
    <div className="flex flex-col">
      {/* Hero Banner de Talleres con cinta superior de preinscripción */}
      <TalleresHeroBanner banner={siteConfig.bannerTalleres} />

      {/* Listado de talleres vigentes filtrable por día de cursado */}
      <TalleresFilterableList talleres={talleres} />
    </div>
  );
}
