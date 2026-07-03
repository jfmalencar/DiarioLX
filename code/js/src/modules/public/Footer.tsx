import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

import escsLogo from '@/assets/escs_logo.png';
import iplLogo from '@/assets/ipl_logo.png';
import liacomLogo from '@/assets/liacom_logo.png';
import logo from '@/assets/logo.svg';
import { useBootstrap } from '@/shared/hooks/useBootstrap';

type FooterLink = { label: string; to: string };

// Renders any logo as solid white so the institutional marks read on the dark background.
const whiteLogo = { filter: 'brightness(0) invert(1)' } as const;

const chunk = <T,>(items: T[], size: number): T[][] => {
    const columns: T[][] = [];
    for (let i = 0; i < items.length; i += size) {
        columns.push(items.slice(i, i + size));
    }
    return columns;
};

export const Footer = () => {
    const { settings } = useBootstrap();
    const { social, contact, publication, navigation } = settings;

    const categoryLinks: FooterLink[] = [...navigation.featured, ...navigation.sections].map((cat) => ({
        label: cat.name,
        to: `/category/${cat.slug}`,
    }));

    const mediaLinks: FooterLink[] = [
        navigation.showPhotos && { label: 'Fotografia', to: '/photo-essays' },
        navigation.showPodcasts && { label: 'Podcasts', to: '/podcasts' },
        navigation.showVideos && { label: 'Vídeos', to: '/videos' },
    ].filter(Boolean) as FooterLink[];

    const identityLinks: FooterLink[] = [
        { label: 'Quem Somos', to: '/team' },
        { label: 'Estatuto Editorial', to: '/estatuto-editorial' },
        { label: 'Código Deontológico', to: '/codigo-deontologico' },
    ];

    const pages: FooterLink[] = [
        { label: 'Página Inicial', to: '/' },
        ...categoryLinks,
        ...mediaLinks,
        ...identityLinks,
    ];

    const columns = chunk(pages, 5);

    const redacao = [contact.address.replace(/\n/g, ' ').trim(), contact.email]
        .filter(Boolean)
        .join(' - ');

    return (
        <footer data-testid='site-footer' className='bg-dark text-white py-5'>
            <div className='container'>
                <div className='d-flex justify-content-center mb-5'>
                    <img src={logo} alt='DiárioLX' style={{ width: 190 }} />
                </div>

                <div className='mb-4'>
                    <h6 className='fw-bold mb-4' style={{ letterSpacing: '0.08em' }}>
                        PÁGINAS
                    </h6>
                    <div className='row gy-3'>
                        {columns.map((column, index) => (
                            <div className='col-6 col-md-4 col-lg' key={index}>
                                {column.map((item) => (
                                    <Link
                                        key={item.label}
                                        to={item.to}
                                        className='d-block text-white text-decoration-none mb-2'
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                <hr className='border-light opacity-25 my-4' />

                <div className='text-center mb-4' style={{ fontSize: '0.9rem', lineHeight: 1.9 }}>
                    {publication.erc && (
                        <span className='mx-2'>
                            <strong>REGISTO ERC Nº</strong> {publication.erc}
                        </span>
                    )}
                    {publication.periodicity && (
                        <span className='mx-2'>
                            <strong>PERIODICIDADE</strong> {publication.periodicity}
                        </span>
                    )}
                    {publication.owner && (
                        <span className='mx-2'>
                            <strong>PROPRIETÁRIO</strong> {publication.owner}
                        </span>
                    )}
                    {publication.nipc && (
                        <span className='mx-2'>
                            <strong>NÚMERO DE REGISTO DE PESSOA COLETIVA</strong> {publication.nipc}
                        </span>
                    )}
                    {redacao && (
                        <span className='mx-2'>
                            <strong>REDACÇÃO</strong> {redacao}
                        </span>
                    )}
                </div>

                <hr className='border-light opacity-25 my-4' />

                <div className='d-flex flex-wrap align-items-center justify-content-between gap-4'>
                    <img src={liacomLogo} alt='LIACOM' style={{ height: 22, ...whiteLogo }} />
                    <div style={{ fontSize: '0.85rem', lineHeight: 1.3, maxWidth: 170 }}>
                        Laboratório de Tendências em Jornalismo
                    </div>
                    <img src={escsLogo} alt='Escola Superior de Comunicação Social' style={{ height: 34, ...whiteLogo }} />
                    <img src={iplLogo} alt='Politécnico de Lisboa' style={{ height: 38, ...whiteLogo }} />
                    <div className='vr d-none d-md-block opacity-25' />
                    <div className='d-flex gap-2'>
                        {[
                            { href: social.twitter, label: 'Twitter', Icon: Twitter },
                            { href: social.facebook, label: 'Facebook', Icon: Facebook },
                            { href: social.instagram, label: 'Instagram', Icon: Instagram },
                        ].map(({ href, label, Icon }) => (
                            <a
                                key={label}
                                href={href || '#'}
                                aria-label={label}
                                target='_blank'
                                rel='noreferrer'
                                className='d-inline-flex align-items-center justify-content-center rounded-circle bg-white text-dark'
                                style={{ width: 30, height: 30 }}
                            >
                                <Icon size={15} />
                            </a>
                        ))}
                    </div>
                </div>

                <hr className='border-light opacity-25 my-4' />

                <div className='d-flex flex-column flex-md-row justify-content-center align-items-center gap-2 gap-md-4 small'>
                    <span>© Copyright {new Date().getFullYear()} · DiárioLX</span>
                    <div className='vr d-none d-md-block opacity-25' />
                    <span>
                        Website desenvolvido por <span className='text-decoration-underline'>Alexandra Centeno</span>{' '}
                        (Web design), <span className='text-decoration-underline'>Jessé Alencar</span> e{' '}
                        <span className='text-decoration-underline'>Julianne Lobato</span> (Desenvolvimento web)
                    </span>
                </div>
            </div>
        </footer>
    );
};
