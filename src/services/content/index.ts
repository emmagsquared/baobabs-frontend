import { ContentRepository } from './content.types';
import { MarkdownContentRepository } from './markdown.repository';
import { BffContentRepository } from './bff.repository';

export * from './content.types';
export { MarkdownContentRepository } from './markdown.repository';
export { BffContentRepository } from './bff.repository';

/**
 * Selector del Adaptador de Contenido según la variable de entorno NEXT_PUBLIC_DATA_SOURCE.
 * - 'markdown' (default): Etapa 1° - Lee archivos .md locales de /content/.
 * - 'bff': Etapa 3° - Consume la API REST del BFF en NestJS.
 */
function createContentRepository(): ContentRepository {
  const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE || 'markdown';

  if (dataSource === 'bff') {
    return new BffContentRepository();
  }

  return new MarkdownContentRepository();
}

/**
 * Instancia singleton exportada para consumo directo en páginas y Server Components.
 */
export const contentRepository: ContentRepository = createContentRepository();
