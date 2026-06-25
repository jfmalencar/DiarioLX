import type { ContentSummary } from '@/shared/services/contents/contents.types';

export type SectionType =
    | 'HIGHLIGHT'
    | 'FEATURED'
    | 'CATEGORY'
    | 'CATEGORY_ROW'
    | 'PHOTOS'
    | 'PODCASTS'
    | 'VIDEOS';

export type SectionTypeConfig = {
    type: SectionType;
    maxArticles: number;
    canBeAdded: boolean;
    hasCategory: boolean;
};

export type CategorySummary = {
    id: number;
    name: string;
    slug: string;
    color: string;
};

export type SectionState = {
    id: string;
    type: SectionType;
    category: CategorySummary | null;
    articles: (ContentSummary | null)[];
};

export type HomepageState = {
    sections: SectionState[];
    editTarget: { sectionId: string; index: number } | null;
    snapshot: SectionState[] | null;
};

export type HomepageAction =
    | { type: 'init'; sections: SectionState[] }
    | { type: 'cancel' }
    | { type: 'save-success' }
    | { type: 'open-edit'; sectionId: string; index: number }
    | { type: 'close-edit' }
    | { type: 'apply-selection'; content: ContentSummary | null }
    | { type: 'set-section-category'; sectionId: string; category: CategorySummary | null }
    | { type: 'add-section' }
    | { type: 'remove-section'; sectionId: string };