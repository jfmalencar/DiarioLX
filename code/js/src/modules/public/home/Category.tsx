import type { Article } from "./Home";
import { ArticleCard } from "./ArticleCard";

type ColProps = {
    title: string;
    href?: string;
    article: Article;
}

type RowProps = {
    categories: Array<{
        title: string;
        href?: string;
        article: Article;
    }>;
}

export const CategoryRow = ({ categories }: RowProps) => (
    <div className='container-xl py-4'>
        <div className='row g-4'>
            {categories.map((cat) => (
                <div key={cat.title} className='col-6 col-md-3'>
                    <CategoryColumn
                        title={cat.title}
                        href={cat.href}
                        article={cat.article}
                    />
                </div>
            ))}
        </div>
    </div>
);

const CategoryColumn = ({ title, href = '#', article }: ColProps) => (
    <div>
        <div className='d-flex align-items-baseline justify-content-between border-bottom border-2 border-dark pb-1 mb-2'>
            <h3
                className='mb-0 fw-bold'
                style={{
                    fontSize: '0.95rem',
                }}
            >
                {title}
            </h3>
            <a
                href={href}
                className='text-muted text-decoration-none'
                style={{ fontSize: '0.65rem' }}
            >
                Ver todas →
            </a>
        </div>
        <ArticleCard article={article} variant='vertical' />
    </div>
);
