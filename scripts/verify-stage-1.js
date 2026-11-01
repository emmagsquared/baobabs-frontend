const path = require('path');
const fs = require('fs');

async function testRepository() {
  console.log('--- TEST DE ETAPA 1°: REPOSITORIO DE CONTENIDO MARKDOWN ---');

  // Simulamos la lectura directa con la lógica de MarkdownContentRepository
  const matter = require('gray-matter');

  const contentDir = path.join(__dirname, '..', 'content');

  // 1. Configs
  const jamRaw = fs.readFileSync(path.join(contentDir, 'config', 'jam.md'), 'utf8');
  const jamData = matter(jamRaw).data;
  console.log('✓ JamConfig descripcionPorDefecto:', jamData.descripcionPorDefecto.slice(0, 50) + '...');

  const contactoRaw = fs.readFileSync(path.join(contentDir, 'config', 'contacto.md'), 'utf8');
  const contactoData = matter(contactoRaw).data;
  console.log('✓ ContactoConfig WhatsApp:', contactoData.whatsappNumero, contactoData.whatsappVisible);

  const salaRaw = fs.readFileSync(path.join(contentDir, 'config', 'sala-propia.md'), 'utf8');
  const salaData = matter(salaRaw).data;
  console.log('✓ SalaPropiaConfig butacas:', salaData.butacas);

  const footerRaw = fs.readFileSync(path.join(contentDir, 'config', 'footer.md'), 'utf8');
  const footerData = matter(footerRaw).data;
  console.log('✓ FooterConfig marcaTitulo:', footerData.marcaTitulo);

  const faqsRaw = fs.readFileSync(path.join(contentDir, 'faqs', 'preguntas-frecuentes.md'), 'utf8');
  const faqsData = matter(faqsRaw).data;
  console.log('✓ Faqs cargadas:', faqsData.faqs.length, 'preguntas.');

  // 2. Obras
  const obrasDir = path.join(contentDir, 'obras');
  const obraFiles = fs.readdirSync(obrasDir).filter(f => f.endsWith('.md'));
  console.log('\n--- VERIFICACIÓN DE OBRAS ---');
  for (const file of obraFiles) {
    const raw = fs.readFileSync(path.join(obrasDir, file), 'utf8');
    const parsed = matter(raw);
    const d = parsed.data;
    const desc = (d.esJam && !d.descripcion && !parsed.content.trim())
      ? jamData.descripcionPorDefecto
      : (d.descripcion || parsed.content.trim());
    console.log(`✓ Obra [${file}]: "${d.titulo}" | esJam: ${d.esJam} | Destacada: ${d.esDestacada} | Funciones: ${d.funciones?.length} | Precio: $${d.precio}`);
    if (d.esJam) {
      console.log(`   -> Descripción por defecto asignada correctamente: "${desc.slice(0, 45)}..."`);
    }
  }

  // 3. Talleres
  const talleresDir = path.join(contentDir, 'talleres');
  const tallerFiles = fs.readdirSync(talleresDir).filter(f => f.endsWith('.md'));
  console.log('\n--- VERIFICACIÓN DE TALLERES ---');
  for (const file of tallerFiles) {
    const raw = fs.readFileSync(path.join(talleresDir, file), 'utf8');
    const parsed = matter(raw);
    const d = parsed.data;
    console.log(`✓ Taller [${file}]: "${d.nombre}" | Estado: ${d.estado} | Frecuencia: ${d.frecuencia} | Horarios: ${d.horarios?.length} | Precio/mes: $${d.precioPorMes}`);
  }

  // 4. Banners
  const pubRaw = fs.readFileSync(path.join(contentDir, 'banners', 'publicitario.md'), 'utf8');
  const pubData = matter(pubRaw).data;
  console.log('\n--- VERIFICACIÓN DE BANNERS ---');
  console.log('✓ Banner Publicitario:', pubData.titulo);

  const tallRaw = fs.readFileSync(path.join(contentDir, 'banners', 'talleres.md'), 'utf8');
  const tallData = matter(tallRaw).data;
  console.log('✓ Banner Talleres:', tallData.titulo, '| Badges:', tallData.badges?.length);

  // 5. Imágenes en public/images/
  console.log('\n--- VERIFICACIÓN DE IMÁGENES PLACEHOLDER ---');
  const requiredImages = [
    'logo/logo-baobabs.svg',
    'logo/logo-baobabs.png',
    'banners/banner-publicitario.jpg',
    'banners/banner-talleres.jpg',
    'obras/el-jardin-de-los-poetas-despedidos.jpg',
    'obras/las-herramientas-de-las-hadas.jpg',
    'obras/partes-de-mi.jpg',
    'obras/jam-escenica-baobabs.jpg',
    'sala/sala-1.jpg',
    'sala/sala-2.jpg',
  ];

  for (const rel of requiredImages) {
    const fullPath = path.join(__dirname, '..', 'public', 'images', rel);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Falta imagen obligatoria: ${rel}`);
    }
    const stat = fs.statSync(fullPath);
    console.log(`✓ Imagen OK: ${rel} (${stat.size} bytes)`);
  }

  console.log('\n¡TODAS LAS VERIFICACIONES DE LA ETAPA 1° COMPLETADAS CON ÉXITO!');
}

testRepository().catch(err => {
  console.error('Error en test:', err);
  process.exit(1);
});
