'use client';

import { useState } from 'react';
import { FaqItem } from '@/services/content/content.types';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqAccordionProps {
  faqs: FaqItem[];
}

export function FaqAccordion({ faqs }: FaqAccordionProps) {
  // Primer pregunta abierta por defecto
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId((curr) => (curr === id ? null : id));
  };

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-8">
      <div className="mb-8">
        <span className="label-caps text-teal-accent">Respuestas Inmediatas</span>
        <h2 className="mt-1 font-serif text-3xl font-extrabold text-white md:text-4xl">
          Preguntas Frecuentes
        </h2>
        <p className="mt-2 text-sm text-on-surface-variant max-w-xl">
          Todo lo que necesitás saber sobre reservas, dinámica de los talleres, formas de pago y funcionamiento de la sala.
        </p>
      </div>

      <div className="divide-y divide-surface-container-highest/60 rounded-2xl border border-surface-container-highest/80 bg-surface-container/60 overflow-hidden">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;

          return (
            <div key={faq.id} className="transition-colors">
              <button
                type="button"
                onClick={() => toggle(faq.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between p-5 md:p-6 text-left cursor-pointer hover:bg-surface-container/80 transition-colors"
              >
                <div className="flex items-start gap-3.5 pr-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-accent/10 text-teal-accent mt-0.5">
                    <HelpCircle className="h-4 w-4" />
                  </div>
                  <span className="font-serif text-base md:text-lg font-bold text-white">
                    {faq.pregunta}
                  </span>
                </div>

                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`}>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-1 text-sm leading-relaxed text-on-surface-variant pl-16">
                  <p>{faq.respuesta}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
