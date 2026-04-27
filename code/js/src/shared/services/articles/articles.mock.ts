import type { ArticlesService, Article } from './articles.types';

const fakeArticles: Article[] = [
  {
    id: '1',
    title: 'Article 1',
    slug: 'article-1',
    headline: 'Description 1',
    blocks: [],
    featuredImage: null,
    category: {
      id: '1',
      name: 'Category 1',
      slug: 'category-1',
    },
    authors: [
      {
        authorId: '1',
        name: 'Author 1',
        slug: 'author-1',
      },
    ],
    tags: [
      {
        tagId: '1',
        name: 'Tag 1',
        slug: 'tag-1',
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    publishedAt: '2024-01-02T00:00:00Z',
    archivedAt: null,
  }
]

export const articlesMockService: ArticlesService = {
  async fetchAll() {
    return {
      articles: fakeArticles,
    };
  },

  async fetchOne(id) {
    const article = fakeArticles.find((art) => art.id === id);
    if (!article) {
      throw new Error('Article not found');
    }
    return { article };
  },

  async create(article) {
    const newArticle = {
      ...article,
      id: String(fakeArticles.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: null,
      archivedAt: null,
      featuredImage: null,
    };
    await new Promise((resolve) => setTimeout(resolve, 2000));
    fakeArticles.push(newArticle);
    return newArticle.id;
  },

  async update(id, article) {
    const index = fakeArticles.findIndex((art) => art.id === id);
    if (index === -1) {
      throw new Error('Article not found');
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
    fakeArticles[index] = {
      ...fakeArticles[index],
      ...article,
      updatedAt: new Date().toISOString(),
    };
  },

  async delete(id) {
    const index = fakeArticles.findIndex((art) => art.id === id);
    if (index === -1) {
      throw new Error('Article not found');
    }
    fakeArticles.splice(index, 1);
  },

  async archive(id) {
    const index = fakeArticles.findIndex((art) => art.id === id);
    if (index === -1) {
      throw new Error('Article not found');
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
    fakeArticles[index] = {
      ...fakeArticles[index],
      archivedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  async unarchive(id) {
    const index = fakeArticles.findIndex((art) => art.id === id);
    if (index === -1) {
      throw new Error('Article not found');
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
    fakeArticles[index] = {
      ...fakeArticles[index],
      archivedAt: null,
      updatedAt: new Date().toISOString(),
    };
  }
};
