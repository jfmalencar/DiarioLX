import { Facebook, Instagram, Twitter } from 'lucide-react';

import logo from '@/assets/logo.svg';

export const Footer = () => {
    return (
        <footer className='bg-dark text-white py-5'>
            <div className='container'>
                <div className='d-flex justify-content-center mb-5'>
                    <img src={logo} alt='DiárioLX' style={{ width: 190 }} />
                </div>
                <div className='mb-4'>
                    <h6 className='fw-bold mb-4'>PÁGINAS</h6>
                    <div className='row gy-3'>
                        {[
                            ['Página Inicial', 'Lisboa, Cidade Aberta', 'A Fundo', 'Secções', 'Política'],
                            ['Sociedade', 'Educação', 'Saúde', 'Habitação', 'Justiça'],
                            ['Ambiente', 'Cultura', 'Media', 'Cartaz', 'Entrevistas'],
                            ['Reportagens', 'Crítica', 'Desporto', 'Fotografia', 'Podcasts'],
                            ['Vídeo', 'Especiais Sem Limites', 'Identidade', 'Quem Somos', 'Estatuto Editorial'],
                            ['Código Ético e Deontológico do Jornalista'],
                        ].map((column, index) => (
                            <div className='col-6 col-md-4 col-lg-2' key={index}>
                                {column.map((item) => (
                                    <a
                                        key={item}
                                        href='#'
                                        className='d-block text-white text-decoration-none mb-2'
                                    >
                                        {item}
                                    </a>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <hr className='border-light opacity-75 my-4' />
                <div className='d-flex flex-wrap align-items-center justify-content-between gap-4'>
                    <div style={{ fontSize: '0.9rem' }}>
                        <strong>diariolx@escs.ipl.pt</strong>
                        <br />
                        Campus de Benfica do IPL
                        <br />
                        1549-014 Lisboa
                    </div>
                    <div className='vr d-none d-md-block' />
                    <div className='fw-semibold'>LIACOM</div>
                    <div>Laboratório de Tendências em Jornalismo</div>
                    <div>ESCOLA SUPERIOR DE COMUNICAÇÃO SOCIAL</div>
                    <div>POLITÉCNICO DE LISBOA</div>
                    <div className='vr d-none d-md-block' />
                    <div className='d-flex gap-3'>
                        <a className='text-white' href='#' aria-label='Twitter'>
                            <Twitter size={20} />
                        </a>
                        <a className='text-white' href='#' aria-label='Facebook'>
                            <Facebook size={20} />
                        </a>
                        <a className='text-white' href='#' aria-label='Instagram'>
                            <Instagram size={20} />
                        </a>
                    </div>
                </div>
                <hr className='border-light opacity-75 my-4' />
                <div className='d-flex flex-column flex-md-row justify-content-center align-items-center gap-4 small fw-semibold'>
                    <span>© Copyright 2026 · DiárioLX</span>
                </div>
            </div>
        </footer>
    );
};
