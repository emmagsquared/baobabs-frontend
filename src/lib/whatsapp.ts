/**
 * Generador seguro de enlaces para WhatsApp (https://wa.me/).
 * Normaliza números internacionales y codifica textos de consulta de forma robusta.
 */

/**
 * Limpia y normaliza un número de teléfono para wa.me,
 * quitando espacios, guiones, paréntesis y signos +.
 * Ejemplo: "(351) 686-6684" o "+54 9 351 686-6684" -> "5493516866684"
 */
export function cleanWhatsAppNumber(phone: string): string {
  if (!phone) return '';
  return phone.replace(/[^\d]/g, '');
}

/**
 * Construye una URL directa a WhatsApp (https://wa.me/<numero>?text=<mensaje>).
 * Si no se provee texto o está vacío, genera el link directo a la conversación.
 */
export function buildWhatsAppUrl(phone: string, text?: string | null): string {
  const cleanNumber = cleanWhatsAppNumber(phone);
  if (!cleanNumber) return '#';

  if (!text || !text.trim()) {
    return `https://wa.me/${cleanNumber}`;
  }

  const encodedText = encodeURIComponent(text.trim());
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}

/**
 * Genera link con mensaje precargado para consulta o reserva de una obra.
 */
export function buildObraWhatsAppUrl(phone: string, tituloObra: string): string {
  const mensaje = `Hola Baobabs! Quisiera consultar y reservar entradas para la obra "${tituloObra}".`;
  return buildWhatsAppUrl(phone, mensaje);
}

/**
 * Genera link con mensaje precargado para consulta o inscripción a un taller.
 */
export function buildTallerWhatsAppUrl(phone: string, nombreTaller: string): string {
  const mensaje = `Hola! Me comunico desde la web de Baobabs para consultar sobre el "${nombreTaller}".`;
  return buildWhatsAppUrl(phone, mensaje);
}

/**
 * Genera link con mensaje precargado para consulta de alquiler de sala.
 */
export function buildSalaWhatsAppUrl(phone: string, mensajeCustom?: string | null): string {
  const mensaje =
    mensajeCustom?.trim() ||
    'Hola Baobabs! Quisiera consultar disponibilidad y condiciones para alquilar la sala.';
  return buildWhatsAppUrl(phone, mensaje);
}
