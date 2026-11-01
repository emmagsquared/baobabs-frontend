import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {
  ContentRepository,
  Obra,
  Taller,
  SiteConfig,
  JamConfig,
  BannerPublicitario,
  BannerTalleres,
  ContactoConfig,
  SalaPropiaConfig,
  FooterConfig,
  FaqItem,
  FuncionObra,
} from './content.types';
import { normalizeDateString } from '@/lib/dates';

/**
 * Repositorio de Contenido para la Etapa 1° (NEXT_PUBLIC_DATA_SOURCE=markdown).
 * Lee de forma asíncrona todos los archivos .md desde la carpeta /content/
 * con YAML frontmatter y mapea a los tipos TypeScript estrictos.
 */
export class MarkdownContentRepository implements ContentRepository {
  private baseDir: string;

  constructor(customBaseDir?: string) {
    this.baseDir = customBaseDir || path.join(process.cwd(), 'content');
  }

  /**
   * Lee un archivo individual de contenido y retorna su frontmatter tipado y cuerpo.
   */
  private readFile<T>(subPath: string): { data: T; content: string } | null {
    const fullPath = path.join(this.baseDir, subPath);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    const raw = fs.readFileSync(fullPath, 'utf-8');
    const parsed = matter(raw);
    return {
      data: parsed.data as T,
      content: parsed.content.trim(),
    };
  }

  /**
   * Lee todos los archivos .md dentro de un directorio.
   */
  private readDirectory<T>(dirSubPath: string): Array<{ slug: string; data: T; content: string }> {
    const targetDir = path.join(this.baseDir, dirSubPath);
    if (!fs.existsSync(targetDir)) {
      return [];
    }

    const files = fs.readdirSync(targetDir);
    const results: Array<{ slug: string; data: T; content: string }> = [];

    for (const file of files) {
      if (file.endsWith('.md')) {
        const slug = file.replace(/\.md$/, '');
        const fullPath = path.join(targetDir, file);
        const raw = fs.readFileSync(fullPath, 'utf-8');
        const parsed = matter(raw);
        results.push({
          slug,
          data: parsed.data as T,
          content: parsed.content.trim(),
        });
      }
    }

    return results;
  }

  /**
   * Obtiene la configuración de Jam Escénica (content/config/jam.md).
   */
  public async getJamConfig(): Promise<JamConfig> {
    const file = this.readFile<Partial<JamConfig>>('config/jam.md');
    return {
      descripcionPorDefecto:
        file?.data?.descripcionPorDefecto ||
        'La Jam Escénica es un espacio de improvisación teatral abierta, cruce de lenguajes escénicos y experimentación colectiva en vivo.',
    };
  }

  /**
   * Obtiene todas las obras de teatro (content/obras/*.md).
   * Si una obra tiene esJam: true y su descripcion está vacía,
   * asigna automáticamente la descripcionPorDefecto de JamConfig.
   */
  public async getObras(): Promise<Obra[]> {
    const entries = this.readDirectory<Record<string, unknown>>('obras');
    const jamConfig = await this.getJamConfig();

    const obras: Obra[] = entries.map(({ slug, data, content }) => {
      const esJam = Boolean(data.esJam);
      const rawDescripcion = String(data.descripcion || content || '');
      const descripcion =
        esJam && !rawDescripcion.trim()
          ? jamConfig.descripcionPorDefecto
          : rawDescripcion;

      // Normalizar funciones
      const rawFunciones = Array.isArray(data.funciones) ? data.funciones : [];
      const funciones: FuncionObra[] = rawFunciones.map((f: Record<string, unknown>) => ({
        fecha: normalizeDateString(f.fecha as string | Date),
        hora: String(f.hora || '21:00'),
      }));

      return {
        id: String(data.id || slug),
        slug: String(data.slug || slug),
        imagen: String(data.imagen || `/images/obras/${slug}.jpg`),
        titulo: String(data.titulo || 'Sin título'),
        subtitulo: String(data.subtitulo || ''),
        descripcionBreve: String(data.descripcionBreve || ''),
        descripcion,
        funciones,
        duracion: data.duracion ? String(data.duracion) : null,
        direccionGeneral: String(data.direccionGeneral || ''),
        elencoYVoces: String(data.elencoYVoces || ''),
        espacioEscenico: String(data.espacioEscenico || 'Sala Principal Baobabs'),
        produccion: String(data.produccion || 'Baobabs Club de Teatro'),
        precio: Number(data.precio || 0),
        esJam,
        esDestacada: Boolean(data.esDestacada),
      };
    });

    // Ordenar obras destacadas primero, y luego alfabéticamente
    return obras.sort((a, b) => {
      if (a.esDestacada && !b.esDestacada) return -1;
      if (!a.esDestacada && b.esDestacada) return 1;
      return a.titulo.localeCompare(b.titulo);
    });
  }

  /**
   * Obtiene una obra por su slug exacto.
   */
  public async getObraBySlug(slug: string): Promise<Obra | null> {
    const obras = await this.getObras();
    return obras.find((o) => o.slug === slug) || null;
  }

