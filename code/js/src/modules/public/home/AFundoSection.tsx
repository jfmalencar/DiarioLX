import type { Article } from "./Home";
import { SectionHeader } from './SectionHeader'
import { ArticleCard } from "./ArticleCard";

type Props = {
    articles: Article[];
}

export const AFundoSection = ({ articles }: Props) => {
    const [main, ...rest] = articles;
    return (
        <div className='container-xl py-4'>
            <SectionHeader title='A Fundo' />
            <div className='row g-3'>
                {main && (
                    <div className='col-12 col-md-6'>
                        <ArticleCard article={main} variant='vertical' showExcerpt />
                    </div>
                )}
                <div className='col-12 col-md-6'>
                    {rest.slice(0, 4).map((a) => (
                        <ArticleCard key={a.id} article={a} variant='horizontal' />
                    ))}
                </div>
            </div>
        </div>
    );
};
