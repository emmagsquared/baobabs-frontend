'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ContactoConfig } from '@/services/content/content.types';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { Send, CheckCircle2, AlertCircle, Sparkles, GraduationCap, Film, Key, Compass, MessageCircle } from 'lucide-react';

interface ContactFormProps {
  contacto: ContactoConfig;
}

type AsuntoTipo = 'talleres' | 'reserva-obras' | 'alquiler' | 'direccion-artistica';

const ASUNTOS: Array<{ id: AsuntoTipo; label: string; icon: React.ElementType; desc: string }> = [
  {
    id: 'talleres',
    label: 'Talleres y Clases',
    icon: GraduationCap,
    desc: 'Inscripción y clases de prueba',
  },
  {
    id: 'reserva-obras',
    label: 'Reserva de Obras',
    icon: Film,
    desc: 'Butacas para cartelera y jams',
  },
  {
    id: 'alquiler',
    label: 'Alquiler / Ensayos',
    icon: Key,
    desc: 'Uso de sala, luces y sonido',
  },
  {
    id: 'direccion-artistica',
    label: 'Dirección Artística',
    icon: Compass,
    desc: 'Proyectos y propuestas escénicas',
  },
];

function ContactFormInner({ contacto }: ContactFormProps) {
  const searchParams = useSearchParams();
  const asuntoParam = searchParams.get('asunto') as AsuntoTipo | null;
  const itemParam = searchParams.get('item');

  // Asunto inicial
  const initialAsunto: AsuntoTipo =
    asuntoParam && ASUNTOS.some((a) => a.id === asuntoParam)
      ? asuntoParam
      : 'talleres';

  const [asunto, setAsunto] = useState<AsuntoTipo>(initialAsunto);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [experiencia, setExperiencia] = useState('');

  // Mensaje inicial precargado si viene ?item=...
  const initialMensaje = useMemo(() => {
    if (itemParam) {
      if (initialAsunto === 'reserva-obras') {
        return `Hola! Quisiera solicitar reserva para la obra "${itemParam}".`;
      }
      if (initialAsunto === 'talleres') {
        return `Hola! Me gustaría inscribirme o probar una clase del "${itemParam}".`;
      }
      return `Hola! Quisiera consultar sobre "${itemParam}".`;
    }
    return '';
  }, [itemParam, initialAsunto]);

  const [mensaje, setMensaje] = useState(initialMensaje);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setStatusMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asunto,
          nombre,
          telefono,
          email,
          experiencia,
          mensaje,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setStatusMessage(
          '¡Tu mensaje fue enviado con éxito! Nos pondremos en contacto a la brevedad por WhatsApp o correo.'
        );
      } else {
        throw new Error(data.message || 'Ocurrió un error al enviar el formulario.');
      }
    } catch (err: unknown) {
      setStatus('error');
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'No se pudo enviar el correo en este momento. Por favor intentá comunicarte por WhatsApp.';
      setStatusMessage(errorMsg);
    }
  };

  const directWspUrl = buildWhatsAppUrl(
    contacto.whatsappNumero,
    `Hola Baobabs! Mi nombre es ${nombre || 'un espectador/a'}. Asunto: ${asunto}. Mensaje: ${mensaje || 'Quisiera hacer una consulta.'}`
  );

  return (
    <section id="formulario" className="scroll-mt-24 rounded-3xl border border-surface-container-highest/80 bg-surface-container/70 p-6 md:p-10 lg:p-12 shadow-2xl backdrop-blur-md">
      <div className="mb-8">
        <span className="label-caps text-teal-accent">Envianos tu consulta</span>
        <h2 className="mt-1 font-serif text-3xl font-extrabold text-white md:text-4xl">
          Formulario de Contacto & Reservas
        </h2>
        <p className="mt-2 text-sm text-on-surface-variant max-w-xl">
          Elegí el motivo de tu mensaje y completá tus datos. Respondemos todas las consultas en menos de 24 horas.
        </p>
      </div>

      {status === 'success' ? (
        <div className="rounded-2xl border border-teal-accent/40 bg-teal-accent/10 p-8 text-center animate-fade-in">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-accent/20 text-teal-accent">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="mt-4 font-serif text-2xl font-bold text-white">¡Mensaje Enviado con Éxito!</h3>
          <p className="mt-2 text-sm text-on-surface-variant max-w-md mx-auto">
            {statusMessage}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                setStatus('idle');
                setMensaje('');
              }}
              className="rounded-lg border border-surface-container-highest bg-surface-container px-4 py-2.5 text-xs font-bold text-white hover:bg-surface-container-high transition-colors"
            >
              Enviar otra consulta
            </button>
            <a
              href={directWspUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-accent px-4 py-2.5 text-xs font-bold text-primary-dark shadow-cyan-glow hover:brightness-110 transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Continuar por WhatsApp</span>
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Selector de Asunto: 4 tarjetas */}
          <div>
            <label className="label-caps block mb-3 text-white">
              1. Seleccioná el Asunto de tu Consulta
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {ASUNTOS.map((item) => {
                const Icon = item.icon;
                const isSelected = asunto === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAsunto(item.id)}
                    className={`flex flex-col items-start rounded-xl p-4 border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-cyan-glow'
                        : 'border-surface-container-highest/60 bg-surface-container-low hover:border-surface-container-high hover:bg-surface-container'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-primary-dark' : 'bg-surface-container-high text-teal-accent'}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="mt-3 font-serif font-bold text-white text-sm">
                      {item.label}
                    </span>
                    <span className="mt-0.5 text-[11px] text-on-surface-variant">
                      {item.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Datos de Contacto */}
          <div>
            <label className="label-caps block mb-3 text-white">
              2. Tus Datos Personales
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="nombre" className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Nombre Completo *
                </label>
                <input
                  id="nombre"
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Julieta Rossi"
                  className="w-full rounded-lg border border-surface-container-highest bg-surface-container-low px-4 py-3 text-sm text-white placeholder-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="telefono" className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Teléfono / WhatsApp *
                </label>
                <input
                  id="telefono"
                  type="tel"
                  required
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Ej. 351 686-6684"
                  className="w-full rounded-lg border border-surface-container-highest bg-surface-container-low px-4 py-3 text-sm text-white placeholder-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Correo Electrónico *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@ejemplo.com"
                  className="w-full rounded-lg border border-surface-container-highest bg-surface-container-low px-4 py-3 text-sm text-white placeholder-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* 3. Nivel de Experiencia / Perfil (Opcional) */}
          <div>
            <label htmlFor="experiencia" className="block text-xs font-semibold text-on-surface-variant mb-1">
              Nivel de Experiencia / Perfil (Opcional)
            </label>
            <select
              id="experiencia"
              value={experiencia}
              onChange={(e) => setExperiencia(e.target.value)}
              className="w-full rounded-lg border border-surface-container-highest bg-surface-container-low px-4 py-3 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Seleccionar una opción...</option>
              <option value="sin-experiencia">Sin experiencia previa (quiero empezar de cero)</option>
              <option value="principiante">Principiante / Tomé algún taller o seminario</option>
              <option value="intermedio-avanzado">Intermedio / Avanzado con entrenamiento teatral</option>
              <option value="actor-profesional">Actor / Actriz profesional</option>
              <option value="docente-director">Docente, Director/a o Investigador/a</option>
              <option value="elenco-productora">Compañía teatral / Productora independiente</option>
            </select>
          </div>

          {/* 4. Mensaje */}
          <div>
            <label htmlFor="mensaje" className="block text-xs font-semibold text-on-surface-variant mb-1">
              Mensaje o Consulta *
            </label>
            <textarea
              id="mensaje"
              rows={4}
              required
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Contanos tu consulta, cuántas butacas querés reservar o qué taller te interesa..."
              className="w-full rounded-lg border border-surface-container-highest bg-surface-container-low px-4 py-3 text-sm text-white placeholder-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Estado de Error */}
          {status === 'error' && (
            <div className="flex items-center gap-2.5 rounded-lg border border-red-500/40 bg-red-950/20 p-4 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Botón de Envío */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
            <span className="text-[11px] text-on-surface-variant">
              Tus datos se utilizarán únicamente para responder tu consulta.
            </span>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-bold text-primary-dark shadow-cyan-glow transition-all hover:brightness-110 hover:shadow-[0_0_24px_rgba(34,211,238,0.5)] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {status === 'loading' ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  <span>Enviando mensaje...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Enviar Consulta</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

export function ContactForm(props: ContactFormProps) {
  return (
    <Suspense fallback={<div className="py-16 text-center text-sm text-on-surface-variant">Cargando formulario...</div>}>
      <ContactFormInner {...props} />
    </Suspense>
  );
}
