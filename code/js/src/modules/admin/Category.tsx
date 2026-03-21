import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';

import { FieldSection } from '@/shared/components/inputs/FieldSection';
import { UnderlineInput } from '@/shared/components/inputs/UnderlineInput';
import { UnderlineTextArea } from '@/shared/components/inputs/UnderlineTextArea';
import { SearchField } from '@/shared/components/inputs/SearchField';
import { slugify } from '@/shared/utils/format';
import { type Category as CategoryType, useCategories } from '@/shared/hooks/useCategories';

import icon from '@/assets/icon.svg';

type CategoryOption = {
    id: string;
    name: string;
};

type Inputs = {
    name: string;
    description: string;
    slug: string;
    color: string;
    parentId: string;
    parentSearch: string;
}

type State =
    | {
        tag: 'editing';
        error?: string;
        inputs: Inputs;
    }
    | {
        tag: 'submitting';
        inputs: Inputs;
    }
    | { tag: 'success' };

type Action =
    | { type: 'init'; category: CategoryType }
    | { type: 'edit'; inputName: string; inputValue: string }
    | { type: 'select-parent'; parentId: string; parentName: string }
    | { type: 'submit' }
    | { type: 'error'; message: string }
    | { type: 'success' };

const parentCategories: CategoryOption[] = [
    { id: '1', name: 'Cultura' },
    { id: '2', name: 'Política' },
    { id: '3', name: 'Fotografia' },
    { id: '4', name: 'Cidade' },
    { id: '5', name: 'Podcast' },
];

