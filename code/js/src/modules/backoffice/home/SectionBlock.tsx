import { Trash2 } from 'lucide-react';
import { ContentCard } from './ContentCard';
import { useCategories } from '@/shared/hooks/useCategories';
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

const SECTION_LABELS: Record<string, string> = {
    HIGHLIGHT: 'Notícia Principal',
    FEATURED: 'Notícias em destaque',
    CATEGORY: 'Secção',
    CATEGORY_ROW: 'Linha de categorias',
    PHOTOS: 'Fotografia',
    PODCASTS: 'Podcasts',
    VIDEOS: 'Vídeos',
};

export const SectionBlock = ({ section, rules, onCategoryChange, onEditArticle, onRemoveSection, readOnly = false }: Props) => {
    const { categories, fetchAll } = useCategories();

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
                    <div className='fw-bold m-0'>{SECTION_LABELS[section.type] ?? 'Secção'}</div>
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
                                Escolher categoria...
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
                        <Trash2 size={16} /> Remover secção
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