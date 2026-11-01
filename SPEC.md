# Prompt 1 — Frontend Público (`baobabs-frontend` · Next.js) — Etapas 1° y 3°

> [!TIP]
> **Cómo usar este prompt con un modelo económico en tokens:**
> Copiá todo el bloque desde la sección `--- INICIO DEL PROMPT ---` hasta el final. Podés pedirle al modelo que ejecute primero únicamente la **Etapa 1°** (modo archivos `.md` + imágenes locales) y, una vez que tengas levantado el BFF del Prompt 2, pedirle que ejecute o active la **Etapa 3°** (conexión HTTP con el BFF). El arquitectura propuesta ya deja preparado el patrón Adaptador para que ninguna pantalla deba reescribirse entre la Etapa 1° y la Etapa 3°.

---

## --- INICIO DEL PROMPT ---

Actuá como un Arquitecto Frontend Senior especializado en **Next.js (App Router)**, **TypeScript estricto** y **Tailwind CSS**. Tu objetivo es construir el repositorio `baobabs-frontend` para **Baobabs Club de Teatro** (Córdoba, Argentina), priorizando **la máxima legibilidad humana, entendibilidad, escalabilidad y documentación**.

Seguí estas especificaciones al pie de la letra. **No inventes campos extra, no agregues librerías innecesarias y no agregues sección de login.**

---

### 1. Reglas de Ingeniería y Legibilidad Humana
1. **Stack exacto**:
   - **Next.js 15+** (App Router, `src/` directory, TypeScript estricto).
   - **Tailwind CSS** para estilos con variables semánticas del sistema de diseño.
   - **`next/font/google`** cargando `Playfair_Display` (títulos editoriales/dramáticos) y `Plus_Jakarta_Sans` (cuerpo, grillas, horarios y etiquetas).
   - **`lucide-react`** para iconografía limpia y liviana.
   - **`gray-matter`** para leer archivos Markdown (`.md`) con YAML frontmatter en la Etapa 1°.
   - **`nodemailer`** únicamente para el Route Handler local de formulario de contacto en Etapa 1° (en Etapa 3° el envío lo delega al BFF).
2. **Código autoexplicativo**:
   - Nombres de archivos, funciones, props y tipos en español de dominio claro o inglés técnico consistente, con comentarios JSDoc breves explicando el *porqué* de cada módulo.
   - Componentes pequeños (< 180 líneas), un componente principal por archivo, sin lógica de negocio mezclada con JSX complejo.
   - Zona horaria de referencia para filtros de fechas ("Hoy", "Fin de Semana", "Calendario"): `America/Argentina/Cordoba`.
3. **Arquitectura por Etapas (Patrón Adaptador de Contenido)**:
   - Toda lectura de datos de las páginas pasa por una única interfaz `ContentRepository` en `src/services/content/content.types.ts`.
   - **Etapa 1° (`NEXT_PUBLIC_DATA_SOURCE=markdown`, valor por defecto)**: Usa `MarkdownContentRepository` (`src/services/content/markdown.repository.ts`), que lee todos los textos y listas desde la carpeta `/content/**/*.md` y las imágenes desde `/public/images/...` con nombres específicos.
   - **Etapa 3° (`NEXT_PUBLIC_DATA_SOURCE=bff`)**: Usa `BffContentRepository` (`src/services/content/bff.repository.ts`), que consume `NEXT_PUBLIC_BFF_URL` (`/api/public/...`) devolviendo exactamente los mismos tipos TypeScript. Las páginas y componentes UI no cambian ni una línea entre Etapa 1° y Etapa 3°.

---

### 2. Sistema de Diseño Visual (Fiel al diseño Stitch "Baobabs Teatro Web Platform")

Configurá Tailwind con estética **Teatral Nocturna & Editorial Neón** (modo oscuro permanente `class="dark"`):