const reduce = (state: State, action: Action): State => {
    switch (state.tag) {
        case 'editing':
            if (action.type === 'init') {
                return {
                    tag: 'editing',
                    inputs: {
                        name: action.category.name,
                        description: action.category.description,
                        slug: action.category.slug,
                        color: action.category.color,
                        parentId: action.category.parentId || '',
                        parentSearch: action.category.parentName || '',
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
            } else if (action.type === 'select-parent') {
                return {
                    tag: 'editing',
                    error: undefined,
                    inputs: {
                        ...state.inputs,
                        parentId: action.parentId,
                        parentSearch: action.parentName,
                    },
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

export const Category = () => {
    const { create, update } = useCategories();
    const [isColorOpen, setIsColorOpen] = useState(false);
    const location = useLocation();
    const params = useParams();
    const [state, dispatch] = useReducer(reduce, {
        tag: 'editing',
        inputs: {
            name: '',
            description: '',
            slug: '',
            color: '#000000',
            parentId: '',
            parentSearch: '',
        },
    });

    useEffect(() => {
        if (location.state?.category) {
            const category = location.state.category;
            dispatch({ type: 'init', category });
        }
    }, [location.state]);

    const inputs = state.tag === 'submitting' || state.tag === 'editing' ? state.inputs : null;

    const filteredParents = useMemo(() => {
        if (!inputs) return parentCategories;
        const search = inputs.parentSearch.trim().toLowerCase();
        if (search.length === 0) return parentCategories;
        return parentCategories.filter((option) => option.name.toLowerCase().includes(search));
    }, [inputs]);

    if (!inputs) {
        return <Navigate to='/admin/categorias' />;
    }

    const handleChange = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = ev.currentTarget.name === 'slug' ? slugify(ev.currentTarget.value) : ev.currentTarget.value;
        dispatch({ type: 'edit', inputName: ev.currentTarget.name, inputValue: value });
    }

    const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        if (state.tag !== 'editing') return;

        if (state.inputs.name.trim().length === 0) {
            dispatch({ type: 'error', message: 'O nome da categoria é obrigatório.' });
            return;
        }

        dispatch({ type: 'submit' });

        const category: CategoryType = {
            id: params.id === 'nova' ? '' : params.id!,
            name: inputs.name,
            description: inputs.description,
            slug: inputs.slug,
            color: inputs.color,
            parentId: inputs.parentId || null,
            parentName: inputs.parentSearch || null,
            count: 0,
        };
        (
            params.id === 'nova' ? create(category) : update(params.id!, category)
        ).then(() => {
            dispatch({ type: 'success' });
        });
    }

    return (
        <div className='min-vh-100 bg-light'>
            <header className='bg-black text-white border-bottom border-secondary position-sticky top-0'>
                <div className='container-fluid px-4 px-lg-5'>
                    <div className='d-flex align-items-center justify-content-between' style={{ minHeight: 64 }}>
                        <Link to='/admin/categorias' className='d-flex align-items-center text-white text-decoration-none'>
                            <img src={icon} alt='Ícone do DiárioLX' style={{ width: 28, height: 28 }} className='me-3' />
                        </Link>
                        <div className='fw-semibold' style={{ fontSize: '1.15rem' }}>
                            {params.id === 'nova' ? 'Criação' : 'Edição'} de categoria
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
                                    placeholder='Nome da categoria'
                                    disabled={state.tag === 'submitting'}
                                    onChange={handleChange}
                                />
                            </FieldSection>
                            <FieldSection
                                title='Slug'
                                description='A “slug” é a versão legível do URL do nome. É em letras minúsculas e contém apenas letras, números e hífenes.'
                            >
                                <UnderlineInput
                                    value={inputs.slug}
                                    name='slug'
                                    placeholder='slug-da-categoria'
                                    disabled={state.tag === 'submitting'}
                                    onChange={handleChange}
                                />
                            </FieldSection>
                            <FieldSection
                                title='Categoria superior'
                                optional={true}
                                description='As categorias, ao contrário das etiquetas, podem ter uma hierarquia. Totalmente opcional.'
                            >
                                <SearchField
                                    disabled={state.tag === 'submitting'}
                                    value={inputs.parentSearch}
                                    options={filteredParents}
                                    placeholder='Pesquisar categoria superior'
                                    onSearch={handleChange}
                                    onSelect={(option) =>
                                        dispatch({ type: 'select-parent', parentId: option.id, parentName: option.name })
                                    }
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
                            <FieldSection title='Cor'>
                                <div className='d-flex align-items-center gap-3 mb-3'>
                                    <button
                                        type='button'
                                        className='btn rounded-3 border'
                                        onClick={() => setIsColorOpen((current) => !current)}
                                        style={{
                                            width: 56,
                                            height: 56,
                                            backgroundColor: inputs.color,
                                            borderColor: '#000',
                                        }}
                                        aria-label='Escolher cor'
                                    />
                                    <input
                                        disabled={state.tag === 'submitting'}
                                        value={inputs.color}
                                        name='color'
                                        onChange={handleChange}
                                        className='form-control border-0 border-bottom rounded-0 px-0 bg-transparent shadow-none'
                                        placeholder='#000000'
                                        style={{ borderColor: '#cfcfcf', fontSize: '1.15rem', maxWidth: 180 }}
                                    />
                                </div>
                                {isColorOpen && (
                                    <div className='mt-3'>
                                        <HexColorPicker
                                            color={inputs.color}
                                            onChange={(value) => dispatch({ type: 'edit', inputName: 'color', inputValue: value })}
                                        />
                                    </div>
                                )}
                            </FieldSection>
                            {state.tag === 'editing' && state.error && (
                                <div className='alert alert-danger rounded-3 mb-4'>{state.error}</div>
                            )}
                            <div className='d-flex justify-content-end gap-3 pt-4'>
                                {state.tag !== 'submitting' &&
                                    <Link to='/admin/categorias' className='btn btn-outline-dark px-4 rounded-3'>
                                        Cancelar
                                    </Link>
                                }
                                <button type='submit' className='btn btn-dark px-4 rounded-3' disabled={state.tag === 'submitting'}>
                                    {state.tag === 'submitting' ? 'A guardar...' : 'Guardar categoria'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