  /**
   * Obtiene todos los talleres (content/talleres/*.md).
   */
  public async getTalleres(): Promise<Taller[]> {
    const entries = this.readDirectory<Record<string, unknown>>('talleres');

    return entries.map(({ slug, data, content }) => {
      const rawHorarios = Array.isArray(data.horarios) ? data.horarios : [];
      const horarios = rawHorarios.map((h: Record<string, unknown>) => ({
        diaSemana: (String(h.diaSemana || 'LUNES').toUpperCase()) as Taller['horarios'][0]['diaSemana'],
        horaInicio: String(h.horaInicio || '18:00'),
        horaFin: String(h.horaFin || '20:00'),
      }));

      return {
        id: String(data.id || slug),
        slug: String(data.slug || slug),
        nombre: String(data.nombre || 'Taller de Teatro'),
        descripcion: String(data.descripcion || content || ''),
        docentes: String(data.docentes || ''),
        precioPorMes: Number(data.precioPorMes || 0),
        telefonoContacto: String(data.telefonoContacto || '5493516866684'),
        nivel: data.nivel ? String(data.nivel) : null,
        frecuencia: (String(data.frecuencia || 'SEMANAL').toUpperCase()) as Taller['frecuencia'],
        fechaReferencia: data.fechaReferencia ? normalizeDateString(data.fechaReferencia as string | Date) : null,
        estado: (String(data.estado || 'VIGENTE').toUpperCase()) as Taller['estado'],
        horarios,
      };
    });
  }

  /**
   * Obtiene el banner publicitario de inicio (content/banners/publicitario.md).
   */
  public async getBannerPublicitario(): Promise<BannerPublicitario> {
    const file = this.readFile<Partial<BannerPublicitario>>('banners/publicitario.md');
    return {
      foto: file?.data?.foto || '/images/banners/banner-publicitario.jpg',
      titulo: file?.data?.titulo || 'Hacer Teatro Hace Bien.',
      subtitulo: file?.data?.subtitulo || 'Vení a probar la primera clase sin compromiso.',
      descripcion: file?.data?.descripcion || file?.content || 'Un espacio de juego, encuentro e investigación artística en Córdoba.',
    };
  }

  /**
   * Obtiene el banner de la sección Talleres (content/banners/talleres.md).
   */
  public async getBannerTalleres(): Promise<BannerTalleres> {
    const file = this.readFile<Partial<BannerTalleres>>('banners/talleres.md');
    return {
      foto: file?.data?.foto || '/images/banners/banner-talleres.jpg',
      etiquetaSuperior: file?.data?.etiquetaSuperior ?? 'Ciclo de Formación',
      subtitulo: file?.data?.subtitulo || 'Entrenamiento, presencia y poética escénica',
      titulo: file?.data?.titulo || 'Talleres, Laboratorios y Clases Regulares',
      descripcion: file?.data?.descripcion || file?.content || 'Grupos reducidos con seguimiento personalizado.',
      badges: file?.data?.badges || ['Clase de prueba sin cargo', 'Cupos reducidos'],
      sedeTarjetaTitulo: file?.data?.sedeTarjetaTitulo ?? 'Sede Central Baobabs',
      sedeTarjetaSubtitulo: file?.data?.sedeTarjetaSubtitulo ?? 'Salas con climatización y piso entablonado',
    };
  }

  /**
   * Obtiene la configuración de contacto (content/config/contacto.md).
   */
  public async getContactoConfig(): Promise<ContactoConfig> {
    const file = this.readFile<Partial<ContactoConfig>>('config/contacto.md');
    return {
      whatsappNumero: file?.data?.whatsappNumero || '5493516866684',
      whatsappVisible: file?.data?.whatsappVisible || '(351) 686-6684',
      whatsappHorario: file?.data?.whatsappHorario ?? 'Lunes a Viernes de 16:00 a 21:00 hs',
      instagramUsuario: file?.data?.instagramUsuario || '@baobabsclubdeteatro',
      instagramUrl: file?.data?.instagramUrl || 'https://www.instagram.com/baobabsclubdeteatro',
      sedeNombre: file?.data?.sedeNombre || 'Baobabs Club de Teatro',
      sedeDireccion: file?.data?.sedeDireccion || 'Bv. San Juan 1015, Córdoba',
      direccionArtisticaNombre: file?.data?.direccionArtisticaNombre || 'Dirección Artística',
      direccionArtisticaHandle: file?.data?.direccionArtisticaHandle || '@baobabsclubdeteatro',
      direccionArtisticaUrl: file?.data?.direccionArtisticaUrl || 'https://www.instagram.com/baobabsclubdeteatro',
      emailDestinoFormulario: file?.data?.emailDestinoFormulario || 'contacto@baobabsteatro.com.ar',
      emailVisible: file?.data?.emailVisible ?? 'info@baobabsteatro.com.ar',
    };
  }

