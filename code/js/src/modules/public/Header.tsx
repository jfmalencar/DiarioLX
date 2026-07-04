'use client';

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import Lottie, { type LottieRefCurrentProps } from 'lottie-react';

import logo from '@/assets/logo.json';
import { useBootstrap } from '@/shared/hooks/useBootstrap';
import { usePageThemeState } from '@/shared/hooks/usePageTheme';

type OpenMenu = 'sections' | 'identidade' | null;

const IDENTITY_LINKS = [
    { label: 'Quem Somos', to: '/team' },
    { label: 'Estatuto Editorial', to: '/estatuto-editorial' },
    { label: 'Código Deontológico', to: '/codigo-deontologico' },
];

export const Header = () => {
    const [isShrunk, setIsShrunk] = useState(false);
    const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
    const [activeSlug, setActiveSlug] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const { settings } = useBootstrap();
    const nav = settings.navigation;
    const { theme } = usePageThemeState();
    const dark = theme === 'dark';
    const navLinkClass = `text-decoration-none fw-medium ${dark ? 'text-white' : 'text-dark'}`;
    const textClass = dark ? 'text-white' : 'text-dark';

    const defaultSectionSlug = nav.sections.find((s) => s.children && s.children.length > 0)?.slug ?? nav.sections[0]?.slug ?? null;
    const openSections = () => { setOpenMenu('sections'); setActiveSlug(defaultSectionSlug); };
    const openIdentidade = () => setOpenMenu('identidade');
    const closeMenu = () => setOpenMenu(null);
    const activeChildren = nav.sections.find((s) => s.slug === activeSlug)?.children ?? [];
    const closeMobile = () => { setMobileOpen(false); setMobileAccordion(null); };
    const toggleAccordion = (key: string) => setMobileAccordion((cur) => (cur === key ? null : key));

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

    const dividerColor = dark ? '#333' : '#dee2e6';
    const panelBg = dark ? 'bg-black' : 'bg-white';
    const panelStyle = {
        top: '100%',
        borderTop: `1px solid ${dividerColor}`,
        boxShadow: '0 14px 28px rgba(0, 0, 0, 0.08)',
    } as const;

    const triggerStyle = (active: boolean) =>
        ({
            cursor: 'pointer',
            textUnderlineOffset: 6,
            textDecoration: active ? 'underline' : 'none',
        }) as const;

    return (
        <header
            data-testid='site-header'
            className={`fixed-top ${dark ? 'bg-black' : 'bg-white border-bottom'}`}
            style={{
                height: isShrunk ? 75 : 130,
                transition: 'height 300ms ease, background-color 300ms ease',
                zIndex: 1000,
            }}
            onMouseLeave={closeMenu}
        >
            <div className='container h-100 position-relative'>
                <div className='d-flex flex-column align-items-center justify-content-center h-100'>
                    <Link
                        to='/'
                        onMouseEnter={closeMenu}
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
                        className='d-none d-lg-flex justify-content-center align-items-center gap-4'
                        style={{
                            height: isShrunk ? 0 : 44,
                            opacity: isShrunk ? 0 : 1,
                            overflow: isShrunk ? 'hidden' : 'visible',
                            transition: 'height 300ms ease, opacity 200ms ease',
                            pointerEvents: isShrunk ? 'none' : 'auto',
                        }}
                    >
                        {nav.featured.map((cat) => (
                            <Link
                                key={cat.slug}
                                className={navLinkClass}
                                to={`/category/${cat.slug}`}
                                onMouseEnter={closeMenu}
                            >
                                {cat.name}
                            </Link>
                        ))}
                        {nav.sections.length > 0 && (
                            <div
                                className={`${navLinkClass} d-flex align-items-center gap-1`}
                                role='button'
                                onMouseEnter={openSections}
                                style={triggerStyle(openMenu === 'sections')}
                            >
                                Secções
                                <span aria-hidden='true' style={{ fontSize: '0.7em' }}>▾</span>
                            </div>
                        )}
                        {nav.showPhotos && (
                            <Link className={navLinkClass} to='/photo-essays' onMouseEnter={closeMenu}>
                                Fotografia
                            </Link>
                        )}
                        {nav.showPodcasts && (
                            <Link className={navLinkClass} to='/podcasts' onMouseEnter={closeMenu}>
                                Podcasts
                            </Link>
                        )}
                        {nav.showVideos && (
                            <Link className={navLinkClass} to='/videos' onMouseEnter={closeMenu}>
                                Vídeos
                            </Link>
                        )}
                        <div
                            className={`${navLinkClass} d-flex align-items-center gap-1`}
                            role='button'
                            onMouseEnter={openIdentidade}
                            style={triggerStyle(openMenu === 'identidade')}
                        >
                            Identidade
                            <span aria-hidden='true' style={{ fontSize: '0.7em' }}>▾</span>
                        </div>
                    </nav>
                </div>
                <button
                    type='button'
                    aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
                    aria-expanded={mobileOpen}
                    onClick={() => setMobileOpen((o) => !o)}
                    className={`d-lg-none btn border-0 p-0 position-absolute top-50 translate-middle-y ${textClass}`}
                    style={{ background: 'transparent' }}
                >
                    {mobileOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
            </div>
            {openMenu === 'sections' && !isShrunk && nav.sections.length > 0 && (
                <div className={`d-none d-lg-block position-absolute start-0 end-0 ${panelBg}`} style={panelStyle}>
                    <div className='container py-4'>
                        <div className='d-flex' style={{ gap: '3rem', minHeight: 240 }}>
                            <div className='d-flex flex-column' style={{ minWidth: 220 }}>
                                {nav.sections.map((s) => {
                                    const hasChildren = !!s.children && s.children.length > 0;
                                    const active = activeSlug === s.slug;
                                    return (
                                        <Link
                                            key={s.slug}
                                            to={`/category/${s.slug}`}
                                            onMouseEnter={() => setActiveSlug(s.slug)}
                                            onClick={closeMenu}
                                            className={`text-decoration-none d-flex align-items-center justify-content-between py-1 ${textClass}`}
                                            style={{
                                                fontSize: '1.5rem',
                                                fontWeight: 500,
                                                opacity: active ? 1 : 0.8,
                                                textDecoration: active ? 'underline' : 'none',
                                                textUnderlineOffset: 6,
                                            }}
                                        >
                                            <span>{s.name}</span>
                                            {hasChildren && <span className='ms-4' style={{ opacity: 0.6 }}>›</span>}
                                        </Link>
                                    );
                                })}
                            </div>
                            {activeChildren.length > 0 && (
                                <>
                                    <div style={{ width: 1, background: dividerColor }} />
                                    <div className='d-flex flex-column'>
                                        {activeChildren.map((c) => (
                                            <Link
                                                key={c.slug}
                                                to={`/category/${c.slug}`}
                                                onClick={closeMenu}
                                                className={`text-decoration-none py-1 ${textClass}`}
                                                style={{ fontSize: '1.25rem', opacity: 0.85 }}
                                            >
                                                {c.name}
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {openMenu === 'identidade' && !isShrunk && (
                <div className={`d-none d-lg-block position-absolute start-0 end-0 ${panelBg}`} style={panelStyle}>
                    <div className='container py-4'>
                        <div className='d-flex flex-column' style={{ minWidth: 220, minHeight: 160 }}>
                            {IDENTITY_LINKS.map((l) => (
                                <Link
                                    key={l.to}
                                    to={l.to}
                                    onClick={closeMenu}
                                    className={`text-decoration-none py-1 ${textClass}`}
                                    style={{ fontSize: '1.5rem', fontWeight: 500, opacity: 0.85, textUnderlineOffset: 6 }}
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {mobileOpen && (
                <div
                    className={`d-lg-none position-absolute start-0 end-0 ${panelBg}`}
                    style={{
                        top: '100%',
                        borderTop: `1px solid ${dividerColor}`,
                        maxHeight: 'calc(100vh - 75px)',
                        overflowY: 'auto',
                        boxShadow: '0 14px 28px rgba(0, 0, 0, 0.12)',
                    }}
                >
                    <div className='container py-2'>
                        {nav.featured.map((cat) => (
                            <Link
                                key={cat.slug}
                                to={`/category/${cat.slug}`}
                                onClick={closeMobile}
                                className={`text-decoration-none d-block py-3 border-bottom ${textClass}`}
                                style={{ borderColor: dividerColor, fontSize: '1.1rem' }}
                            >
                                {cat.name}
                            </Link>
                        ))}
                        {nav.sections.length > 0 && (
                            <div className='border-bottom' style={{ borderColor: dividerColor }}>
                                <button
                                    type='button'
                                    onClick={() => toggleAccordion('sections')}
                                    className={`btn border-0 w-100 d-flex align-items-center justify-content-between py-3 px-0 ${textClass}`}
                                    style={{ background: 'transparent', fontSize: '1.1rem', fontWeight: 500 }}
                                >
                                    Secções
                                    <ChevronDown
                                        size={20}
                                        style={{
                                            transform: mobileAccordion === 'sections' ? 'rotate(180deg)' : 'none',
                                            transition: 'transform 200ms ease',
                                        }}
                                    />
                                </button>
                                {mobileAccordion === 'sections' && (
                                    <div className='pb-2'>
                                        {nav.sections.map((s) => (
                                            <div key={s.slug} className='ps-3'>
                                                <Link
                                                    to={`/category/${s.slug}`}
                                                    onClick={closeMobile}
                                                    className={`text-decoration-none d-block py-2 fw-medium ${textClass}`}
                                                >
                                                    {s.name}
                                                </Link>
                                                {s.children?.map((c) => (
                                                    <Link
                                                        key={c.slug}
                                                        to={`/category/${c.slug}`}
                                                        onClick={closeMobile}
                                                        className={`text-decoration-none d-block py-2 ps-3 ${textClass}`}
                                                        style={{ opacity: 0.8 }}
                                                    >
                                                        {c.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {nav.showPhotos && (
                            <Link to='/photo-essays' onClick={closeMobile} className={`text-decoration-none d-block py-3 border-bottom ${textClass}`} style={{ borderColor: dividerColor, fontSize: '1.1rem' }}>
                                Fotografia
                            </Link>
                        )}
                        {nav.showPodcasts && (
                            <Link to='/podcasts' onClick={closeMobile} className={`text-decoration-none d-block py-3 border-bottom ${textClass}`} style={{ borderColor: dividerColor, fontSize: '1.1rem' }}>
                                Podcasts
                            </Link>
                        )}
                        {nav.showVideos && (
                            <Link to='/videos' onClick={closeMobile} className={`text-decoration-none d-block py-3 border-bottom ${textClass}`} style={{ borderColor: dividerColor, fontSize: '1.1rem' }}>
                                Vídeos
                            </Link>
                        )}
                        <div>
                            <button
                                type='button'
                                onClick={() => toggleAccordion('identidade')}
                                className={`btn border-0 w-100 d-flex align-items-center justify-content-between py-3 px-0 ${textClass}`}
                                style={{ background: 'transparent', fontSize: '1.1rem', fontWeight: 500 }}
                            >
                                Identidade
                                <ChevronDown
                                    size={20}
                                    style={{
                                        transform: mobileAccordion === 'identidade' ? 'rotate(180deg)' : 'none',
                                        transition: 'transform 200ms ease',
                                    }}
                                />
                            </button>
                            {mobileAccordion === 'identidade' && (
                                <div className='ps-3 pb-2'>
                                    {IDENTITY_LINKS.map((l) => (
                                        <Link
                                            key={l.to}
                                            to={l.to}
                                            onClick={closeMobile}
                                            className={`text-decoration-none d-block py-2 ${textClass}`}
                                            style={{ opacity: 0.85 }}
                                        >
                                            {l.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};
