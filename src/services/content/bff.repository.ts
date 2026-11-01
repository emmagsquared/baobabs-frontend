import {
  ContentRepository,
  Obra,
  Taller,
  SiteConfig,
  ContactFormPayload,
} from './content.types';

/**
 * Repositorio de Contenido para la Etapa 3° (NEXT_PUBLIC_DATA_SOURCE=bff).
 * Se conecta vía HTTP con el BFF en NestJS desplegado en NEXT_PUBLIC_BFF_URL.
 * En la Etapa 1° queda implementado como cliente funcional/stub listo para activarse.
 */
export class BffContentRepository implements ContentRepository {
  private bffUrl: string;

  constructor(customUrl?: string) {
    this.bffUrl =
      customUrl ||
      process.env.NEXT_PUBLIC_BFF_URL ||
      'http://localhost:4000';
  }

  /**
   * Helper genérico para peticiones HTTP con manejo de errores limpio.
   */
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.bffUrl}${endpoint}`;
    try {
      const res = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        ...options,
      });

      if (!res.ok) {
        throw new Error(`[BffContentRepository] Error ${res.status}: ${res.statusText} en ${url}`);
      }

      return (await res.json()) as T;
    } catch (error) {
      console.error(`[BffContentRepository] Falló petición a ${url}:`, error);
      throw error;
    }
  }

  /**
   * GET /api/public/obras
   */
  public async getObras(): Promise<Obra[]> {
    return this.request<Obra[]>('/api/public/obras');
  }

  /**
   * GET /api/public/obras/:slug
   */
  public async getObraBySlug(slug: string): Promise<Obra | null> {
    try {
      return await this.request<Obra>(`/api/public/obras/${encodeURIComponent(slug)}`);
    } catch {
      return null;
    }
  }

  /**
   * GET /api/public/talleres
   */
  public async getTalleres(): Promise<Taller[]> {
    return this.request<Taller[]>('/api/public/talleres');
  }

  /**
   * GET /api/public/site-config
   * Devuelve { jam, bannerPublicitario, bannerTalleres, contacto, salaPropia, footer, faqs }
   */
  public async getSiteConfig(): Promise<SiteConfig> {
    return this.request<SiteConfig>('/api/public/site-config');
  }

  /**
   * POST /api/public/contact
   * Envía los datos del formulario de contacto para que el BFF despache el correo.
   */
  public async sendContactForm(payload: ContactFormPayload): Promise<{ success: boolean; message?: string }> {
    return this.request<{ success: boolean; message?: string }>('/api/public/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}
