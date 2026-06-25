'use client';

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Lottie, { type LottieRefCurrentProps } from 'lottie-react';

import logo from '@/assets/logo.json';
import { useBootstrap } from '@/shared/hooks/useBootstrap';
import { usePageThemeState } from '@/shared/hooks/usePageTheme';

export const Header = () => {
    const [isShrunk, setIsShrunk] = useState(false);
    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const { settings } = useBootstrap();
    const nav = settings.navigation;
    const { theme } = usePageThemeState();
    const dark = theme === 'dark';
    const navLinkClass = `text-decoration-none fw-medium ${dark ? 'text-white' : 'text-dark'}`;

    useEffect(() => {
        const handleScroll = () => {
            setIsShrunk(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            lottieRef.current?.stop();
            if (isShrunk) {
                lottieRef.current?.setDirection(1);
            } else {
                lottieRef.current?.setDirection(-1);
            }
            lottieRef.current?.play();
        }, 300);

        return () => clearTimeout(timeout);
    }, [isShrunk]);

    return (
        <header
            className={`fixed-top ${dark ? 'bg-black' : 'bg-white border-bottom'}`}
            style={{
                height: isShrunk ? 75 : 130,
                transition: 'height 300ms ease, background-color 300ms ease',
                zIndex: 1000,
            }}
        >
            <div className='container h-100'>
                <div className='d-flex flex-column align-items-center justify-content-center h-100'>
                    <Link
                        to='/'
                        style={{
                            width: isShrunk ? 95 : 135,
                            transition: 'width 300ms ease',
                            filter: dark ? 'none' : 'invert(1)'
                        }}
                    >
                        <Lottie
                            lottieRef={lottieRef}
                            animationData={logo}
                            autoplay={false}
                            loop={false}
                        />
                    </Link>
                    <nav
                        className='d-flex justify-content-center align-items-center gap-4'
                        style={{
                            height: isShrunk ? 0 : 44,
                            opacity: isShrunk ? 0 : 1,
                            overflow: isShrunk ? 'hidden' : 'visible',
                            transition: 'height 300ms ease, opacity 200ms ease',
                            pointerEvents: isShrunk ? 'none' : 'auto',
                        }}
                    >
                        {nav.featured.map((cat) => (
                            <Link key={cat.slug} className={navLinkClass} to={`/category/${cat.slug}`}>
                                {cat.name}
                            </Link>
                        ))}

                        {nav.sections.length > 0 && (
                            <div className='dropdown'>
                                <a
                                    className={`${navLinkClass} dropdown-toggle d-flex align-items-center gap-1`}
                                    href='#'
                                    role='button'
                                    data-bs-toggle='dropdown'
                                    aria-expanded='false'
                                >
                                    Secções
                                </a>
                                <ul className='dropdown-menu'>
                                    {nav.sections.map((cat) => (
                                        <li key={cat.slug}>
                                            <Link className='dropdown-item' to={`/category/${cat.slug}`}>
                                                {cat.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {nav.showPhotos && (
                            <Link className={navLinkClass} to='/fotografia'>
                                Fotografia
                            </Link>
                        )}
                        {nav.showPodcasts && (
                            <Link className={navLinkClass} to='/podcasts'>
                                Podcasts
                            </Link>
                        )}
                        {nav.showVideos && (
                            <Link className={navLinkClass} to='/videos'>
                                Vídeos
                            </Link>
                        )}

                        <div className='dropdown'>
                            <a
                                className={`${navLinkClass} dropdown-toggle d-flex align-items-center gap-1`}
                                href='#'
                                role='button'
                                data-bs-toggle='dropdown'
                                aria-expanded='false'
                            >
                                Identidade
                            </a>
                            <ul className='dropdown-menu'>
                                <li>
                                    <Link className='dropdown-item' to='/team'>Equipa</Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
};