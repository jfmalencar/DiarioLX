import { Trash2 } from 'lucide-react';
import { ContentCard } from './ContentCard';
import { useCategories } from '@/shared/hooks/useCategories';
import { useI18n } from '@/shared/hooks/useI18n';
import type { CategorySummary, SectionState, SectionTypeConfig } from './Homepage.types';
import { useEffect } from 'react';

type Props = {
    section: SectionState;
    rules?: SectionTypeConfig;
    onCategoryChange: (category: CategorySummary) => void;
    onEditArticle: (index: number) => void;
    onRemoveSection?: () => void;
    readOnly?: boolean;
};

const SECTION_LABEL_KEYS: Record<string, string> = {
    HIGHLIGHT: 'homepage.section_highlight',
    FEATURED: 'homepage.section_featured',
    CATEGORY: 'homepage.section_category',
    CATEGORY_ROW: 'homepage.section_category_row',
    PHOTOS: 'homepage.section_photos',
    PODCASTS: 'homepage.section_podcasts',
    VIDEOS: 'homepage.section_videos',
};

export const SectionBlock = ({ section, rules, onCategoryChange, onEditArticle, onRemoveSection, readOnly = false }: Props) => {
    const { categories, fetchAll } = useCategories();
    const { t } = useI18n();

    useEffect(() => {
        if (rules?.hasCategory) {
            fetchAll({ size: 30 });
        }
    }, [rules?.hasCategory, fetchAll]);

    const isHighlight = section.type === 'HIGHLIGHT';
    const colClass = isHighlight ? 'col-12' : section.articles.length <= 3 ? 'col-12 col-md-4' : 'col-12 col-md-3';

    return (
        <div>
            <div className='d-flex align-items-center justify-content-between border-bottom border-2 border-dark pb-2 mb-4 mt-4'>
                <div className='d-flex align-items-center gap-3'>
                    <div className='fw-bold m-0'>{t(SECTION_LABEL_KEYS[section.type] ?? 'homepage.section_category')}</div>
                    {rules?.hasCategory && (
                        <select
                            className='form-select w-auto'
                            disabled={readOnly}
                            value={section.category?.id ?? ''}
                            onChange={(e) => {
                                const id = Number(e.target.value);
                                const cat = categories.find((c) => c.id === id);
                                if (cat) onCategoryChange(cat);
                            }}
                        >
                            <option value='' disabled>
                                {t('homepage.choose_category')}
                            </option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                {onRemoveSection && (
                    <button
                        type='button'
                        className='btn btn-outline-danger btn-sm d-flex align-items-center gap-2'
                        onClick={onRemoveSection}
                    >
                        <Trash2 size={16} /> {t('homepage.remove_section')}
                    </button>
                )}
            </div>
            {isHighlight ? (
                <ContentCard
                    content={section.articles[0]}
                    large
                    onEdit={readOnly ? undefined : () => onEditArticle(0)}
                />
            ) : (
                <div className='row g-4'>
                    {section.articles.map((content, i) => (
                        <div className={colClass} key={i}>
                            <ContentCard content={content} onEdit={readOnly ? undefined : () => onEditArticle(i)} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};