import { useEffect, useState } from 'react';

import { Modal } from '@/shared/components/modals/Modal';
import { useContents } from '@/shared/hooks/useContents';
import { useI18n } from '@/shared/hooks/useI18n';
import { MediaPreview } from '@/shared/components/MediaPreview';
import { contentThumbnail, isVideoThumbnail } from '@/shared/utils/content';

import type { ContentSummary, ContentType } from '@/shared/services/contents/contents.types';

type Props = {
    isOpen: boolean;
    title: string;
    selected: ContentSummary | null;
    filterType?: ContentType;
    filterCategory?: string;
    onClose: () => void;
    onSave: (content: ContentSummary | null) => void;
};

const DEBOUNCE_MS = 300;

export const ModalSelectContent = ({
    isOpen,
    title,
    selected,
    filterType,
    filterCategory,
    onClose,
    onSave,
}: Props) => {
    const [query, setQuery] = useState('');
    const [draft, setDraft] = useState<ContentSummary | null>(selected);

    const { contents, loading, fetchAll } = useContents();
    const { t } = useI18n();

    useEffect(() => {
        if (!query.trim()) return;

        const handle = setTimeout(() => {
            const payload: Record<string, string> = { state: 'APPROVED' };
            if (query.trim()) payload.query = query.trim();
            if (filterType) payload.type = filterType;
            if (filterCategory) payload.category = filterCategory;
            fetchAll(payload);
        }, DEBOUNCE_MS);

        return () => clearTimeout(handle);
    }, [query, filterType, filterCategory, fetchAll]);

    return (
        <Modal
            isOpen={isOpen}
            title={title}
            onClose={onClose}
            buttons={[
                {
                    key: 'save',
                    label: t('common.save'),
                    variant: 'primary',
                    onClick: () => onSave(draft),
                },
            ]}
        >
            <input
                type='text'
                className='form-control form-control-lg mb-4'
                placeholder={t('homepage.search_content')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            {query.trim() && (
                <div className='mb-4'>
                    {loading ? (
                        <p className='text-secondary mb-0'>{t('homepage.searching')}</p>
                    ) : contents.length === 0 ? (
                        <p className='text-secondary mb-0'>{t('homepage.no_content_found')}</p>
                    ) : (
                        <div
                            className='d-flex flex-column gap-2'
                            style={{ maxHeight: 240, overflowY: 'auto' }}
                        >
                            {contents.map((c) => (
                                <button
                                    key={c.id}
                                    type='button'
                                    className={`btn text-start d-flex gap-3 align-items-center p-2 border ${draft?.id === c.id ? 'border-dark' : 'border-light'
                                        }`}
                                    onClick={() => setDraft(c)}
                                >
                                    <MediaPreview
                                        src={contentThumbnail(c)}
                                        isVideo={isVideoThumbnail(c)}
                                        alt=''
                                        style={{ width: 64, height: 48, objectFit: 'cover', flexShrink: 0 }}
                                    />
                                    <span className='small'>{c.title}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
            <h6 className='fw-bold border-bottom border-2 border-dark pb-2 mb-3'>{t('homepage.selected_content')}</h6>
            {draft ? (
                <div className='d-flex gap-3'>
                    <MediaPreview
                        src={contentThumbnail(draft)}
                        isVideo={isVideoThumbnail(draft)}
                        alt=''
                        style={{ width: 180, height: 120, objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div>
                        <div
                            className='text-uppercase fw-bold mb-2'
                            style={{ color: '#e63946', fontSize: '0.8rem', letterSpacing: '0.05em' }}
                        >
                            {draft.category.name}
                        </div>
                        <div className='fw-medium lh-sm'>{draft.title}</div>
                    </div>
                </div>
            ) : (
                <p className='text-secondary mb-0'>{t('homepage.no_content_selected')}</p>
            )}
        </Modal>
    );
};