- **Paleta de Colores**:
  - `surface` / `background` / `surface-dim`: `#101419` (fondo principal nocturno de sala).
  - `surface-container-lowest`: `#0a0e13` (cinta superior, footer y fondos hundidos).
  - `surface-container-low`: `#181c21` (barras de filtros sticky y secciones alternas).
  - `surface-container`: `#1c2025` (tarjetas de obras, talleres, contenedores y formularios).
  - `surface-container-high`: `#262a30` (tarjetas destacadas, banners, estados activos).
  - `surface-container-highest`: `#31353b` (bordes sutiles, chips secundarios y divisores).
  - `on-surface`: `#e0e2ea` (texto principal).
  - `on-surface-variant`: `#94a3b8` (texto secundario y metadatos).
  - `primary` (Cyan Escénico): `#22d3ee` (texto sobre primario: `#00363e` o `#020617`, sombra sutil `0 0 18px rgba(34,211,238,0.35)`).
  - `teal-accent`: `#2dd4bf` (horarios, indicadores de ubicación y subtítulos).
  - `secondary` (Rosa/Magenta): `#f472b6` / `#f9a8d4` (etiquetas curatoriales y acentos).
  - `tertiary` (Violeta Jam): `#a855f7` / `#c084fc` (identidad visual de Jam Escénica y badges especiales).
- **Tipografía**:
  - `font-serif` (`Playfair Display`): Títulos de obras, encabezados de sección (`56px` hero desktop / `36px` mobile; `40px` h2; `28px` h3; `22px` subtítulos editoriales, permitiendo cursivas en palabras destacadas en `#22d3ee`).
  - `font-sans` (`Plus Jakarta Sans`): Cuerpo (`15px`/`24px`), horarios (`16px` bold), metadatos (`12px` medium) y `label-caps` (`11px` bold uppercase con `tracking-[0.12em]`).
- **Grilla y Forma**:
  - Contenedor máximo `max-w-[1360px] mx-auto px-5 md:px-12`, grilla de 12 columnas con `gap-6`.
  - Pósters de obras siempre en proporción vertical `aspect-[2/3]` con degradado oscuro inferior y bordes `rounded-xl` con borde fino `border-cyan-500/20`.

---

### 3. Reglas Globales de Navegación (MUY IMPORTANTE)

1. **PROHIBIDO incluir sección o botón de Login**:
   - No renderices ícono de usuario/perfil en el Header ni rutas `/login`.
2. **Todo botón de "Reservar" o "Inscribirme" lleva al Formulario de Contacto**:
   - No abras modales ni drawers de compra/reserva.
   - Todo botón o enlace de *"Inscribirme / Reservar"*, *"Reservar"*, *"Reservar Entradas"*, *"Reservar Butaca"*, *"Sumarme"*, *"Inscribirme"*, *"Probar mi primera clase"*, *"Probar clases"* o *"Preinscripción Online"* debe navegar a `/contacto` haciendo foco en `#formulario` y pasando query params opcionales para preseleccionar el asunto y precargar contexto en el mensaje:
     - Ejemplo obra: `/contacto?asunto=reserva-obras&item=El+Jardin+de+los+Poetas#formulario`
     - Ejemplo taller: `/contacto?asunto=talleres&item=Taller+de+Teatro+Inicial#formulario`
3. **Header Desktop (`>= 1024px`) y Navegación Mobile (`< 1024px`)**:
   - **Desktop (`h-20` sticky top con `backdrop-blur-xl`)**:
     - Izquierda: Logo `/images/logo/logo-baobabs.png` + texto `BAOBABS` / `Club de Teatro` (link a `/`).
     - Centro: Links a `Cartelera` (`/`), `Talleres y Clases` (`/talleres`), `Calendario` (`/calendario`), `Jam Escénica` (`/?filtro=jam#cartelera`), `Contacto` (`/contacto`).
     - Derecha: Link telefónico con ícono de chat que abre WhatsApp (`https://wa.me/<whatsappNumero>`) + Botón primario cyan `Inscribirme / Reservar` que lleva a `/contacto#formulario`.
   - **Mobile**: Header compacto superior (`h-16`) con logo y botón rápido a WhatsApp + Barra inferior fija de 4 pestañas (`Cartelera`, `Talleres`, `Calendario`, `Contacto`).

---

### 4. Contratos de Datos Exactos (`src/services/content/content.types.ts`)

Usá exactamente estas interfaces (coinciden 1:1 con el BFF en NestJS y con los archivos `.md`):

