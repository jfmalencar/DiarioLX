import React, { useEffect, useReducer } from 'react';
import { Link, Navigate, useLocation, useParams, useNavigate } from 'react-router-dom';
import { FieldSection } from '@/shared/components/inputs/FieldSection';
import { UnderlineInput } from '@/shared/components/inputs/UnderlineInput';
import { UnderlineTextArea } from '@/shared/components/inputs/UnderlineTextArea';
import { Button } from '@/shared/components/Button';
import { slugify } from '@/shared/utils/format';
import { useI18n } from '@/shared/hooks/useI18n';

import { type Tag, type TagFormValues, useTags } from '@/shared/hooks/useTags';

import icon from '@/assets/icon.svg';

type Inputs = {
    name: string;
    description: string;
    slug: string;
}

type State =
    | { tag: 'editing'; error?: string; inputs: Inputs; }
    | { tag: 'submitting'; inputs: Inputs; }
    | { tag: 'success' };

type Action =
    | { type: 'init'; tag: Tag }
    | { type: 'edit'; inputName: string; inputValue: string }
    | { type: 'submit' }
    | { type: 'error'; message: string }
    | { type: 'success' };

const reduce = (state: State, action: Action): State => {
    switch (state.tag) {
        case 'editing':
            if (action.type === 'init') {
                return {
                    tag: 'editing',
                    inputs: {
                        name: action.tag.name,
                        description: action.tag.description,
                        slug: action.tag.slug,
                    },
                };
            }
            else if (action.type === 'edit') {
                const nextInputs = { ...state.inputs, [action.inputName]: action.inputValue };
                if (action.inputName === 'name' && state.inputs.slug === slugify(state.inputs.name)) {
                    nextInputs.slug = slugify(action.inputValue);
                }
                return {
                    tag: 'editing',
                    error: undefined,
                    inputs: nextInputs,
                };
            } else if (action.type === 'submit') {
                return { tag: 'submitting', inputs: state.inputs };
            } else {
                console.log(`Unexpected action ${action.type} in state ${state.tag}`);
                return state;
            }

        case 'submitting':
            if (action.type === 'success') {
                return { tag: 'success' };
            } else if (action.type === 'error') {
                return { tag: 'editing', error: action.message, inputs: state.inputs };
            } else {
                console.log(`Unexpected action ${action.type} in state ${state.tag}`);
                return state;
            }

        case 'success':
            return state;
    }
}

export const EditTag = () => {
    const { t } = useI18n();
    const { fetchOne, create, update } = useTags();
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const [state, dispatch] = useReducer(reduce, {
        tag: 'editing',
        inputs: {
            name: '',
            description: '',
            slug: '',
        },
    });

    const tagId = params.id === 'new' ? 0 : parseInt(params.id!);

    useEffect(() => {
        if (location.state?.tag) {
            const tag = location.state.tag;
            dispatch({ type: 'init', tag });
        } else if (tagId) {
            fetchOne(tagId).then((tag) => {
                if (tag) {
                    dispatch({ type: 'init', tag });
                } else {
                    navigate('/backoffice/tags/new', { replace: true });
                }
            });
        }
    }, [location.state, fetchOne, tagId, navigate]);

    const inputs = state.tag === 'submitting' || state.tag === 'editing' ? state.inputs : null;
    if (!inputs) {
        return <Navigate to='/backoffice/tags' />;
    }

    const handleChange = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = ev.currentTarget.name === 'slug' ? slugify(ev.currentTarget.value) : ev.currentTarget.value;
        dispatch({ type: 'edit', inputName: ev.currentTarget.name, inputValue: value });
    }

    const handleSubmit = (ev: React.ChangeEvent<HTMLFormElement>) => {
        ev.preventDefault();
        if (state.tag !== 'editing') return;

        if (state.inputs.name.trim().length === 0) {
            dispatch({ type: 'error', message: t('tags.name_required') });
            return;
        }

        dispatch({ type: 'submit' });

        const tag: TagFormValues = {
            id: tagId,
            name: inputs.name,
            description: inputs.description,
            slug: inputs.slug,
        };
        (
            params.id === 'new' ? create(tag) : update(tagId, tag)
        ).then((result) => {
            if (result.ok) {
                dispatch({ type: 'success' });
            } else {
                dispatch({ type: 'error', message: result.error });
            }
        });
    }

    return (
        <div className='min-vh-100 bg-light'>
            <header className='bg-black text-white border-bottom border-secondary position-sticky top-0'>
                <div className='container-fluid px-4 px-lg-5'>
                    <div className='d-flex align-items-center justify-content-between' style={{ minHeight: 64 }}>
                        <Link to='/backoffice/tags' className='d-flex align-items-center text-white text-decoration-none'>
                            <img src={icon} alt='Ícone do DiárioLX' style={{ width: 28, height: 28 }} className='me-3' />
                        </Link>
                        <div className='fw-semibold' style={{ fontSize: '1.15rem' }}>
                            {params.id === 'new' ? t('tags.create_title') : t('tags.edit_title')}
                        </div>
                        <div></div>
                    </div>
                </div>
            </header>
            <main className='container py-5'>
                <div className='row justify-content-center'>
                    <div className='col-12 col-xl-8'>
                        <form onSubmit={handleSubmit} className='bg-transparent'>
                            <FieldSection
                                title={t('common.name')}
                                description={t('common.name_description')}
                            >
                                <UnderlineInput
                                    value={inputs.name}
                                    name='name'
                                    placeholder={t('tags.name_placeholder')}
                                    disabled={state.tag === 'submitting'}
                                    onChange={handleChange}
                                    dataTestId='tag-input'
                                />
                            </FieldSection>
                            <FieldSection
                                title={t('common.slug')}
                                description={t('common.slug_description')}
                            >
                                <UnderlineInput
                                    value={inputs.slug}
                                    name='slug'
                                    placeholder={t('tags.slug_placeholder')}
                                    disabled={state.tag === 'submitting'}
                                    onChange={handleChange}
                                />
                            </FieldSection>
                            <FieldSection
                                title={t('common.description')}
                                optional={true}
                                description={t('common.description_hint')}
                            >
                                <UnderlineTextArea
                                    value={inputs.description}
                                    name='description'
                                    onChange={handleChange}
                                    placeholder={t('common.description_placeholder')}
                                    disabled={state.tag === 'submitting'}
                                />
                            </FieldSection>
                            {state.tag === 'editing' && state.error && (
                                <div className='alert alert-danger rounded-3 mb-4'>{state.error}</div>
                            )}
                            <div className='d-flex justify-content-end gap-3 pt-4'>
                                {state.tag !== 'submitting' &&
                                    <Link to='/backoffice/tags' className='btn btn-outline-dark px-4 rounded-3'>
                                        {t('common.cancel')}
                                    </Link>
                                }
                                <Button dataTestId='save-tag-button' type='submit' disabled={state.tag === 'submitting'}>
                                    {state.tag === 'submitting' ? t('common.saving') : t('tags.save_button')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
