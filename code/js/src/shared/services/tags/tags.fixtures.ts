import { slugify } from '@/shared/utils/format';

import type { Tag } from './tags.types';

const NAMES = [
    'Lisboa',
    'Reportagem',
    'Ciência',
    'Política',
    'Sociedade',
    'Desporto',
    'Cultura',
    'Internacional',
    'Fotografia',
    'Podcast',
    'Vídeo',
];

export const mockTags: Tag[] = NAMES.map((name, i) => ({
    id: i + 1,
    name,
    description: `Conteúdos com a tag ${name}.`,
    slug: slugify(name),
    quantity: 0,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    archivedAt: null,
}));

export type TagRef = { id: number; name: string; slug: string };

export const tagRef = (name: string): TagRef => {
    const tag = mockTags.find((t) => t.name === name) ?? mockTags[0];
    return { id: tag.id, name: tag.name, slug: tag.slug };
};
