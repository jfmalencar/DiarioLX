import { slugify } from '@/shared/utils/format';

import { categoryRef } from '@/shared/services/categories/categories.fixtures';
import { tagRef } from '@/shared/services/tags/tags.fixtures';

import type { Content, ContentSummary, ContentType } from './contents.types';

// Single source of truth for the mock content. Categories and tags are referenced from
// their own fixtures, so the homepage, listings, search, article detail, and the
// backoffice category/tag lists all agree on the same slugs, names and colours.

let seq = 0;

const make = (
    title: string,
    categoryName: string,
    tagName: string,
    type: ContentType = 'ARTICLE',
): Content => {
    const id = ++seq;
    return {
        id,
        slug: slugify(title),
        type,
        title,
        state: 'APPROVED',
        headline: 'Um resumo breve desta publicação, para dar contexto ao leitor.',
        featuredImage: {
            id,
            path: `https://picsum.photos/seed/${id}/1200/800`,
            thumbnailPath: null,
            credits: [],
            altText: title,
            mimeType: 'image/jpeg',
            createdAt: '2026-01-01T00:00:00Z',
        },
        blocks: [
            { id: id * 10 + 1, position: 0, type: 'H3', content: title },
            {
                id: id * 10 + 2,
                position: 1,
                type: 'TEXT',
                content: 'Corpo de teste do artigo, com texto suficiente para renderizar a página de detalhe.',
            },
        ],
        category: categoryRef(categoryName),
        tags: [tagRef(tagName)],
        authors: [{ id: 1, name: 'Redação', slug: 'redacao' }],
        parentId: null,
        parent: null,
        embedUrl: null,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
        publishedAt: '2026-01-01T00:00:00Z',
        archivedAt: null,
    };
};

export const mockContents: Content[] = [
    make('Jovens artistas à procura de oportunidades no país dos sonhos', 'Cultura', 'Cultura'),
    make('A luta do futebol feminino além das quatro linhas', 'Desporto', 'Desporto'),
    make('50 anos de Abril: como revigorar a democracia?', 'Política', 'Política'),
    make('David comprou a casa de sonho. Pode ser engolida pelo mar', 'Sociedade', 'Sociedade'),
    make('Das ruas para o restaurante: a associação que transforma vidas', 'Lisboa, Cidade Aberta', 'Lisboa'),
    make('Santa Casa da Misericórdia: trabalhadores reagem à reestruturação', 'Lisboa, Cidade Aberta', 'Lisboa'),
    make('Maçonaria de portas abertas: uma sombra ruidosa', 'Lisboa, Cidade Aberta', 'Reportagem'),
    make('A cidade que não dorme: as noites de Lisboa', 'Lisboa, Cidade Aberta', 'Lisboa'),
    make('A origem da nostalgia que põe a rockar diferentes gerações', 'Cultura', 'Cultura'),
    make('As imagens da Super Lua Azul pelo mundo', 'Ciência', 'Ciência'),
    make('Aviões Canadair já chegaram à Região Autónoma da Madeira', 'Sociedade', 'Sociedade'),
    make('A ciência de como reconhecemos a cara dos outros', 'Internacional', 'Internacional'),
    make('Portugal regista a percentagem mais alta da UE a cumprir o plano', 'Política', 'Política'),
    make('Fernanda Fragateiro muda o rumo do Circo Corricò', 'Cultura', 'Cultura'),
    make('Cerca de 1300 pessoas exigem medidas contra o ódio a animais', 'Sociedade', 'Sociedade'),
    make('Explorando a história afro-mexicana', 'Fotografia', 'Fotografia', 'PHOTO_ESSAY'),
    make('Diana Dionísio explora a memória colonial', 'Fotografia', 'Fotografia', 'PHOTO_ESSAY'),
    make('O retrato da morte lenta do Mar Cáspio', 'Fotografia', 'Fotografia', 'PHOTO_ESSAY'),
    make('Opiniões de Chora', 'Podcasts', 'Podcast', 'PODCAST'),
    make('Vida quotidiana em Istambul', 'Podcasts', 'Podcast', 'PODCAST'),
    make('Do lado certo da rede', 'Podcasts', 'Podcast', 'PODCAST'),
    make('A luta do futebol feminino, em vídeo', 'Vídeos', 'Vídeo', 'VIDEO'),
    make('Caminhada mundial pela liberdade em Santarém', 'Vídeos', 'Vídeo', 'VIDEO'),
    make('Campeonato mundial de Jiu-Jitsu: David André', 'Vídeos', 'Vídeo', 'VIDEO'),
];

export const summaryOf = (c: Content): ContentSummary => ({
    id: c.id,
    title: c.title,
    headline: c.headline,
    state: c.state,
    type: c.type,
    slug: c.slug,
    featuredImage: c.featuredImage?.path ?? null,
    embedUrl: c.embedUrl,
    category: c.category,
    tag: c.tags[0] ?? { id: 0, name: '', slug: '' },
    authors: c.authors,
    createdAt: c.createdAt,
    publishedAt: c.publishedAt,
    archivedAt: c.archivedAt,
});
