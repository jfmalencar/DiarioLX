import { useEffect, useMemo, useReducer } from 'react';
import { Plus } from 'lucide-react';
import { useBootstrap } from '@/shared/hooks/useBootstrap';
import { useFeatured } from '@/shared/hooks/useFeatured';
import { useSnackbar } from '@/shared/hooks/useSnackbar';
import { useAuthentication } from '@/shared/hooks/useAuthentication';
import { useI18n } from '@/shared/hooks/useI18n';
import { SectionBlock } from './SectionBlock';
import { ModalSelectContent } from './ModalSelectContent';
import { SaveBar } from '@/shared/components/SaveBar';
import {
    makeHomepageReducer,
    buildInitialState,
    responseToState,
    buildPayload,
    selectCurrentContent,
    selectEditingSection,
    selectIsDirty,
    editTargetKey,
} from './Homepage.reducer';
import type { SectionTypeConfig } from './Homepage.types';
import type { ContentType } from '@/shared/services/contents/contents.types';

export const Homepage = () => {
    const { sections: config } = useBootstrap() as { sections: SectionTypeConfig[] };
    const { fetchHomepage, save, loading } = useFeatured();
    const { showSnackbar } = useSnackbar();
    const { user } = useAuthentication();
    const { t } = useI18n();

    const canEditFeatured = user?.features?.includes('manage-featured');

    const reducer = useMemo(() => makeHomepageReducer(config), [config]);
    const initial = useMemo(() => buildInitialState(config), [config]);
    const [state, dispatch] = useReducer(reducer, initial);

    useEffect(() => {
        fetchHomepage().then((sections) => {
            if (sections) {
                dispatch({ type: 'init', sections: responseToState(sections, config) });
            }
        });
    }, [fetchHomepage, config]);

    const editingSection = selectEditingSection(state);
    const isDirty = selectIsDirty(state);

    const contentTypeFor = (sectionType?: string): ContentType | undefined => {
        switch (sectionType) {
            case 'PHOTOS':
                return 'PHOTO_ESSAY';
            case 'PODCASTS':
                return 'PODCAST';
            case 'VIDEOS':
                return 'VIDEO';
            default:
                return undefined;
        }
    };

    const handleSave = async () => {
        const res = await save(buildPayload(state.sections));
        if (res.ok) dispatch({ type: 'save-success' });
        else showSnackbar(res.error, 'error');
    };

    return (
        <div>
            {config.map((rules) => {
                const sectionsOfType = state.sections.filter((s) => s.type === rules.type);
                const isCategory = rules.type === 'CATEGORY';
                const canRemove = rules.canBeAdded && isCategory && sectionsOfType.length > 1;

                return (
                    <div key={rules.type}>
                        {sectionsOfType.map((section) => (
                            <SectionBlock
                                key={section.id}
                                section={section}
                                rules={rules}
                                onCategoryChange={(category) =>
                                    dispatch({ type: 'set-section-category', sectionId: section.id, category })
                                }
                                onEditArticle={(index) =>
                                    dispatch({ type: 'open-edit', sectionId: section.id, index })
                                }
                                onRemoveSection={
                                    canRemove && canEditFeatured
                                        ? () => dispatch({ type: 'remove-section', sectionId: section.id })
                                        : undefined
                                }
                                readOnly={!canEditFeatured}
                            />
                        ))}

                        {isCategory && rules.canBeAdded && canEditFeatured && (
                            <div className='mt-4'>
                                <button
                                    type='button'
                                    className='btn btn-dark d-flex align-items-center gap-2'
                                    onClick={() => dispatch({ type: 'add-section' })}
                                >
                                    <Plus size={18} /> {t('homepage.add_section')}
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}

            <ModalSelectContent
                key={editTargetKey(state)}
                isOpen={state.editTarget !== null}
                title={t('homepage.change_content')}
                selected={selectCurrentContent(state)}
                filterType={contentTypeFor(editingSection?.type)}
                filterCategory={editingSection?.category?.slug}
                onClose={() => dispatch({ type: 'close-edit' })}
                onSave={(content) => dispatch({ type: 'apply-selection', content })}
            />

            <SaveBar
                visible={isDirty && !!canEditFeatured}
                saving={loading}
                onSave={handleSave}
                onCancel={() => dispatch({ type: 'cancel' })}
            />
        </div>
    );
};