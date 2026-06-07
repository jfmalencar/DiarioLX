import { type Dispatch } from 'react';

import {
    Plus,
    Type,
    Quote,
    Heading3,
    Heading4,
    Image as ImageIcon,
} from 'lucide-react';

import type { EditContentAction } from './EditContent.types';

type Props = {
    afterId?: number;
    dispatch: Dispatch<EditContentAction>;
    loading: boolean;
    inline?: boolean;
}

export const AddMenu = ({ afterId, dispatch, loading, inline = false }: Props) => (
    <div className={`add-menu dropdown ${inline ? '' : 'add-menu--always-visible d-flex justify-content-center my-2'}`} >
        <button
            type='button'
            className={`add-menu__toggle btn btn-sm p-0 d-flex align-items-center justify-content-center ${inline ? '' : 'btn-light border rounded-circle'}`}
            style={inline ? { width: 22, height: 22 } : { width: 28, height: 28 }}
            data-bs-toggle='dropdown'
            aria-expanded='false'
            aria-label='Adicionar bloco'
            disabled={loading}
        >
            <Plus size={inline ? 15 : 16} />
        </button>
        <ul className='dropdown-menu shadow-sm'>
            <li>
                <button
                    type='button'
                    className='dropdown-item d-flex align-items-center gap-2'
                    onClick={() => dispatch({ type: 'add-text-block', afterId })}
                >
                    <Type size={16} /> Texto
                </button>
            </li>
            <li>
                <button
                    type='button'
                    className='dropdown-item d-flex align-items-center gap-2'
                    onClick={() => dispatch({ type: 'add-quote-block', afterId })}
                >
                    <Quote size={16} /> Citação
                </button>
            </li>
            <li>
                <button
                    type='button'
                    className='dropdown-item d-flex align-items-center gap-2'
                    onClick={() =>
                        dispatch({ type: 'add-heading-block', level: 3, afterId })
                    }
                >
                    <Heading3 size={16} /> Título H3
                </button>
            </li>
            <li>
                <button
                    type='button'
                    className='dropdown-item d-flex align-items-center gap-2'
                    onClick={() =>
                        dispatch({ type: 'add-heading-block', level: 4, afterId })
                    }
                >
                    <Heading4 size={16} /> Título H4
                </button>
            </li>
            <li>
                <hr className='dropdown-divider' />
            </li>
            <li>
                <button
                    type='button'
                    className='dropdown-item d-flex align-items-center gap-2'
                    onClick={() =>
                        dispatch({ type: 'open-gallery', payload: 'block', afterId })
                    }
                >
                    <ImageIcon size={16} /> Imagem
                </button>
            </li>
        </ul>
    </div>
);
