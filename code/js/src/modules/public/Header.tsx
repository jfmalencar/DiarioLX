'use client';

import { useEffect, useRef, useState } from 'react';
import Lottie, { type LottieRefCurrentProps } from 'lottie-react';

import logo from '@/assets/logo.json';

export const Header = () => {
    const [isShrunk, setIsShrunk] = useState(false);
    const lottieRef = useRef<LottieRefCurrentProps>(null);

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
            className='fixed-top bg-white border-bottom'
            style={{
                height: isShrunk ? 75 : 130,
                transition: 'height 300ms ease',
                zIndex: 1000,
            }}
        >
            <div className='container h-100'>
                <div className='d-flex flex-column align-items-center justify-content-center h-100'>
                    <div
                        style={{
                            width: isShrunk ? 95 : 135,
                            transition: 'width 300ms ease',
                            filter: 'invert(1)'
                        }}
                    >
                        <Lottie
                            lottieRef={lottieRef}
                            animationData={logo}
                            autoplay={false}
                            loop={false}
                        />
                    </div>
                    <nav
                        className='d-flex justify-content-center align-items-center gap-4 overflow-hidden'
                        style={{
                            height: isShrunk ? 0 : 44,
                            opacity: isShrunk ? 0 : 1,
                            transition: 'height 300ms ease, opacity 200ms ease',
                            pointerEvents: isShrunk ? 'none' : 'auto',
                        }}
                    >
                        <a className='text-dark text-decoration-none fw-medium' href='#'>
                            Lisboa, Cidade Aberta
                        </a>
                        <a className='text-dark text-decoration-none fw-medium' href='#'>
                            A Fundo
                        </a>
                        <a className='text-dark text-decoration-none d-flex align-items-center gap-1 fw-medium' href='#'>
                            Secções
                        </a>
                        <a className='text-dark text-decoration-none fw-medium' href='#'>
                            Especiais
                        </a>
                        <a className='text-dark text-decoration-none fw-medium' href='#'>
                            Fotografia
                        </a>
                        <a className='text-dark text-decoration-none fw-medium' href='#'>
                            Podcasts
                        </a>
                        <a className='text-dark text-decoration-none fw-medium' href='#'>
                            Vídeos
                        </a>
                        <a className='text-dark text-decoration-none d-flex align-items-center gap-1 fw-medium' href='#'>
                            Identidade
                        </a>
                    </nav>
                </div>
            </div>
        </header>
    );
};