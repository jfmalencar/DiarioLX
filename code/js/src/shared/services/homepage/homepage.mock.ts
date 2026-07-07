import { useMemo } from 'react';

import type { ContentSummary } from '@/shared/services/contents/contents.types';
import { mockContents, summaryOf } from '@/shared/services/contents/contents.fixtures';

import type { HomepageService, HomepageResponse, HomepageSection, HomepageCategory } from './homepage.types';

// The homepage is arranged from the shared content fixtures, so every card links to an
// article that actually exists (same slug and title on the detail page).
const buildResponse = (): HomepageResponse => {
    const all = mockContents.map(summaryOf);
    const articles = all.filter((s) => s.type === 'ARTICLE');
    const byType = (type: string): ContentSummary[] => all.filter((s) => s.type === type);
    const byCategory = (slug: string): ContentSummary[] => all.filter((s) => s.category.slug === slug);

    const categorySection = (slug: string, fallbackName: string): HomepageSection => {
        const contents = byCategory(slug);
        const category: HomepageCategory =
            contents[0]?.category ?? { id: 0, name: fallbackName, slug, color: '#000000' };
        return { type: 'CATEGORY', category, contents };
    };

    const firstOf = (slug: string) => byCategory(slug)[0];

    const sections: HomepageSection[] = [
        { type: 'HIGHLIGHT', category: null, contents: articles.slice(0, 1) },
        { type: 'FEATURED', category: null, contents: articles.slice(1, 4) },
        categorySection('lisboa-cidade-aberta', 'Lisboa, Cidade Aberta'),
        categorySection('cultura', 'Cultura'),
        categorySection('sociedade', 'Sociedade'),
        {
            type: 'CATEGORY_ROW',
            category: null,
            contents: [
                firstOf('internacional'),
                firstOf('politica'),
                firstOf('sociedade'),
                firstOf('desporto'),
            ].filter((s): s is ContentSummary => Boolean(s)),
        },
        { type: 'PHOTOS', category: null, contents: byType('PHOTO_ESSAY') },
        { type: 'PODCASTS', category: null, contents: byType('PODCAST') },
        { type: 'VIDEOS', category: null, contents: byType('VIDEO') },
    ];

    return { sections, latestArticles: articles.slice(-4) };
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
