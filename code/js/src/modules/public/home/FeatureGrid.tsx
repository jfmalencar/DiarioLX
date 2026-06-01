import type { Article } from './Home';

import { ArticleCard } from './ArticleCard';

type Props = {
    articles: Article[];
}

export const FeaturedGrid = ({ articles }: Props) => (
    <div className='container-xl py-4'>
        <div className='row g-3'>
            {articles.slice(0, 3).map((a) => (
                <div key={a.id} className='col-12 col-sm-6 col-md-4'>
                    <ArticleCard article={a} variant='vertical' />
                </div>
            ))}
        </div>
    </div>
);
