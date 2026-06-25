import { useMemo } from 'react';

import type { ContentSummary, ContentType } from '@/shared/services/contents/contents.types';

import type {
    HomepageService,
    HomepageResponse,
    HomepageSection,
    HomepageCategory,
} from './homepage.types';

const img = (seed: number) => `https://picsum.photos/seed/${seed}/640/420`;

let counter = 0;

const mk = (
    title: string,
    categoryName: string,
    type: ContentType = 'ARTICLE',
): ContentSummary => {
    const id = ++counter;
    return {
        id,
        title,
        headline: 'Um resumo breve do conteúdo em destaque na página inicial.',
        state: 'PUBLISHED',
        type,
        slug: `mock-${id}`,
        featuredImage: img(id),
        category: {
            id: 1,
            name: categoryName,
            slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
            color: '#e63946',
        },
        tag: { id: 1, name: 'Tag', slug: 'tag' },
        authors: [{ id: 1, name: 'Redação', slug: 'redacao' }],
        createdAt: '2026-01-01T00:00:00Z',
        publishedAt: '2026-01-01T00:00:00Z',
    };
};

const category = (name: string): HomepageCategory => ({
    id: counter,
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    color: '#00d4e0',
});

const buildResponse = (): HomepageResponse => {
    counter = 0;
    const sections: HomepageSection[] = [
        {
            type: 'HIGHLIGHT',
            category: null,
            contents: [
                mk('Jovens artistas à procura de oportunidades: país dos sonhos e das ilusões', 'Jovens'),
            ],
        },
        {
            type: 'FEATURED',
            category: null,
            contents: [
                mk('A luta do futebol feminino além das quatro linhas', 'Desporto'),
                mk('50 anos de Abril: Como revigorar a democracia?', '50 Anos'),
                mk('David comprou a casa de sonho. Pode ser engolida pelo mar', 'Crónica'),
            ],
        },
        {
            type: 'CATEGORY',
            category: category('Lisboa, Cidade Aberta'),
            contents: [
                mk('Das ruas para o restaurante: a associação que transforma vidas', 'Lisboa'),
                mk('Santa Casa da Misericórdia. Trabalhadores reagem a plano de reestruturação', 'Lisboa'),
                mk('Maçonaria de portas abertas: uma sombra ruidosa', 'Lisboa'),
                mk('A cidade que não dorme: noites de Lisboa', 'Lisboa'),
            ],
        },
        {
            type: 'CATEGORY',
            category: category('A Fundo'),
            contents: [
                mk('A origem da "nostalgia" que põe a "rockar" diferentes gerações', 'Reportagem'),
                mk('Das ruas para o restaurante: a associação que transforma vidas', 'Crónica'),
                mk('50 anos de Abril: Como revigorar a democracia?', 'Especial'),
                mk('Maçonaria de portas abertas: uma sombra ruidosa', 'Maçonaria'),
            ],
        },
        {
            type: 'CATEGORY',
            category: category('Especiais'),
            contents: [
                mk('A origem da "nostalgia" que põe a "rockar" diferentes gerações', 'Cultura'),
                mk('As imagens da Super Lua Azul pelo mundo', 'Ciência'),
                mk('Aviões Canadair já chegaram à Região Autónoma da Madeira', 'Madeira'),
            ],
        },
        {
            type: 'CATEGORY_ROW',
            category: null,
            contents: [
                mk('A ciência de como reconhecemos a cara dos outros', 'Internacional'),
                mk('Portugal regista percentagem mais alta da UE em cumprir plano', 'Política'),
                mk('Em Quinzenas, instala uma casa com um reforço em cada lar', 'Sociedade'),
                mk('A luta do futebol feminino além das quatro linhas', 'Economia'),
            ],
        },
        {
            type: 'PHOTOS',
            category: null,
            contents: [
                mk('Explorando a história afro-mexicana', 'Fotografia', 'PHOTO_ESSAY'),
                mk('Diana Dionísio explora a memória colonial', 'Memória', 'PHOTO_ESSAY'),
                mk('Fotógrafo traz o retrato da morte lenta do Mar Cáspio', 'Mar', 'PHOTO_ESSAY'),
            ],
        },
        {
            type: 'PODCASTS',
            category: null,
            contents: [
                mk('Opiniões de Chora', 'Podcast', 'PODCAST'),
                mk('Vida quotidiana em Istambul', 'Podcast', 'PODCAST'),
                mk('Do lado certo da verde', 'Podcast', 'PODCAST'),
            ],
        },
        {
            type: 'VIDEOS',
            category: null,
            contents: [
                mk('A luta do futebol feminino', 'Vídeo', 'VIDEO'),
                mk('Caminhada mundial de liberdade de Santarém', 'Vídeo', 'VIDEO'),
                mk('Campeonato mundial de Jiu-Jitsu. David André', 'Vídeo', 'VIDEO'),
            ],
        },
    ];

    return {
        sections,
        latestArticles: [
            mk('Fernanda Fragateiro muda o rumo do Circo Corricò', 'Opinião'),
            mk('Fim-de-semana com notícias tropicais e temporais no século XXI', 'Internacional'),
            mk('Depois a seguir à Portuguesa: Ciganos distinguem-lhe da Moda', 'Moda'),
            mk('Cerca de 1300 pessoas exigem medidas para travar ódio contra animais', 'Política'),
        ],
    };
};

export const useHomepageMockService = (): HomepageService =>
    useMemo<HomepageService>(
        () => ({
            async getHomepage(): Promise<HomepageResponse> {
                await new Promise((resolve) => setTimeout(resolve, 300));
                return buildResponse();
            },
        }),
        [],
    );
