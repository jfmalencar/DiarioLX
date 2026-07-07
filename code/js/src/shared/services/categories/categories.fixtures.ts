import { slugify } from '@/shared/utils/format';

import type { Category } from './categories.types';

const SEED: { name: string; color: string }[] = [
    { name: 'Lisboa, Cidade Aberta', color: '#e63946' },
    { name: 'Cultura', color: '#9b5de5' },
    { name: 'Sociedade', color: '#457b9d' },
    { name: 'Política', color: '#2a9d8f' },
    { name: 'Desporto', color: '#f4a261' },
    { name: 'Ciência', color: '#e76f51' },
    { name: 'Internacional', color: '#264653' },
    { name: 'Economia', color: '#118ab2' },
    { name: 'Fotografia', color: '#555555' },
    { name: 'Podcasts', color: '#82ee64' },
    { name: 'Vídeos', color: '#d4e600' },
];

export const mockCategories: Category[] = SEED.map((seed, i) => ({
    id: i + 1,
    name: seed.name,
    description: `Notícias e conteúdos de ${seed.name}.`,
    color: seed.color,
    slug: slugify(seed.name),
    parentId: null,
    parentName: null,
    quantity: 0,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    archivedAt: null,
}));

export type CategoryRef = { id: number; name: string; slug: string; color: string };

export const categoryRef = (name: string): CategoryRef => {
    const category = mockCategories.find((c) => c.name === name) ?? mockCategories[0];
    return { id: category.id, name: category.name, slug: category.slug, color: category.color };
};
