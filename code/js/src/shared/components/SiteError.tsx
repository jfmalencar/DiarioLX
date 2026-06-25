export const SiteError = ({ supportEmail = 'diariolx@escs.ipl.pt' }: { supportEmail?: string }) => (
    <div
        className='d-flex flex-column align-items-center justify-content-center text-center px-4'
        style={{ minHeight: '100vh' }}
    >
        <div
            className='font-noticia fw-bold'
            style={{ fontSize: 'clamp(3.5rem, 15vw, 9rem)', lineHeight: 0.9, letterSpacing: '-0.04em' }}
        >
            Ups.
        </div>
        <h1 className='fw-semibold mt-3 mb-2' style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)' }}>
            Não foi possível carregar o site ):
        </h1>
        <p className='text-secondary mb-4' style={{ maxWidth: 460 }}>
            Ocorreu um problema ao ligar ao servidor. Tente novamente dentro de momentos —
            se o problema persistir, contacte o suporte.
        </p>
        <div className='d-flex flex-wrap justify-content-center gap-2'>
            <button
                type='button'
                className='btn btn-dark px-4 py-2 rounded'
                onClick={() => window.location.reload()}
            >
                Tentar novamente
            </button>
            <a
                href={`mailto:${supportEmail}`}
                className='btn btn-outline-dark px-4 py-2 rounded'
            >
                Contactar suporte
            </a>
        </div>
    </div>
);
