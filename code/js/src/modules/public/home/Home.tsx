import React from 'react';

import { useHomepage } from '@/shared/hooks/useHomepage';
import type { HomepageSection } from '@/shared/services/homepage/homepage.types';
import { HeroArticle } from '@/shared/components/HeroArticle';

import { FeaturedGrid } from './FeatureGrid';
import { Latest } from './Latest'
import { PrimarySection } from './PrimarySection';
import { CategoryRow } from './Category'
import { SecondarySection } from './SecondarySection';
import { ThreeColSection } from './ThreeColSection';
import { TeamSection } from './TeamSection';
import { HomeSkeleton } from './HomeSkeleton';

import './Home.css'

export const Home = () => {
    const { data, loading } = useHomepage();

    if (loading && !data) {
        return <HomeSkeleton />;
    }
    if (!data) {
        return (
            <div className='container-xl py-5 text-center text-muted'>
                Não foi possível carregar a página inicial.
            </div>
        );
    }

    const categorySections = data.sections.filter((s) => s.type === 'CATEGORY');

    const renderCategorySection = (section: HomepageSection) => {
        const title = section.category?.name ?? '';
        const href = section.category ? `/category/${section.category.slug}` : '#';
        switch (categorySections.indexOf(section)) {
            case 0:
                return <PrimarySection title={title} contents={section.contents} verTodasHref={href} />;
            case 1:
                return <SecondarySection title={title} contents={section.contents} href={href} />;
            default:
                return <ThreeColSection title={title} contents={section.contents} href={href} />;
        }
    };

    const renderSection = (section: HomepageSection) => {
        if (section.contents.length === 0) return null;

        switch (section.type) {
            case 'HIGHLIGHT': {
                const [main] = section.contents;
                return main ? <HeroArticle content={main} /> : null;
            }
            case 'FEATURED':
                return <FeaturedGrid contents={section.contents} />;
            case 'CATEGORY':
                return renderCategorySection(section);
            case 'CATEGORY_ROW':
                return <CategoryRow contents={section.contents} />;
            case 'PHOTOS':
                return <ThreeColSection title='Fotografia' contents={section.contents} href='#' />;
            case 'PODCASTS':
                return <ThreeColSection title='Podcasts' contents={section.contents} href='#' />;
            case 'VIDEOS':
                return <ThreeColSection title='Vídeos' contents={section.contents} href='#' />;
            default:
                return null;
        }
    };

    return (
        <>
            {data.sections.map((section, i) => (
                <React.Fragment key={`${section.type}-${i}`}>
                    {renderSection(section)}
                    {i === 1 && data.latestArticles.length > 0 && (
                        <Latest contents={data.latestArticles} />
                    )}
                </React.Fragment>
            ))}
            <TeamSection />
        </>
    );
};