```ts
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
```

---

### 5. Especificación Detallada de Pantallas y Secciones

#### A. Página de Inicio / Cartelera (`src/app/page.tsx` — Ruta `/`)
1. **Cinta Editorial Superior**: Muestra `cintaSuperiorTemporada` (si existe), sede (`ContactoConfig.sedeNombre` · `sedeDireccion`) y `FooterConfig.horarioBoleteria`.
2. **Hero de Obra Destacada (Split 12 columnas: 5 póster + 7 ficha)**:
   - Muestra la obra con `esDestacada: true` (o la próxima en fecha).
   - Columna izquierda (5 cols): Imagen póster con overlay oscuro, badge de próxima fecha (`DIA / NUM / MES`), `subtitulo`, `titulo` en `Playfair Display` y `espacioEscenico`.
   - Columna derecha (7 cols):
     - Si `duracion` está presente, chip `"Duración: <duracion>"`; si es `esJam`, chip violeta `"Jam Escénica"`.
     - `descripcionBreve` como subtítulo destacado y `descripcion` completa (si `esJam === true` y `descripcion` está vacía, mostrar `JamConfig.descripcionPorDefecto`).
     - **Ficha Artística en grilla**: `Dirección General`, `Elenco & Voces`, `Espacio Escénico`, `Producción`, y lista de `Fechas y Horarios` (`funciones`).
     - Barra inferior del Hero: `Precio` formateado en ARS (ej. `$4.500`), próxima hora, botón primario **`Reservar Entradas`** (lleva a `/contacto?asunto=reserva-obras&item=<titulo>#formulario`) y botón secundario `Ver Cartelera` (scroll suave a `#cartelera`).
3. **Barra Sticky de Filtros de Inicio (`#cartelera`)**:
   - Debe permitir filtrar exactamente por estas **5 pestañas**:
     1. **`Obras de Sala`**: Muestra todas las obras disponibles.
     2. **`Hoy`**: Filtra obras que tengan al menos una función cuya `fecha` sea exactamente la fecha actual del día presente (`America/Argentina/Cordoba`).
     3. **`Fin de Semana`**: Filtra obras que tengan al menos una función en el viernes, sábado o domingo de la semana actual.
     4. **`Talleres y Clases`**: Muestra en la grilla las tarjetas de los talleres con `estado === 'VIGENTE'`.
     5. **`Jam Escénica`**: Filtra las obras que tengan `esJam === true`.
   - Soportar también lectura inicial desde query param `?filtro=jam`.
4. **Grilla de Cards**:
   - **Card de Obra** (4 columnas en desktop, 2 en tablet, 1 en mobile): Póster `aspect-[2/3]`, badge de próxima fecha arriba a la izquierda, badge `"Jam Escénica"` en violeta si `esJam`, `subtitulo`, `titulo`, `descripcionBreve`, lista resumida de `fechas y horas`, `espacioEscenico`, `precio`, botón para expandir/ver ficha completa (modal o ruta `/obras/[slug]` mostrando toda la ficha técnica y todas sus fechas) y botón **`Reservar`** que lleva a `/contacto?asunto=reserva-obras&item=<titulo>#formulario`.
   - **Card de Taller** (cuando el filtro activo es `Talleres y Clases`): Muestra `nombre`, `nivel` (si existe), `docentes`, `dias y horarios` (indicando si es semanal o semana de por medio), `descripcion`, `precioPorMes` y botón **`Inscribirme`** que lleva a `/contacto?asunto=talleres&item=<nombre>#formulario`.
5. **Banner Publicitario (el que en Stitch dice "Hacer Teatro Hace Bien")**:
   - Layout asimétrico de 12 columnas (5 cols foto inclinada sutilmente `rotate-[-1.5deg] hover:rotate-0` + 7 cols contenido).
   - Renderiza `foto`, `titulo`, `subtitulo` (en cursiva cyan) y `descripcion` desde `BannerPublicitario`.
   - **Modificaciones obligatorias respecto a Stitch**:
     - **NO incluir** el bloque que decía *"Primera clase libre"*.
     - Donde decía *"Horarios flexibles"*, dejar únicamente el texto **`"Horarios"`** y convertirlo en un **link clickeable a `/talleres`** (pestaña Talleres y Clases).
     - El botón principal debe decir **`"Probar mi primera clase"`** y ser un **link a `/contacto#formulario`** (pestaña de Contacto).

