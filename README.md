# Baobabs Club de Teatro · Frontend Web

Sitio web oficial y plataforma pública de difusión cultural para **Baobabs Club de Teatro** (Córdoba, Argentina). Desarrollado con **Next.js 16+ (App Router)**, **TypeScript estricto** y **Tailwind CSS v4** bajo una estética teatral nocturna, dramática y editorial neón.

---

## 1. Qué hace este proyecto y cómo funciona

Este frontend presenta la programación en vivo de Baobabs Club de Teatro, facilitando el acceso a la cartelera, la reserva de entradas, la inscripción a talleres y la consulta sobre el alquiler de la sala independiente.

### Páginas Principales
- **Cartelera e Inicio (`/`)**: 
  - Cinta superior con temporada y horarios.
  - Hero teatral con la obra destacada, ficha artística completa y próxima función.
  - Barra sticky con 5 filtros dinámicos (`Obras de Sala`, `Hoy`, `Fin de Semana`, `Talleres y Clases` y `Jam Escénica`).
  - Grilla interactiva de pósters en proporción vertical `2:3`.
  - Banner publicitario asimétrico *"Hacer Teatro Hace Bien"*.
- **Ficha de Obra (`/obras/[slug]`)**: Página con la ficha técnica completa de la obra, galería, elenco, dirección, duración y todas sus fechas y horas programadas.
- **Talleres y Clases (`/talleres`)**: 
  - Banner con acceso a la grilla y clase de prueba.
  - Filtro por día de cursado (`Lunes` a `Domingo`).
  - Tarjetas de talleres vigentes con docentes, horarios, cuota mensual, botón de inscripción directa y chat de WhatsApp específico.
- **Calendario Unificado (`/calendario`)**: 
  - Vistas funcionales: **Mes** (grilla de 7 columnas Lun–Dom), **Semana** y **Listado** cronológico estilo cartelera teatral.
  - Navegador dinámico de mes con conteo de funciones y jams.
  - Filtro estricto de disciplinas: **`Todas`** y **`Jam Escénica`**.
  - Proyección automática de obras y de talleres regulares (semanales y quincenales). Los talleres en receso no se muestran.
  - Panel lateral de detalle por día con reserva directa.
- **Contacto, Sala Propia y Boletería (`/contacto`)**: 
  - 4 accesos directos (WhatsApp, Instagram, Sede, Dirección Artística).
  - Formulario de contacto con 4 motivos seleccionables (`talleres`, `reserva-obras`, `alquiler`, `direccion-artistica`) y precarga automática de contexto vía URL (`?asunto=...&item=...#formulario`).
  - Sección *"El Escenario · Sala Propia"* con renderizado defensivo (muestra únicamente los campos técnicos cargados), botón "Cómo llegar" a Google Maps y consulta de disponibilidad por WhatsApp.
  - Acordeón interactivo de Preguntas Frecuentes.

### Reglas Clave de Negocio
1. **Sin sección de Login**: El sitio está 100% orientado al espectador y al alumno. No existen botones ni rutas de login.
2. **Centralización de Reservas**: Todo botón de *"Reservar"*, *"Inscribirme"* o *"Probar clase"* navega a `/contacto#formulario`, precargando el asunto y el nombre de la obra o taller correspondiente.
3. **Zona Horaria Oficial**: Todas las comparaciones de fechas para "Hoy" y "Fin de Semana" se calculan en base a `America/Argentina/Cordoba`.

### Arquitectura de Adaptador: Transición Transparente (Etapa 1° ⇄ Etapa 3°)
Toda la interfaz UI consume una única interfaz TypeScript: `ContentRepository` (`src/services/content/content.types.ts`).
- **Etapa 1° (`NEXT_PUBLIC_DATA_SOURCE=markdown`)**: El sitio funciona de manera 100% autónoma leyendo archivos `.md` locales desde la carpeta `/content/` y fotos desde `/public/images/`.
- **Etapa 3° (`NEXT_PUBLIC_DATA_SOURCE=bff`)**: Al encender el BFF (Backend for Frontend en NestJS), se cambia esa única variable en `.env` y el sitio pasa a consumir la API REST (`/api/public/...`) sin modificar una sola línea de código en las páginas ni en los componentes.

