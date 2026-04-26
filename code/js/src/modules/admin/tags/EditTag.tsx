import React, { useEffect, useReducer } from 'react';
import { Link, Navigate, useLocation, useParams, useNavigate } from 'react-router-dom';
import { FieldSection } from '@/shared/components/inputs/FieldSection';
import { UnderlineInput } from '@/shared/components/inputs/UnderlineInput';
import { UnderlineTextArea } from '@/shared/components/inputs/UnderlineTextArea';
import { Button } from '@/shared/components/Button';
import { slugify } from '@/shared/utils/format';

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

    useEffect(() => {
        if (location.state?.tag) {
            const tag = location.state.tag;
            dispatch({ type: 'init', tag });
        } else if (params.id && params.id !== 'nova') {
            fetchOne(params.id).then((tag) => {
                if (tag) {
                    dispatch({ type: 'init', tag });
                } else {
                    navigate('/admin/etiquetas/nova', { replace: true });
                }
            });
        }
    }, [location.state, fetchOne, params.id, navigate]);

    const inputs = state.tag === 'submitting' || state.tag === 'editing' ? state.inputs : null;
    if (!inputs) {
        return <Navigate to='/admin/etiquetas' />;
    }

    const handleChange = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = ev.currentTarget.name === 'slug' ? slugify(ev.currentTarget.value) : ev.currentTarget.value;
        dispatch({ type: 'edit', inputName: ev.currentTarget.name, inputValue: value });
    }

    const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        if (state.tag !== 'editing') return;

        if (state.inputs.name.trim().length === 0) {
            dispatch({ type: 'error', message: 'O nome da etiqueta é obrigatório.' });
            return;
        }

        dispatch({ type: 'submit' });

        const tag: TagFormValues = {
            id: params.id === 'nova' ? '' : params.id!,
            name: inputs.name,
            description: inputs.description,
            slug: inputs.slug,
        };
        (
            params.id === 'nova' ? create(tag) : update(params.id!, tag)
        ).then(() => {
            dispatch({ type: 'success' });
        });
    }

    return (
        <div className='min-vh-100 bg-light'>
            <header className='bg-black text-white border-bottom border-secondary position-sticky top-0'>
                <div className='container-fluid px-4 px-lg-5'>
                    <div className='d-flex align-items-center justify-content-between' style={{ minHeight: 64 }}>
                        <Link to='/admin/etiquetas' className='d-flex align-items-center text-white text-decoration-none'>
                            <img src={icon} alt='Ícone do DiárioLX' style={{ width: 28, height: 28 }} className='me-3' />
                        </Link>
                        <div className='fw-semibold' style={{ fontSize: '1.15rem' }}>
                            {params.id === 'nova' ? 'Criação' : 'Edição'} de etiqueta
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
                                title='Nome'
                                description='O nome é como aparece no teu site.'
                            >
                                <UnderlineInput
                                    value={inputs.name}
                                    name='name'
                                    placeholder='Nome da etiqueta'
                                    disabled={state.tag === 'submitting'}
                                    onChange={handleChange}
                                    dataTestId='tag-input'
                                />
                            </FieldSection>
                            <FieldSection
                                title='Slug'
                                description='A “slug” é a versão legível do URL do nome. É em letras minúsculas e contém apenas letras, números e hífenes.'
                            >
                                <UnderlineInput
                                    value={inputs.slug}
                                    name='slug'
                                    placeholder='slug-da-etiqueta'
                                    disabled={state.tag === 'submitting'}
                                    onChange={handleChange}
                                />
                            </FieldSection>
                            <FieldSection
                                title='Descrição'
                                optional={true}
                                description='Por omissão, a descrição não é proeminente, mas alguns temas poderão apresentá-la.'
                            >
                                <UnderlineTextArea
                                    value={inputs.description}
                                    name='description'
                                    onChange={handleChange}
                                    placeholder='Adiciona uma descrição'
                                    disabled={state.tag === 'submitting'}
                                />
                            </FieldSection>
                            {state.tag === 'editing' && state.error && (
                                <div className='alert alert-danger rounded-3 mb-4'>{state.error}</div>
                            )}
                            <div className='d-flex justify-content-end gap-3 pt-4'>
                                {state.tag !== 'submitting' &&
                                    <Link to='/admin/etiquetas' className='btn btn-outline-dark px-4 rounded-3'>
                                        Cancelar
                                    </Link>
                                }
                                <Button dataTestId='save-tag-button' type='submit' disabled={state.tag === 'submitting'}>
                                    {state.tag === 'submitting' ? 'A guardar...' : 'Guardar etiqueta'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