  /**
   * Obtiene la configuración de Sala Propia (content/config/sala-propia.md).
   * Todos los campos son estrictamente opcionales.
   */
  public async getSalaPropiaConfig(): Promise<SalaPropiaConfig> {
    const file = this.readFile<Partial<SalaPropiaConfig>>('config/sala-propia.md');
    const d = file?.data || {};
    return {
      etiquetaSuperior: d.etiquetaSuperior ?? null,
      tituloSala: d.tituloSala ?? null,
      descripcionSala: d.descripcionSala ?? file?.content ?? null,
      butacas: d.butacas ?? null,
      dimensionesEscenario: d.dimensionesEscenario ?? null,
      climatizacion: d.climatizacion ?? null,
      direccionCompleta: d.direccionCompleta ?? null,
      googleMapsUrl: d.googleMapsUrl ?? null,
      colectivos: d.colectivos ?? null,
      estacionamiento: d.estacionamiento ?? null,
      poloGastronomico: d.poloGastronomico ?? null,
      foto1Url: d.foto1Url ?? null,
      foto1Epigrafe: d.foto1Epigrafe ?? null,
      foto2Url: d.foto2Url ?? null,
      foto2Epigrafe: d.foto2Epigrafe ?? null,
      parrillaLuminica: d.parrillaLuminica ?? null,
      acusticaYSonido: d.acusticaYSonido ?? null,
      comodidades: d.comodidades ?? null,
      disposicionGradas: d.disposicionGradas ?? null,
      buscasSalaTitulo: d.buscasSalaTitulo ?? null,
      buscasSalaDescripcion: d.buscasSalaDescripcion ?? null,
      buscasSalaTextoBoton: d.buscasSalaTextoBoton ?? null,
      buscasSalaMensajeWsp: d.buscasSalaMensajeWsp ?? null,
    };
  }

  /**
   * Obtiene la configuración del Footer (content/config/footer.md).
   */
  public async getFooterConfig(): Promise<FooterConfig> {
    const file = this.readFile<Partial<FooterConfig>>('config/footer.md');
    const d = file?.data || {};
    return {
      cintaSuperiorTemporada: d.cintaSuperiorTemporada ?? 'Temporada Teatral 2026 · Baobabs Club de Teatro',
      marcaTitulo: d.marcaTitulo || 'Baobabs Club de Teatro',
      marcaDescripcion:
        d.marcaDescripcion ||
        'Club de teatro independiente en Córdoba, Argentina. Obras de sala, jams escénicas y talleres de formación.',
      instagramHandle: d.instagramHandle || '@baobabsclubdeteatro',
      instagramUrl: d.instagramUrl || 'https://www.instagram.com/baobabsclubdeteatro',
      ubicacionTitulo: d.ubicacionTitulo || 'Nuestra Sala',
      salaNombre: d.salaNombre || 'Baobabs Club de Teatro',
      salaDireccion: d.salaDireccion || 'Bv. San Juan 1015',
      salaCiudad: d.salaCiudad || 'Córdoba, Argentina',
      horarioBoleteria: d.horarioBoleteria || 'Viernes, Sábados y Domingos desde las 19:30 hs',
      horarioTalleres: d.horarioTalleres || 'Lunes a Jueves de 17:00 a 22:30 hs',
      contactoTitulo: d.contactoTitulo || 'Contacto y Reservas',
      telefonoVisible: d.telefonoVisible || '(351) 686-6684',
      telefonoWhatsappNumero: d.telefonoWhatsappNumero || '5493516866684',
      emailVisible: d.emailVisible || 'info@baobabsteatro.com.ar',
      ctaTexto: d.ctaTexto || 'Inscribirme / Reservar Butaca',
      copyrightTexto: d.copyrightTexto || '© 2026 Baobabs Club de Teatro. Todos los derechos reservados.',
      lemaDerecho: d.lemaDerecho || 'El teatro transforma, convoca y emancipa.',
    };
  }

  /**
   * Obtiene la lista de preguntas frecuentes (content/faqs/preguntas-frecuentes.md).
   */
  public async getFaqs(): Promise<FaqItem[]> {
    const file = this.readFile<{ faqs?: FaqItem[] }>('faqs/preguntas-frecuentes.md');
    const faqs = Array.isArray(file?.data?.faqs) ? file!.data!.faqs! : [];
    return faqs.sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
  }

  /**
   * Obtiene toda la configuración global del sitio agrupada.
   */
  public async getSiteConfig(): Promise<SiteConfig> {
    const [jam, bannerPublicitario, bannerTalleres, contacto, salaPropia, footer, faqs] =
      await Promise.all([
        this.getJamConfig(),
        this.getBannerPublicitario(),
        this.getBannerTalleres(),
        this.getContactoConfig(),
        this.getSalaPropiaConfig(),
        this.getFooterConfig(),
        this.getFaqs(),
      ]);

    return {
      jam,
      bannerPublicitario,
      bannerTalleres,
      contacto,
      salaPropia,
      footer,
      faqs,
    };
  }
}
