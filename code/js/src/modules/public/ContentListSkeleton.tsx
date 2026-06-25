const Bar = ({ w, h, className = '' }: { w: number | string; h: number; className?: string }) => (
    <div className={`skeleton rounded ${className}`} style={{ width: w, height: h }} />
);

export const ContentListSkeleton = () => (
    <div aria-busy='true' aria-label='A carregar conteúdos'>
        <Bar w='100%' h={520} className='rounded-0' />
        <div className='container-diariolx'>
            <Bar w={200} h={24} className='mb-3' />
            <div className='row g-3'>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className='col-12 col-sm-6 col-md-4'>
                        <Bar w='100%' h={250} className='mb-2' />
                        <Bar w='40%' h={10} className='mb-2' />
                        <Bar w='90%' h={18} />
                    </div>
                ))}
            </div>
        </div>
    </div>
);