#### B. Página de Talleres y Clases (`src/app/talleres/page.tsx` — Ruta `/talleres`)
1. **Cinta Superior**: Muestra `etiquetaSuperior` (si existe) y a la derecha el enlace **`"Preinscripción Online →"`**, el cual **debe llevar a `/contacto#formulario`**.
2. **Hero Banner de Talleres (100% editable desde `BannerTalleres`)**:
   - Columna izquierda (7 cols): `subtitulo`, `titulo`, `descripcion`, `badges` (si existen) y **2 botones**:
     - Botón primario: **`"Grilla Semanal"`** (o `"Explorar Grilla Semanal"`) → **debe navegar a `/calendario`**.
     - Botón secundario: **`"Probar clases"`** (texto exacto) → **debe navegar a `/contacto?asunto=talleres#formulario`**.
   - Columna derecha (5 cols): `foto` con tarjeta flotante inferior si `sedeTarjetaTitulo` o `sedeTarjetaSubtitulo` están definidos.
3. **Filtro por Día de Cursado**:
   - Botones `Todos`, `Lunes`, `Martes`, `Miércoles`, `Jueves`, `Viernes`, `Sábado`, `Domingo` (mostrando los días que tengan talleres vigentes).
4. **Listado Agrupado por Día de Talleres Vigentes (`estado === 'VIGENTE'`)**:
   - Cada tarjeta de taller muestra:
     - `nivel` (solo si está definido, ya que es opcional), chips de `horarios` (`horaInicio a horaFin hs`) y chip de frecuencia (`"Todas las semanas"` si es `SEMANAL`, o `"Semana de por medio"` si es `QUINCENAL`).
     - `nombre`, `docentes` y `descripcion`.
     - `precioPorMes` formateado (`$XX.XXX / mes`).
     - Botón primario **`"Inscribirme"`** → lleva a `/contacto?asunto=talleres&item=<nombre>#formulario`.
     - Botón ícono de chat secundario → abre WhatsApp al `telefonoContacto` específico de ese taller (`https://wa.me/<telefonoContacto>`).
   - **Nota**: No incluir formulario de preinscripción duplicado al pie; todo llamado a inscripción redirige a `/contacto#formulario`.

#### C. Página de Calendario (`src/app/calendario/page.tsx` — Ruta `/calendario`)
1. **Controles y Filtros Superiores**:
   - **Navegador de Mes**: Botón mes anterior, etiqueta `Mes Año` con contador dinámico de funciones y jams del mes, botón mes siguiente.
   - **Selector de Vistas funcional**: `Vista Mes` (grilla mensual de 7 columnas Lun–Dom), `Semana` (vista enfocada en los 7 días de la semana seleccionada) y `Listado` (lista cronológica estilo Alternativa Teatral).
   - **Filtro de Disciplinas (REGLA ESTRICTA)**: En disciplinas **ÚNICAMENTE** deben existir dos botones:
     1. **`Todas`** (muestra funciones de obras, jams y clases de talleres vigentes).
     2. **`Jam Escénica`** (muestra únicamente las funciones de obras con `esJam === true`).
2. **Lógica de Proyección de Eventos en el Calendario**:
   - **Obras y Jams**: Se ubican en cada `fecha` y `hora` de su lista `funciones`.
   - **Talleres y Clases**:
     - Si `taller.estado === 'EN_RECESO'`, **NO se muestra en el calendario bajo ninguna circunstancia**.
     - Si `taller.estado === 'VIGENTE'` y `frecuencia === 'SEMANAL'`, aparece todas las semanas en los `diaSemana` de sus `horarios` (cuando el filtro disciplina es `Todas`).
     - Si `taller.estado === 'VIGENTE'` y `frecuencia === 'QUINCENAL'`, calcular semanas pares desde `fechaReferencia` (`Math.floor(diffSemanas) % 2 === 0`) para mostrarlo únicamente semana de por medio.
