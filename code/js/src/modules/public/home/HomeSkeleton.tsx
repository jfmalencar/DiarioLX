const Bar = ({ w, h, className = '' }: { w: number | string; h: number; className?: string }) => (
    <div className={`skeleton rounded ${className}`} style={{ width: w, height: h }} />
);

const Card = () => (
    <div className='col-12 col-sm-6 col-md-4'>
        <Bar w='100%' h={170} className='mb-2' />
        <Bar w='40%' h={10} className='mb-2' />
        <Bar w='95%' h={16} className='mb-1' />
        <Bar w='75%' h={16} />
    </div>
);

const ThreeColBlock = () => (
    <div className='container-diariolx'>
        <Bar w={160} h={20} className='mb-3' />
        <div className='row g-3'>
            <Card />
            <Card />
            <Card />
        </div>
    </div>
);

export const HomeSkeleton = () => (
    <div aria-busy='true' aria-label='A carregar página inicial'>
        <Bar w='100%' h={520} className='rounded-0' />
        <div className='container-diariolx'>
            <div className='row g-3'>
                <Card />
                <Card />
                <Card />
            </div>
        </div>
        <div className='container-diariolx'>
            <Bar w={120} h={24} className='mb-3' />
            <div className='row g-3'>
                {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className='col-12 col-md-6 d-flex gap-3'>
                        <Bar w={90} h={65} />
                        <div className='flex-grow-1'>
                            <Bar w='30%' h={10} className='mb-2' />
                            <Bar w='100%' h={16} className='mb-1' />
                            <Bar w='80%' h={16} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div className='container-diariolx'>
            <div className='row g-0'>
                <div className='col-12 col-md-7'>
                    <Bar w='100%' h={500} className='rounded-0' />
                </div>
                <div className='col-12 col-md-5 ps-md-4 pt-3 pt-md-0'>
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} className='py-3 border-bottom'>
                            <Bar w='35%' h={10} className='mb-2' />
                            <Bar w='90%' h={18} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <ThreeColBlock />
        <ThreeColBlock />
    </div>
);
