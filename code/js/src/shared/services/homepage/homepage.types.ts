import type { ContentSummary, SectionType } from '@/shared/services/contents/contents.types';

export type HomepageCategory = {
    id: number;
    name: string;
    slug: string;
    color: string;
};

export type HomepageSection = {
    type: SectionType;
    category: HomepageCategory | null;
    contents: ContentSummary[];
};

export type HomepageResponse = {
    sections: HomepageSection[];
    latestArticles: ContentSummary[];
};

export interface HomepageService {
    getHomepage(): Promise<HomepageResponse>;
}