3. **Panel Lateral / Detalle del Día Seleccionado y Grilla Cronológica**:
   - Al hacer click en un día del calendario, filtra/resalta los eventos de ese día.
   - **Todo botón de `"Reservar"`, `"Reservar Butaca"` o `"Consultar"`** lleva directamente a `/contacto` con el asunto preseleccionado (`reserva-obras` o `talleres`) — **sin drawer lateral de reserva**.

#### D. Página de Contacto, Sala Propia y Preguntas Frecuentes (`src/app/contacto/page.tsx` — Ruta `/contacto`)
1. **Encabezado y Barra de Accesos Rápidos (editables desde `ContactoConfig`)**:
   - 4 tarjetas:
     1. **WhatsApp**: muestra `whatsappVisible` y abre `https://wa.me/<whatsappNumero>`.
     2. **Instagram**: muestra `instagramUsuario` y abre `instagramUrl`.
     3. **Sede Teatral**: muestra `sedeNombre` y `sedeDireccion`.
     4. **Dirección Artística**: muestra `direccionArtisticaNombre` / `direccionArtisticaHandle` y abre `direccionArtisticaUrl`.
2. **Formulario de Contacto (`id="formulario"`)**:
   - **Selector de Asunto / Motivo** (4 botones tipo tarjeta seleccionables, preseleccionables vía query param `?asunto=`):
     - `Talleres y Clases` (`talleres`)
     - `Reserva de Obras` (`reserva-obras`)
     - `Alquiler / Ensayos` (`alquiler`)
     - `Dirección Artística` (`direccion-artistica`)
   - **Campos**: Nombre completo (`nombre`, obligatorio), Teléfono / WhatsApp (`telefono`, obligatorio), Correo electrónico (`email`, obligatorio), Nivel de experiencia / Perfil (`experiencia`, select opcional), Mensaje (`mensaje`, obligatorio; si viene `?item=...` en la URL, precargar un texto amigable editable mencionando ese taller u obra).
   - **Envío de Mail**:
     - En **Etapa 1° (modo Markdown)**: Envía `POST /api/contact` (Route Handler interno de Next.js) que lee `emailDestinoFormulario` desde `content/config/contacto.md` y envía el correo vía SMTP (`nodemailer`) con el asunto `[Baobabs Web - <Asunto Seleccionado>] Consulta de <nombre>`.
     - En **Etapa 3° (modo BFF)**: Envía `POST ${NEXT_PUBLIC_BFF_URL}/api/public/contact` con `{ asunto, nombre, telefono, email, experiencia, mensaje }`, donde el BFF envía el correo al `emailDestinoFormulario` configurado en su base de datos (y también expuesto en `ContactoConfig`).
   - Mostrar estados claros de `Enviando...`, confirmación exitosa y manejo de errores legible.
3. **Sección "El Escenario · Sala Propia" (100% alimentada por `SalaPropiaConfig`, TODOS los campos opcionales)**:
   - Renderizado defensivo: cada campo, métrica (`butacas`, `dimensionesEscenario`, `climatizacion`), tarjeta de acceso (`colectivos`, `estacionamiento`, `poloGastronomico`), foto (`foto1Url`, `foto2Url`) e ítem de ficha técnica (`parrillaLuminica`, `acusticaYSonido`, `comodidades`, `disposicionGradas`) se renderiza **solo si tiene valor**. Si ningún campo de la sala está cargado, la sección completa no se renderiza.
   - **Botón `"Cómo llegar"`**: Si existe `googleMapsUrl`, renderiza el enlace que abre **Google Maps** en nueva pestaña (`target="_blank" rel="noopener noreferrer"`).
   - **Bloque `"¿Buscás sala?"`** (`buscasSalaTitulo`): Su botón (`buscasSalaTextoBoton` o `"Consultar por WhatsApp"`) debe abrir **directamente WhatsApp** (`https://wa.me/<ContactoConfig.whatsappNumero>?text=<encodeURIComponent(buscasSalaMensajeWsp)>`).
