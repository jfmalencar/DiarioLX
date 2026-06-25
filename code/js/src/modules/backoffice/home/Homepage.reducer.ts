import type { ContentSummary } from '@/shared/services/contents/contents.types';
import type { FeaturedSectionResponse, SaveHomepageRequest } from '@/shared/services/featured/featured.types';
import type { HomepageState, HomepageAction, SectionState, SectionTypeConfig } from './Homepage.types';

const emptyArticles = (n: number): (ContentSummary | null)[] => Array(n).fill(null);

const replaceAt = <T,>(arr: T[], index: number, value: T): T[] => arr.map((item, i) => (i === index ? value : item));

const configFor = (config: SectionTypeConfig[], type: string) => config.find((c) => c.type === type);

const fillSlots = (contents: ContentSummary[], max: number): (ContentSummary | null)[] => {
    const slots = emptyArticles(max);
    contents.slice(0, max).forEach((c, i) => { slots[i] = c; });
    return slots;
};

const emptySection = (rules: SectionTypeConfig): SectionState => ({
    id: rules.type.toLowerCase(),
    type: rules.type,
    category: null,
    articles: emptyArticles(rules.maxArticles),
});

export const responseToState = (response: FeaturedSectionResponse[], config: SectionTypeConfig[]): SectionState[] => {
    const toState = (s: FeaturedSectionResponse): SectionState => {
        const rules = configFor(config, s.type);
        const max = rules?.maxArticles ?? s.contents.length;
        return {
            id: s.id.toString(),
            type: s.type,
            category: s.category,
            articles: fillSlots(s.contents, max),
        };
    };
    return config.flatMap((rules) => {
        const saved = response.filter((s) => s.type === rules.type);
        if (rules.type === 'CATEGORY') {
            return saved.map(toState);
        }
        return [saved[0] ? toState(saved[0]) : emptySection(rules)];
    });
};

export const buildPayload = (sections: SectionState[]): SaveHomepageRequest => ({
    sections: sections.map((s) => ({
        type: s.type,
        categoryId: s.category?.id ?? null,
        contentIds: s.articles.filter((a): a is ContentSummary => a !== null).map((a) => a.id),
    })),
});

export const buildInitialState = (config: SectionTypeConfig[]): HomepageState => {
    const sections: SectionState[] = config.map((c) =>
        c.type === 'CATEGORY'
            ? {
                id: `category-${Date.now()}`,
                type: c.type,
                category: null,
                articles: emptyArticles(c.maxArticles),
            }
            : {
                id: c.type.toLowerCase(),
                type: c.type,
                category: null,
                articles: emptyArticles(c.maxArticles),
            },
    );
    return { sections, editTarget: null, snapshot: null };
};

export const makeHomepageReducer =
    (config: SectionTypeConfig[]) =>
        (state: HomepageState, action: HomepageAction): HomepageState => {
            switch (action.type) {
                case 'init':
                    return {
                        ...state,
                        sections: action.sections,
                        snapshot: action.sections,
                        editTarget: null,
                    };

                case 'cancel':
                    return state.snapshot
                        ? { ...state, sections: state.snapshot, editTarget: null }
                        : state;

                case 'save-success':
                    return { ...state, snapshot: state.sections };

                case 'open-edit':
                    return {
                        ...state,
                        editTarget: { sectionId: action.sectionId, index: action.index },
                    };

                case 'close-edit':
                    return { ...state, editTarget: null };

                case 'apply-selection': {
                    const t = state.editTarget;
                    if (!t) return state;
                    return {
                        ...state,
                        sections: state.sections.map((s) =>
                            s.id === t.sectionId
                                ? { ...s, articles: replaceAt(s.articles, t.index, action.content) }
                                : s,
                        ),
                        editTarget: null,
                    };
                }

                case 'set-section-category':
                    return {
                        ...state,
                        sections: state.sections.map((s) => {
                            if (s.id !== action.sectionId) return s;
                            const changed = s.category?.id !== action.category?.id;
                            return {
                                ...s,
                                category: action.category,
                                articles: changed ? emptyArticles(s.articles.length) : s.articles,
                            };
                        }),
                    };

                case 'add-section': {
                    const cat = configFor(config, 'CATEGORY');
                    if (!cat) return state;
                    const newSection: SectionState = {
                        id: `category-${Date.now()}`,
                        type: 'CATEGORY',
                        category: null,
                        articles: emptyArticles(cat.maxArticles),
                    };
                    const lastCategoryIdx = state.sections.reduce((last, s, i) => (s.type === 'CATEGORY' ? i : last), -1);
                    const insertAt = lastCategoryIdx + 1;
                    return {
                        ...state,
                        sections: [
                            ...state.sections.slice(0, insertAt),
                            newSection,
                            ...state.sections.slice(insertAt),
                        ],
                    };
                }

                case 'remove-section':
                    return { ...state, sections: state.sections.filter((s) => s.id !== action.sectionId) };

                default:
                    return state;
            }
        };

export const selectCurrentContent = (state: HomepageState): ContentSummary | null => {
    const t = state.editTarget;
    if (!t) return null;
    const section = state.sections.find((s) => s.id === t.sectionId);
    return section ? section.articles[t.index] : null;
};

export const selectEditingSection = (state: HomepageState) => {
    const t = state.editTarget;
    if (!t) return null;
    return state.sections.find((s) => s.id === t.sectionId) ?? null;
};

export const selectIsDirty = (state: HomepageState): boolean => {
    if (!state.snapshot) return false;
    return JSON.stringify(state.sections) !== JSON.stringify(state.snapshot);
};

export const editTargetKey = (state: HomepageState): string => state.editTarget ? `${state.editTarget.sectionId}-${state.editTarget.index}` : 'none';