---

## 2. Cómo levantar el proyecto localmente paso a paso

### Requisitos previos
- **Node.js**: Versión 20 LTS o superior (recomendado 22+).
- **npm** (o `pnpm` / `bun`).

### Instalación y Ejecución

1. **Clonar o ingresar al directorio del proyecto**:
   ```bash
   cd baobabs-frontend
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   Copia el archivo de ejemplo:
   ```bash
   cp .env.example .env.local
   ```
   El contenido por defecto está listo para funcionar en **Etapa 1°**:
   ```env
   NEXT_PUBLIC_DATA_SOURCE=markdown
   NEXT_PUBLIC_BFF_URL=http://localhost:4000

   # Configuración opcional para envío de correo local
   SMTP_HOST=localhost
   SMTP_PORT=1025
   SMTP_USER=
   SMTP_PASS=
   SMTP_FROM="Baobabs Web <no-reply@baobabsteatro.com.ar>"
   ```

4. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   Abrí tu navegador en [http://localhost:3000](http://localhost:3000).

5. **Compilar para producción (validación de tipos y optimización)**:
   ```bash
   npm run build
   npm run start
   ```

---

## 3. Mapa del Repositorio

```text
baobabs-frontend/
├── content/                    # Fuente de datos en Etapa 1° (Archivos Markdown con frontmatter)
│   ├── obras/                  # Obras de cartelera y Jam Escénica (.md)
│   ├── talleres/               # Talleres semanales, quincenales y en receso (.md)
│   ├── banners/                # Banner publicitario y de formación (.md)
│   ├── config/                 # Jam, contacto, sala propia y footer (.md)
│   └── faqs/                   # Preguntas frecuentes (.md)
├── public/
│   └── images/                 # Activos visuales organizados por sección
│       ├── logo/               # Identidad visual (logo-baobabs.svg, logo-baobabs.png)
│       ├── obras/              # Pósters verticales 2:3 (.jpg)
│       ├── banners/            # Banners panorámicos (.jpg)
│       └── sala/               # Fotografías de la sala (.jpg)
├── src/
│   ├── app/                    # Next.js App Router (Páginas y Route Handlers)
│   │   ├── layout.tsx          # Layout raíz (HTML, fuentes Google, Header, Footer)
│   │   ├── page.tsx            # Cartelera / Inicio
│   │   ├── talleres/page.tsx   # Página de Talleres y Clases
│   │   ├── calendario/page.tsx # Calendario mensual/semanal/listado
│   │   ├── contacto/page.tsx   # Canales, Formulario, Sala Propia y FAQs
│   │   ├── obras/[slug]/page.tsx # Vista individual de obra (SSG)
│   │   └── api/contact/route.ts# Route handler de despacho de correos (nodemailer)
│   ├── components/             # Componentes modulares de interfaz
│   │   ├── layout/             # Header, Footer, MobileBottomNav
│   │   ├── home/               # HeroObraDestacada, HomeFilterableGrid, ObraCard, Banner
│   │   ├── talleres/           # TalleresHeroBanner, TalleresFilterableList, TallerCard
│   │   ├── calendario/         # CalendarioWorkspace (vistas mes/semana/listado)
│   │   └── contacto/           # CanalesDirectosBar, ContactForm, SalaPropiaSection, FaqAccordion
│   ├── lib/                    # Lógica pura desacoplada
│   │   ├── dates.ts            # Filtros temporales en America/Argentina/Cordoba
│   │   └── whatsapp.ts         # Generador de enlaces seguros https://wa.me/
│   └── services/
│       └── content/            # Patrón Adaptador de Contenido
│           ├── content.types.ts# Interfaces TypeScript compartidas
│           ├── markdown.repository.ts # Adaptador Etapa 1° (gray-matter)
│           ├── bff.repository.ts      # Adaptador Etapa 3° (fetch HTTP al BFF)
│           └── index.ts        # Inyector de dependencias según NEXT_PUBLIC_DATA_SOURCE
└── scripts/
    ├── generate-placeholders.js# Generador de imágenes de muestra con sharp
    └── verify-stage-1.js       # Script de test de integridad de contenido
