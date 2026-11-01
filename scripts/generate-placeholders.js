const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicImagesDir = path.join(__dirname, '..', 'public', 'images');

// Asegurar directorios
['logo', 'banners', 'obras', 'sala'].forEach((dir) => {
  fs.mkdirSync(path.join(publicImagesDir, dir), { recursive: true });
});

function escapeXml(unsafe) {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function createPoster(filename, title, subtitle, tag, color1, color2, accent) {
  const width = 800;
  const height = 1200;
  const safeTitle = escapeXml(title);
  const safeSubtitle = escapeXml(subtitle);
  const safeTag = escapeXml(tag);

  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${color1}" />
        <stop offset="60%" stop-color="${color2}" />
        <stop offset="100%" stop-color="#070a0e" />
      </linearGradient>
      <radialGradient id="spotlight" cx="50%" cy="30%" r="60%">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.35" />
        <stop offset="70%" stop-color="${accent}" stop-opacity="0.05" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="overlay" x1="0%" y1="50%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0a0e13" stop-opacity="0" />
        <stop offset="100%" stop-color="#0a0e13" stop-opacity="0.95" />
      </linearGradient>
    </defs>

    <!-- Fondo y Luz de Escenario -->
    <rect width="${width}" height="${height}" fill="url(#bg)" />
    <circle cx="400" cy="380" r="420" fill="url(#spotlight)" />

    <!-- Elementos escénicos decorativos -->
    <g opacity="0.15" stroke="${accent}" stroke-width="1.5" fill="none">
      <circle cx="400" cy="380" r="300" />
      <circle cx="400" cy="380" r="200" stroke-dasharray="8 8" />
      <line x1="100" y1="100" x2="700" y2="100" />
      <line x1="400" y1="50" x2="400" y2="700" stroke-dasharray="4 6" />
      <!-- Silueta de Baobab / Escena -->
      <path d="M 380 650 Q 360 480 300 400 Q 380 430 400 320 Q 420 430 500 400 Q 440 480 420 650 Z" fill="${accent}" fill-opacity="0.2" />
    </g>

    <!-- Tag Superior -->
    <rect x="70" y="70" width="220" height="34" rx="17" fill="#181c21" stroke="${accent}" stroke-width="1.5" stroke-opacity="0.5" />
    <text x="180" y="92" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" letter-spacing="2" fill="${accent}" text-anchor="middle">${safeTag.toUpperCase()}</text>

    <!-- Overlay inferior para legibilidad -->
    <rect x="0" y="550" width="${width}" height="650" fill="url(#overlay)" />

    <!-- Textos Principales -->
    <text x="70" y="880" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="700" letter-spacing="3" fill="${accent}">BAOBABS TEATRO</text>
    <text x="70" y="940" font-family="'Playfair Display', serif" font-size="44" font-weight="700" fill="#ffffff" letter-spacing="-0.5">${safeTitle}</text>
    <text x="70" y="990" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" fill="#94a3b8" width="660">${safeSubtitle}</text>

    <!-- Borde de Póster Teatral -->
    <rect x="25" y="25" width="${width - 50}" height="${height - 50}" rx="20" fill="none" stroke="${accent}" stroke-opacity="0.25" stroke-width="2" />
  </svg>
  `;

  const destPath = path.join(publicImagesDir, 'obras', filename);
  await sharp(Buffer.from(svg))
    .jpeg({ quality: 90 })
    .toFile(destPath);
  console.log('Generado:', destPath);
}

async function createBanner(filename, tag, title, subtitle, color1, color2, accent) {
  const width = 1200;
  const height = 675;
  const safeTitle = escapeXml(title);
  const safeSubtitle = escapeXml(subtitle);
  const safeTag = escapeXml(tag);

  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${color1}" />
        <stop offset="50%" stop-color="${color2}" />
        <stop offset="100%" stop-color="#0a0e13" />
      </linearGradient>
      <radialGradient id="radial" cx="80%" cy="30%" r="70%">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="darken" x1="0%" y1="0%" x2="70%" y2="0%">
        <stop offset="0%" stop-color="#0a0e13" stop-opacity="0.9" />
        <stop offset="60%" stop-color="#0a0e13" stop-opacity="0.6" />
        <stop offset="100%" stop-color="#0a0e13" stop-opacity="0.2" />
      </linearGradient>
    </defs>

    <rect width="${width}" height="${height}" fill="url(#bg)" />
    <circle cx="950" cy="200" r="450" fill="url(#radial)" />
    <rect width="${width}" height="${height}" fill="url(#darken)" />

    <!-- Trama gráfica -->
    <g opacity="0.12" stroke="${accent}" stroke-width="1.5" fill="none">
      <circle cx="950" cy="300" r="280" />
      <circle cx="950" cy="300" r="180" stroke-dasharray="6 6" />
      <line x1="80" y1="560" x2="1120" y2="560" />
    </g>

    <!-- Textos -->
    <rect x="80" y="100" width="220" height="34" rx="17" fill="#181c21" stroke="${accent}" stroke-width="1.5" stroke-opacity="0.6" />
    <text x="190" y="122" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" letter-spacing="2" fill="${accent}" text-anchor="middle">${safeTag.toUpperCase()}</text>

    <text x="80" y="240" font-family="'Playfair Display', serif" font-size="52" font-weight="700" fill="#ffffff">${safeTitle}</text>
    <text x="80" y="310" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="400" fill="#94a3b8">${safeSubtitle}</text>
    <text x="80" y="370" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" fill="#e0e2ea" opacity="0.8">Baobabs Club de Teatro · Córdoba, Argentina</text>

    <!-- Marco fino -->
    <rect x="25" y="25" width="${width - 50}" height="${height - 50}" rx="16" fill="none" stroke="${accent}" stroke-opacity="0.2" stroke-width="2" />
  </svg>
  `;

  const destPath = path.join(publicImagesDir, 'banners', filename);
  await sharp(Buffer.from(svg))
    .jpeg({ quality: 90 })
    .toFile(destPath);
  console.log('Generado:', destPath);
}

async function createSalaPhoto(filename, title, subtitle, color1, color2, accent) {
  const width = 1200;
  const height = 800;
  const safeTitle = escapeXml(title);
  const safeSubtitle = escapeXml(subtitle);

  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${color1}" />
        <stop offset="60%" stop-color="${color2}" />
        <stop offset="100%" stop-color="#0a0e13" />
      </linearGradient>
      <radialGradient id="spot" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.35" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="floor" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#14181f" />
        <stop offset="100%" stop-color="#070a0e" />
      </linearGradient>
    </defs>

    <rect width="${width}" height="${height}" fill="url(#bg)" />

    <!-- Piso de madera de escenario -->
    <polygon points="0,520 1200,520 1200,800 0,800" fill="url(#floor)" />
    <!-- Líneas de entablonado -->
    <g opacity="0.18" stroke="#ffffff" stroke-width="1">
      <line x1="0" y1="580" x2="1200" y2="580" />
      <line x1="0" y1="650" x2="1200" y2="650" />
      <line x1="0" y1="730" x2="1200" y2="730" />
      <line x1="300" y1="520" x2="150" y2="800" />
      <line x1="600" y1="520" x2="600" y2="800" />
      <line x1="900" y1="520" x2="1050" y2="800" />
    </g>

    <!-- Cono de luz escénica -->
    <polygon points="600,0 350,620 850,620" fill="url(#spot)" />

    <!-- Gradas estilizadas al fondo -->
    <rect x="150" y="240" width="900" height="260" fill="#1c2025" opacity="0.5" rx="8" />
    <g opacity="0.25" stroke="${accent}" stroke-width="1.5">
      <rect x="200" y="270" width="800" height="40" rx="4" fill="none" />
      <rect x="200" y="330" width="800" height="40" rx="4" fill="none" />
      <rect x="200" y="390" width="800" height="40" rx="4" fill="none" />
      <rect x="200" y="450" width="800" height="40" rx="4" fill="none" />
    </g>

    <!-- Información inferior -->
    <rect x="60" y="680" width="460" height="80" rx="12" fill="#0a0e13" opacity="0.85" stroke="${accent}" stroke-width="1" stroke-opacity="0.4" />
    <text x="90" y="718" font-family="'Playfair Display', serif" font-size="22" font-weight="700" fill="#ffffff">${safeTitle}</text>
    <text x="90" y="744" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#94a3b8">${safeSubtitle}</text>

    <!-- Marco -->
    <rect x="25" y="25" width="${width - 50}" height="${height - 50}" rx="16" fill="none" stroke="${accent}" stroke-opacity="0.2" stroke-width="2" />
  </svg>
  `;

  const destPath = path.join(publicImagesDir, 'sala', filename);
  await sharp(Buffer.from(svg))
    .jpeg({ quality: 90 })
    .toFile(destPath);
  console.log('Generado:', destPath);
}

async function createLogos() {
  const width = 512;
  const height = 512;

  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#22d3ee" />
        <stop offset="100%" stop-color="#f472b6" />
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#101419" stop-opacity="0" />
      </radialGradient>
    </defs>

    <rect width="${width}" height="${height}" rx="96" fill="#101419" />
    <circle cx="256" cy="230" r="180" fill="url(#glow)" />

    <!-- Silueta estilizada de Baobab & Telón Teatral -->
    <g transform="translate(256, 210)">
      <!-- Tronco Baobab / Columna teatral -->
      <path d="M -30,120 Q -45,40 -20,-10 Q 0,-30 20,-10 Q 45,40 30,120 Z" fill="url(#logoGrad)" />
      <!-- Ramas / Arcos de proscenio -->
      <path d="M -20,-10 Q -90,-40 -120,-100 Q -60,-80 -10,-40" stroke="url(#logoGrad)" stroke-width="12" stroke-linecap="round" fill="none" />
      <path d="M 20,-10 Q 90,-40 120,-100 Q 60,-80 10,-40" stroke="url(#logoGrad)" stroke-width="12" stroke-linecap="round" fill="none" />
      <path d="M 0,-30 Q -40,-110 -50,-140 Q 0,-110 50,-140 Q 40,-110 0,-30" fill="url(#logoGrad)" opacity="0.9" />
      <!-- Acentos circulares lumínicos -->
      <circle cx="-120" cy="-100" r="8" fill="#22d3ee" />
      <circle cx="120" cy="-100" r="8" fill="#f472b6" />
      <circle cx="0" cy="-145" r="9" fill="#22d3ee" />
    </g>

    <!-- Tipografía del Logo -->
    <text x="256" y="395" font-family="'Playfair Display', serif" font-size="46" font-weight="800" letter-spacing="8" fill="#ffffff" text-anchor="middle">BAOBABS</text>
    <text x="256" y="435" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="700" letter-spacing="6" fill="#22d3ee" text-anchor="middle">CLUB DE TEATRO</text>
  </svg>
  `;

  const svgPath = path.join(publicImagesDir, 'logo', 'logo-baobabs.svg');
  fs.writeFileSync(svgPath, svg, 'utf-8');
  console.log('Generado:', svgPath);

  const pngPath = path.join(publicImagesDir, 'logo', 'logo-baobabs.png');
  await sharp(Buffer.from(svg))
    .png()
    .toFile(pngPath);
  console.log('Generado:', pngPath);
}

async function main() {
  console.log('Generando placeholders de imágenes con nombres exactos...');

  // 1. Logos
  await createLogos();

  // 2. Obras (aspect-[2/3] vertical)
  await createPoster(
    'el-jardin-de-los-poetas-despedidos.jpg',
    'El Jardín de los Poetas',
    'Dramaturgia contemporánea cordobesa',
    'Obra Destacada',
    '#112430',
    '#0e1a22',
    '#22d3ee'
  );

  await createPoster(
    'las-herramientas-de-las-hadas.jpg',
    'Las Herramientas de las Hadas',
    'Comedia negra y teatro físico',
    'Temporada 2026',
    '#251528',
    '#170e1a',
    '#f472b6'
  );

  await createPoster(
    'partes-de-mi.jpg',
    'Partes de Mí',
    'Biodrama visceral sobre la memoria',
    'Cartelera Oficial',
    '#14192b',
    '#0c101c',
    '#38bdf8'
  );

  await createPoster(
    'jam-escenica-baobabs.jpg',
    'Jam Escénica Baobabs',
    'Improvisación teatral & música en vivo',
    'Jam Escénica',
    '#231238',
    '#130a1f',
    '#c084fc'
  );

  // 3. Banners
  await createBanner(
    'banner-publicitario.jpg',
    'Comunidad Teatral',
    'Hacer Teatro Hace Bien.',
    'Vení a probar la primera clase sin compromiso.',
    '#152835',
    '#121e28',
    '#22d3ee'
  );

  await createBanner(
    'banner-talleres.jpg',
    'Formación Escénica',
    'Laboratorios y Clases Regulares',
    'Entrenar la presencia, el cuerpo y la voz escénica.',
    '#26193b',
    '#1a1228',
    '#f472b6'
  );

  // 4. Sala
  await createSalaPhoto(
    'sala-1.jpg',
    'Sala Principal Baobabs',
    'Disposición a la italiana con 75 butacas y climatización',
    '#121b24',
    '#0c1218',
    '#22d3ee'
  );

  await createSalaPhoto(
    'sala-2.jpg',
    'Espacio Escénico Polivalente',
    'Piso amortiguado para danza, teatro y performances',
    '#241525',
    '#140c15',
    '#f472b6'
  );

  console.log('¡Todos los placeholders de imágenes generados exitosamente!');
}

main().catch(console.error);
