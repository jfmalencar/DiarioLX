export const ContentPreviewSkeleton = () => (
    <div className='bg-light min-vh-100 py-2 py-md-5'>
        <div className='container px-4 px-md-5'>
            <section className='row g-4 g-lg-5 align-items-start mb-5'>
                <div className='col-12 col-lg-6'>
                    <div className='rounded skeleton' style={{ width: '100%', height: 380 }} />
                </div>
                <div className='col-12 col-lg-6 d-flex flex-column justify-content-start pt-lg-4'>
                    <div className='d-flex justify-content-between mb-3'>
                        <div className='skeleton rounded' style={{ width: 80, height: 16 }} />
                        <div className='skeleton rounded' style={{ width: 60, height: 16 }} />
                    </div>
                    <div className='skeleton rounded mb-3' style={{ width: '85%', height: 48 }} />
                    <div className='skeleton rounded mb-2' style={{ width: '100%', height: 24 }} />
                    <div className='skeleton rounded mb-2' style={{ width: '90%', height: 24 }} />
                    <div className='skeleton rounded' style={{ width: '70%', height: 24 }} />
                </div>
            </section>

            <hr className='border-dark opacity-50 my-4 my-md-5' />

            <section className='row'>
                <aside className='col-12 col-lg-3 mb-4 mb-lg-0'>
                    <div className='border-start ps-3'>
                        <div className='skeleton rounded mb-2' style={{ width: 120, height: 16 }} />
                        <div className='skeleton rounded mb-4' style={{ width: 160, height: 16 }} />
                        <div className='skeleton rounded mb-4' style={{ width: 140, height: 16 }} />
                        <div className='d-flex gap-3'>
                            {[0, 1, 2, 3].map(i => (
                                <div key={i} className='skeleton rounded-circle' style={{ width: 36, height: 36 }} />
                            ))}
                        </div>
                    </div>
                </aside>
                <article className='col-12 col-lg-7 offset-lg-1'>
                    {[100, 95, 90, 85, 100, 80, 92].map((w, i) => (
                        <div key={i} className='skeleton rounded mb-3' style={{ width: `${w}%`, height: 20 }} />
                    ))}
                </article>
            </section>
        </div>
    </div>
);