```

### Flujo de Datos
```
[ Archivos /content/*.md ]  ──(gray-matter)──>  [ MarkdownContentRepository ] ──┐
                                                                                 ├──> [ ContentRepository ] ──> [ Páginas & Componentes UI ]
[ BFF NestJS /api/public ]  ──(fetch JSON)──>   [ BffContentRepository ]      ──┘
```

---

## 4. Manual Práctico de Edición en Etapa 1° (Sin tocar código)

Cualquier persona del equipo del teatro puede actualizar el sitio editando los archivos de la carpeta `/content/` con cualquier editor de texto (como Notepad o VS Code).

### Cómo añadir una nueva Obra
Crea un archivo nuevo en `content/obras/<nombre-de-la-obra>.md` (ej. `content/obras/mi-nueva-obra.md`) con este formato:

```yaml
---
id: "mi-nueva-obra"
slug: "mi-nueva-obra"
imagen: "/images/obras/mi-nueva-obra.jpg"
titulo: "Nombre de la Obra"
subtitulo: "Género dramático o frase síntesis"
descripcionBreve: "Descripción atractiva de 1 o 2 líneas para la tarjeta de cartelera."
duracion: "65 min"
direccionGeneral: "Nombre del Director/a"
elencoYVoces: "Actores y actrices principales"
espacioEscenico: "Sala Principal Baobabs"
produccion: "Nombre de la Productora o Elenco"
precio: 5000
esJam: false
esDestacada: false
funciones:
  - fecha: "2026-11-14"
    hora: "21:30"
  - fecha: "2026-11-21"
    hora: "21:30"
---
Aquí va la sinopsis completa y la propuesta estética de la obra.
Podés escribir varios párrafos separados por líneas en blanco.
```

- **Múltiples funciones**: Agregá todos los días y horas que tenga la obra en la lista `funciones`.
- **Obra destacada**: Si ponés `esDestacada: true`, esta obra aparecerá en el Hero principal de la página de inicio.
- **Jam Escénica**: Si ponés `esJam: true`, recibirá el estilo visual violeta neón. Si dejás el cuerpo del texto vacío, adoptará automáticamente el texto descriptivo por defecto configurado en `content/config/jam.md`.

### Cómo borrar o editar una Obra
- **Editar**: Modificá cualquier campo del archivo `.md` y guardá.
- **Borrar**: Eliminá el archivo `.md` correspondiente de la carpeta `content/obras/`.

### Cómo gestionar Talleres
Los archivos se ubican en `content/talleres/<nombre-taller>.md`:
```yaml
---
id: "taller-actuacion"
slug: "taller-actuacion"
nombre: "Taller de Actuación y Presencia"
descripcion: "Contenido del taller, objetivos y dinámica pedagógica."
docentes: "Nombre de los Docentes"
precioPorMes: 18000
telefonoContacto: "5493516866684"
nivel: "Principiantes / Sin experiencia"
frecuencia: "SEMANAL"
estado: "VIGENTE"
horarios:
  - diaSemana: "MARTES"
    horaInicio: "19:00"
    horaFin: "21:30"
---
```
- **Frecuencia Quincenal**: Si el taller se dicta semana de por medio, configurá:
  ```yaml
  frecuencia: "QUINCENAL"
  fechaReferencia: "2026-01-05" # Fecha de inicio para calcular semanas pares
  ```
- **Pausar o Cerrar un Taller**: Cambiá el estado a:
  ```yaml
  estado: "EN_RECESO"
  ```
  Un taller en receso **nunca aparecerá en el calendario ni en la grilla de vigentes**.

### Cómo modificar Textos, Sala Propia y Preguntas Frecuentes
- **Banner Publicitario**: Editá `content/banners/publicitario.md`.
- **Banner de Talleres**: Editá `content/banners/talleres.md` (badges, textos y tarjeta de sede).
- **Contacto**: Editá `content/config/contacto.md` (WhatsApp, Instagram, dirección, correo receptor del formulario).
- **El Escenario · Sala Propia**: Editá `content/config/sala-propia.md`.
  > **Nota sobre Sala Propia:** Todos los campos son opcionales. Si un campo se deja vacío o se borra, el bloque correspondiente no se renderiza.
- **Footer**: Editá `content/config/footer.md`.
- **Preguntas Frecuentes**: Editá `content/faqs/preguntas-frecuentes.md` agregando o reordenando ítems con `{ id, orden, pregunta, respuesta }`.

### Tabla de Nombres Exactos de Imágenes (`/public/images/...`)

Para reemplazar cualquiera de las imágenes de muestra, subí tu archivo con este nombre exacto:

| Ruta del Archivo | Uso / Pantalla | Proporción Recomendada |
| :--- | :--- | :--- |
| `/images/logo/logo-baobabs.svg` o `.png` | Logo en Header, Footer y favicon | Cuadrado (`512x512`) con fondo transparente |
| `/images/obras/el-jardin-de-los-poetas-despedidos.jpg` | Póster de obra destacada | Vertical `2:3` (`800x1200 px`) |
| `/images/obras/las-herramientas-de-las-hadas.jpg` | Póster de obra | Vertical `2:3` (`800x1200 px`) |
| `/images/obras/partes-de-mi.jpg` | Póster de obra | Vertical `2:3` (`800x1200 px`) |
| `/images/obras/jam-escenica-baobabs.jpg` | Póster de Jam Escénica | Vertical `2:3` (`800x1200 px`) |
| `/images/banners/banner-publicitario.jpg` | Banner *"Hacer Teatro Hace Bien"* | Panorámica `16:10` (`1200x750 px`) |
| `/images/banners/banner-talleres.jpg` | Banner de la sección Talleres | Panorámica `4:3` (`1200x900 px`) |
| `/images/sala/sala-1.jpg` | Fotografía de la sala (gradas/escenario) | Panorámica `16:10` (`1200x800 px`) |
| `/images/sala/sala-2.jpg` | Fotografía del escenario / iluminación | Panorámica `16:10` (`1200x800 px`) |

---

## 5. Guía para Desarrolladores & Troubleshooting

### Dónde tocar para extender funcionalidades
- **Agregar un nuevo campo a las Obras o Talleres**:
  1. Actualizá el contrato TypeScript en `src/services/content/content.types.ts`.
  2. Mapealo en `src/services/content/markdown.repository.ts`.
  3. Mapealo en `src/services/content/bff.repository.ts` (para la Etapa 3°).
  4. Agregá el campo a los archivos `.md` correspondientes.
  5. Renderizalo en el componente UI (`HeroObraDestacada.tsx`, `ObraCard.tsx` o `TallerCard.tsx`).
- **Agregar una nueva vista o página**:
  Creá la carpeta dentro de `src/app/<nueva-ruta>/page.tsx` usando Server Components y consumiendo `contentRepository`.

### Solución a Errores Comunes (Troubleshooting)

1. **Formato de fechas YAML (`YYYY-MM-DD`)**:
   - En archivos Markdown, es muy recomendable escribir las fechas entre comillas: `fecha: "2026-11-14"`. Si se colocan sin comillas, los parsers de YAML pueden interpretarlas como objetos `Date` de JavaScript. La función `normalizeDateString()` en `src/lib/dates.ts` sanitiza automáticamente ambos casos.
2. **Imágenes que no cargan**:
   - Asegurate de que el archivo exista en `public/images/...` y que el nombre y extensión coincidan exactamente (respetando minúsculas).
3. **Filtros de "Hoy" y "Fin de Semana"**:
   - Recuerda que la fecha base de comparación es calculada en la zona horaria `America/Argentina/Cordoba`. Si estás probando desde otra parte del mundo o en un huso horario distinto, los cálculos de "Hoy" reflejan la hora local de Córdoba.
4. **Al conectar con el BFF en Etapa 3° (`NEXT_PUBLIC_DATA_SOURCE=bff`)**:
   - Asegurate de que el backend en NestJS tenga habilitado CORS para el origen de Next.js (`http://localhost:3000`).
   - Verificá que la variable `NEXT_PUBLIC_BFF_URL` apunte a la dirección correcta (por defecto `http://localhost:4000`).
5. **Verificación rápida de tipos y linter**:
   ```bash
   npx tsc --noEmit
   npm run lint
   ```
   Ambos comandos deben terminar con **0 errores**.
