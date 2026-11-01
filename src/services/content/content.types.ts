/**
 * Contratos de datos exactos para Baobabs Club de Teatro.
 * Coinciden 1:1 con el BFF en NestJS y con los archivos frontmatter de /content/.
 */

export interface FuncionObra {
  fecha: string; // Formato ISO "YYYY-MM-DD"
  hora: string;  // Formato 24h "HH:mm"
}

export interface Obra {
  id: string;
  slug: string;
  imagen: string;            // Ej. "/images/obras/el-jardin.jpg" o URL del BFF
  titulo: string;
  subtitulo: string;
  descripcionBreve: string;
  descripcion: string;       // Si esJam === true y está vacía, usa JamConfig.descripcionPorDefecto
  funciones: FuncionObra[];  // Lista de 1 o más fechas con su respectiva hora
  duracion?: string | null;  // Opcional (ej. "65 min")
  direccionGeneral: string;
  elencoYVoces: string;
  espacioEscenico: string;
  produccion: string;
  precio: number;            // Entero en ARS (ej. 4500)
  esJam: boolean;            // Identifica si es una Jam Escénica
  esDestacada?: boolean;     // Para mostrar en el Hero principal de inicio
}

export interface JamConfig {
  descripcionPorDefecto: string;
}

export type DiaSemana =
  | 'LUNES'
  | 'MARTES'
  | 'MIERCOLES'
  | 'JUEVES'
  | 'VIERNES'
  | 'SABADO'
  | 'DOMINGO';

export type FrecuenciaTaller = 'SEMANAL' | 'QUINCENAL'; // Todas las semanas | Semana de por medio
export type EstadoTaller = 'VIGENTE' | 'EN_RECESO';     // EN_RECESO lo quita del calendario

export interface HorarioTaller {
  diaSemana: DiaSemana;
  horaInicio: string; // "HH:mm"
  horaFin: string;    // "HH:mm"
}

export interface Taller {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  docentes: string;
  precioPorMes: number;
  telefonoContacto: string;  // Ej. "5493516866684"
  nivel?: string | null;     // Opcional
  frecuencia: FrecuenciaTaller;
  fechaReferencia?: string | null; // "YYYY-MM-DD" para calcular semanas pares/impares si es QUINCENAL
  estado: EstadoTaller;
  horarios: HorarioTaller[];
}

export interface BannerPublicitario {
  foto: string;       // "/images/banners/banner-publicitario.jpg"
  titulo: string;     // Ej. "Hacer Teatro Hace Bien."
  subtitulo: string;  // Ej. "Vení a probar la primera clase sin compromiso."
  descripcion: string;
}

export interface BannerTalleres {
  foto: string;       // "/images/banners/banner-talleres.jpg"
  etiquetaSuperior?: string | null;
  subtitulo: string;
  titulo: string;
  descripcion: string;
  badges?: string[];
  sedeTarjetaTitulo?: string | null;
  sedeTarjetaSubtitulo?: string | null;
}

export interface ContactoConfig {
  whatsappNumero: string;          // Para links wa.me (ej. "5493516866684")
  whatsappVisible: string;         // Texto legible (ej. "(351) 686-6684")
  whatsappHorario?: string | null;
  instagramUsuario: string;        // Ej. "@baobabsclubdeteatro"
  instagramUrl: string;
  sedeNombre: string;
  sedeDireccion: string;
  direccionArtisticaNombre: string;
  direccionArtisticaHandle: string;
  direccionArtisticaUrl: string;
  emailDestinoFormulario: string;  // Mail receptor configurado en MD (Etapa 1) o recibido/usado por BFF (Etapa 3)
  emailVisible?: string | null;
}

export interface SalaPropiaConfig {
  // TODOS los parámetros de Sala Propia son estrictamente opcionales
  etiquetaSuperior?: string | null;
  tituloSala?: string | null;
  descripcionSala?: string | null;
  butacas?: string | null;
  dimensionesEscenario?: string | null;
  climatizacion?: string | null;
  direccionCompleta?: string | null;
  googleMapsUrl?: string | null;
  colectivos?: string | null;
  estacionamiento?: string | null;
  poloGastronomico?: string | null;
  foto1Url?: string | null;
  foto1Epigrafe?: string | null;
  foto2Url?: string | null;
  foto2Epigrafe?: string | null;
  parrillaLuminica?: string | null;
  acusticaYSonido?: string | null;
  comodidades?: string | null;
  disposicionGradas?: string | null;
  buscasSalaTitulo?: string | null;
  buscasSalaDescripcion?: string | null;
  buscasSalaTextoBoton?: string | null;
  buscasSalaMensajeWsp?: string | null;
}

export interface FaqItem {
  id: string;
  pregunta: string;
  respuesta: string;
  orden: number;
}

export interface FooterConfig {
  cintaSuperiorTemporada?: string | null;
  marcaTitulo: string;
  marcaDescripcion: string;
  instagramHandle: string;
  instagramUrl: string;
  ubicacionTitulo: string;
  salaNombre: string;
  salaDireccion: string;
  salaCiudad: string;
  horarioBoleteria: string;
  horarioTalleres: string;
  contactoTitulo: string;
  telefonoVisible: string;
  telefonoWhatsappNumero: string; // Al hacer click en el teléfono del footer abre wa.me/<telefonoWhatsappNumero>
  emailVisible: string;
  ctaTexto: string;
  copyrightTexto: string;
  lemaDerecho: string;
}

export interface SiteConfig {
  jam: JamConfig;
  bannerPublicitario: BannerPublicitario;
  bannerTalleres: BannerTalleres;
  contacto: ContactoConfig;
  salaPropia: SalaPropiaConfig;
  footer: FooterConfig;
  faqs: FaqItem[];
}

export interface ContactFormPayload {
  asunto: 'talleres' | 'reserva-obras' | 'alquiler' | 'direccion-artistica' | string;
  nombre: string;
  telefono: string;
  email: string;
  experiencia?: string;
  mensaje: string;
}

/**
 * Patrón Adaptador de Contenido:
 * Única interfaz consumida por la capa de presentación (páginas y componentes).
 */
export interface ContentRepository {
  getObras(): Promise<Obra[]>;
  getObraBySlug(slug: string): Promise<Obra | null>;
  getTalleres(): Promise<Taller[]>;
  getSiteConfig(): Promise<SiteConfig>;
}