4. **Sección "Preguntas Frecuentes" (Acordeón interactivo alimentado por `FaqItem[]`)**:
   - Renderiza todas las preguntas ordenadas por `orden`, permitiendo abrir/cerrar cada respuesta suavemente.

#### E. Footer Global (`src/components/layout/Footer.tsx`)
- Todos sus textos provienen de `FooterConfig` (100% modificable desde `.md` en Etapa 1° y desde CRM/BFF en Etapa 3°).
- **REGLA OBLIGATORIA**: Al hacer click en el número de teléfono del footer (`telefonoVisible`), debe ser un enlace `<a>` que lleve **directamente a WhatsApp** (`https://wa.me/<telefonoWhatsappNumero>`).
- El enlace CTA del footer (`ctaTexto`) lleva a `/contacto#formulario`.

---

### 6. Estructura de Archivos `.md` e Imágenes para la Etapa 1°

Creá la carpeta `/content` y `/public/images` con datos iniciales reales de Baobabs listos para funcionar:

```text
baobabs-frontend/
├─ content/
│  ├─ obras/
│  │  ├─ el-jardin-de-los-poetas-despedidos.md
│  │  ├─ las-herramientas-de-las-hadas.md
│  │  ├─ partes-de-mi.md
│  │  └─ jam-escenica-baobabs.md          # Con esJam: true
│  ├─ talleres/
│  │  ├─ taller-teatro-inicial.md         # frecuencia: SEMANAL, estado: VIGENTE
│  │  ├─ el-viaje-del-clown.md            # frecuencia: SEMANAL, estado: VIGENTE
│  │  ├─ entrenamiento-e-impro.md         # frecuencia: QUINCENAL, estado: VIGENTE
│  │  └─ taller-verano-ejemplo.md         # estado: EN_RECESO (para probar que no sale en calendario)
│  ├─ banners/
│  │  ├─ publicitario.md                  # Banner "Hacer Teatro Hace Bien"
│  │  └─ talleres.md                      # Banner de la pestaña Talleres y Clases
│  ├─ config/
│  │  ├─ jam.md                           # descripcionPorDefecto para obras con esJam: true
│  │  ├─ contacto.md                      # WhatsApp, Instagram, Sede, Dirección Artística, emailDestinoFormulario
│  │  ├─ sala-propia.md                   # Parámetros opcionales de El Escenario · Sala Propia
│  │  └─ footer.md                        # Todos los textos y links del Footer
│  └─ faqs/
│     └─ preguntas-frecuentes.md          # Lista YAML de { id, orden, pregunta, respuesta }
├─ public/
│  └─ images/
│     ├─ logo/
│     │  └─ logo-baobabs.svg              # Placeholder SVG limpio reemplazable por PNG/SVG con el mismo nombre
│     ├─ banners/
│     │  ├─ banner-publicitario.jpg       # (Generar SVG/imagen placeholder local con ese nombre exacto Documentado)
│     │  └─ banner-talleres.jpg
│     ├─ obras/
│     │  ├─ el-jardin-de-los-poetas-despedidos.jpg
│     │  ├─ las-herramientas-de-las-hadas.jpg
│     │  ├─ partes-de-mi.jpg
│     │  └─ jam-escenica-baobabs.jpg
│     └─ sala/
│        ├─ sala-1.jpg
│        └─ sala-2.jpg
└─ src/
   ├─ app/
   │  ├─ layout.tsx
   │  ├─ page.tsx
   │  ├─ obras/[slug]/page.tsx
   │  ├─ talleres/page.tsx
   │  ├─ calendario/page.tsx
   │  ├─ contacto/page.tsx
   │  └─ api/contact/route.ts
   ├─ components/
   │  ├─ layout/ (Header.tsx, MobileBottomNav.tsx, Footer.tsx)
   │  ├─ home/ (HeroObraDestacada.tsx, HomeFilterableGrid.tsx, ObraCard.tsx, BannerPublicitarioSection.tsx)
   │  ├─ talleres/ (TalleresHeroBanner.tsx, TalleresFilterableList.tsx, TallerCard.tsx)
   │  ├─ calendario/ (CalendarioWorkspace.tsx)
   │  └─ contacto/ (CanalesDirectosBar.tsx, ContactForm.tsx, SalaPropiaSection.tsx, FaqAccordion.tsx)
   ├─ lib/
   │  ├─ dates.ts                         # Funciones puras para Hoy, Fin de Semana y cálculo quincenal en America/Argentina/Cordoba
   │  └─ whatsapp.ts                      # Generador seguro de links https://wa.me/
   └─ services/
      └─ content/
         ├─ content.types.ts
         ├─ markdown.repository.ts        # Etapa 1°
         ├─ bff.repository.ts             # Etapa 3°
         └─ index.ts                      # Selector según NEXT_PUBLIC_DATA_SOURCE
```

