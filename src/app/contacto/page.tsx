import type { Metadata } from 'next';
import { contentRepository } from '@/services/content';
import { CanalesDirectosBar } from '@/components/contacto/CanalesDirectosBar';
import { ContactForm } from '@/components/contacto/ContactForm';
import { SalaPropiaSection } from '@/components/contacto/SalaPropiaSection';
import { FaqAccordion } from '@/components/contacto/FaqAccordion';

export const metadata: Metadata = {
  title: 'Contacto, Reservas y Sala Propia · Baobabs Club de Teatro',
  description:
    'Escribinos para reservar butacas, consultar por clases de teatro o alquilar nuestra sala en Córdoba. Horarios, ubicación y preguntas frecuentes.',
};

export default async function ContactoPage() {
  const siteConfig = await contentRepository.getSiteConfig();

  return (
    <div className="py-10 md:py-16">
      <div className="mx-auto max-w-[1360px] px-5 md:px-12 space-y-16 lg:space-y-20">
        {/* Encabezado Principal */}
        <div className="flex flex-col gap-2">
          <span className="label-caps text-teal-accent">Canales de Comunicación</span>
          <h1 className="font-serif text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Contacto, Boletería & Sala
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant max-w-2xl leading-relaxed">
            Estamos a tu disposición para coordinar tu próxima visita al teatro, tu primera clase de prueba o el alquiler de la sala para tu proyecto escénico.
          </p>
        </div>

        {/* 1. Barra de Accesos Rápidos (WhatsApp, Instagram, Sede, Dirección Artística) */}
        <CanalesDirectosBar contacto={siteConfig.contacto} />

        {/* 2. Formulario de Contacto y Reservas (id="formulario") */}
        <ContactForm contacto={siteConfig.contacto} />

        {/* 3. Sección "El Escenario · Sala Propia" (100% opcional defensivo) */}
        <SalaPropiaSection
          sala={siteConfig.salaPropia}
          contacto={siteConfig.contacto}
        />

        {/* 4. Sección Preguntas Frecuentes */}
        <FaqAccordion faqs={siteConfig.faqs} />
      </div>
    </div>
  );
}
