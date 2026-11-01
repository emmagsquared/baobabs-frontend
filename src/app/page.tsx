import { contentRepository } from '@/services/content';
import { EditorialRibbon } from '@/components/home/EditorialRibbon';
import { HeroObraDestacada } from '@/components/home/HeroObraDestacada';
import { HomeFilterableGrid } from '@/components/home/HomeFilterableGrid';
import { BannerPublicitarioSection } from '@/components/home/BannerPublicitarioSection';

export default async function HomePage() {
  const [obras, talleres, siteConfig] = await Promise.all([
    contentRepository.getObras(),
    contentRepository.getTalleres(),
    contentRepository.getSiteConfig(),
  ]);

  // Identificar la obra destacada (esDestacada: true) o la primera de la cartelera
  const obraDestacada = obras.find((o) => o.esDestacada) || obras[0];

  return (
    <div className="flex flex-col">
      {/* 1. Cinta Editorial Superior */}
      <EditorialRibbon
        contacto={siteConfig.contacto}
        footer={siteConfig.footer}
      />

      {/* 2. Hero de Obra Destacada */}
      {obraDestacada && <HeroObraDestacada obra={obraDestacada} />}

      {/* 3. Barra Sticky de Filtros (#cartelera) y Grilla */}
      <HomeFilterableGrid obras={obras} talleres={talleres} />

      {/* 4. Banner Publicitario ("Hacer Teatro Hace Bien") */}
      <BannerPublicitarioSection banner={siteConfig.bannerPublicitario} />
    </div>
  );
}