---

### 7. Endpoints del BFF que consumirá `bff.repository.ts` en la Etapa 3°

Dejá implementado `BffContentRepository` apuntando a `process.env.NEXT_PUBLIC_BFF_URL` (default `http://localhost:4000`) con `fetch(..., { cache: 'no-store' })` (o ISR configurable):
- `GET /api/public/obras` → `Obra[]` (ya resuelve `descripcionPorDefecto` si `esJam === true`)
- `GET /api/public/obras/:slug` → `Obra`
- `GET /api/public/talleres` → `Taller[]`
- `GET /api/public/site-config` → `{ jam: JamConfig, bannerPublicitario: BannerPublicitario, bannerTalleres: BannerTalleres, contacto: ContactoConfig, salaPropia: SalaPropiaConfig, footer: FooterConfig, faqs: FaqItem[] }`
- `POST /api/public/contact` → `{ asunto, nombre, telefono, email, experiencia, mensaje }`

Variables en `.env.example`:
```env
# "markdown" para Etapa 1° | "bff" para Etapa 3°
NEXT_PUBLIC_DATA_SOURCE=markdown
NEXT_PUBLIC_BFF_URL=http://localhost:4000

# Solo requerido en Etapa 1° si se desea envío SMTP directo sin BFF
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
SMTP_FROM="Baobabs Web <no-reply@baobabsteatro.com.ar>"
```

---

### 8. Documentación Obligatoria en `README.md`

Generá un `README.md` exhaustivo, didáctico y escrito para seres humanos (tanto desarrolladores como integrantes del teatro), que cubra obligatoriamente:
1. **Qué hace este proyecto y cómo funciona**: Explicación clara de las páginas, reglas de negocio y la transición entre **Etapa 1° (Archivos `.md`)** y **Etapa 3° (Conexión al BFF)** cambiando una sola variable de entorno.
2. **Cómo levantar el proyecto localmente paso a paso**: Requisitos (Node.js LTS), instalación, configuración de `.env`, comando `npm run dev` y `npm run build`.
3. **Mapa del repositorio para estudiarlo y entenderlo**: Qué hace cada carpeta (`content/`, `public/images/`, `src/services/content/`, `src/lib/dates.ts`, `src/components/`) y cómo fluyen los datos desde el origen hasta la pantalla.
4. **Manual práctico de edición en Etapa 1° (Añadir, Modificar y Borrar sin tocar código)**:
   - Cómo añadir una nueva Obra creando un `.md` en `content/obras/` (con plantilla completa copiables de ejemplo y explicación de múltiples fechas/horas y `esJam`).
   - Cómo borrar o editar una Obra.
   - Cómo añadir, editar, poner `EN_RECESO` o configurar como `QUINCENAL` (semana de por medio) un Taller en `content/talleres/`.
   - Cómo cambiar los textos y fotos del Banner Publicitario, Banner de Talleres, Contacto, Sala Propia (explicando que cualquier parámetro vacío se oculta solo), Preguntas Frecuentes y Footer.
   - **Tabla exacta de nombres específicos de imágenes** en `public/images/...` para reemplazar fotos subiéndolas al repositorio.
5. **Guía para desarrolladores (Cómo modificar código y arreglar errores comunes / Troubleshooting)**:
   - Dónde tocar si se quiere agregar un campo nuevo o una vista nueva.
   - Solución a errores frecuentes (formato de fechas YAML `YYYY-MM-DD`, imágenes faltantes, CORS al pasar a Etapa 3° con el BFF, zona horaria).
