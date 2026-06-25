import { Link } from 'react-router-dom';

import { usePageTheme } from '@/shared/hooks/usePageTheme';

export function NotFound() {
    usePageTheme('light');

    return (
        <div
            data-testid='not-found'
            className='container d-flex flex-column align-items-center justify-content-center text-center px-4'
            style={{ minHeight: '60vh' }}
        >
            <div
                className='font-noticia fw-bold'
                style={{ fontSize: 'clamp(5rem, 20vw, 12rem)', lineHeight: 0.9, letterSpacing: '-0.04em' }}
            >
                404
            </div>
            <h1 className='fw-semibold mt-3 mb-2' style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)' }}>
                Página não encontrada
            </h1>
            <p className='text-secondary mb-4' style={{ maxWidth: 440 }}>
                A página que procura não existe, foi removida ou o endereço está incorreto.
            </p>
            <Link to='/' data-testid='home-link' className='btn btn-dark px-4 py-2 rounded'>
                Voltar à página inicial
            </Link>
        </div>
    );
}
