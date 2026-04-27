import type { ArticlesService, ArticlesResponse, ArticleResponse } from './articles.types';
import { get, post, put, remove } from '../http/client';

export const articlesApiService: ArticlesService = {

  async fetchAll(params) {
    const result = await get<ArticlesResponse>('/api/articles?' + new URLSearchParams(params as Record<string, string>).toString());
    if (!result.success) {
      throw new Error('Failed to fetch articles');
    }
    return result.data;
  },

  async fetchOne(slug) {
    const result = await get<ArticleResponse>(`/api/articles/slug/${slug}`);
    if (!result.success) {
      throw new Error('Failed to fetch article');
    }
    return result.data;
  },

  async create(article) {
    const request = {
      title: article.title,
      headline: article.headline,
      slug: article.slug,
      featuredMediaId: article.featuredMediaId,
      categoryId: article.category.id,
      authors: article.authors.map((author) => ({
        authorId: author.authorId,
      })),
      tags: article.tags.map((tag) => ({
        tagId: tag.tagId,
      })),
      blocks: article.blocks.map(block => {
        if (block.type === 'text' || block.type === 'quote') {
          return {
            type: block.type,
            content: block.content,
            position: block.position
          }
        }
        return {
          type: block.type,
          mediaId: block.media.id,
          caption: block.caption,
          position: block.position
        }
      })
    };

    const result = await post<string>('/api/articles', request);
    if (!result.success) {
      throw new Error('Failed to create article');
    }
    return result.data;
  },

  async update(id, article) {
    const result = await put(`/api/articles/${id}`, article);
    if (!result.success) {
      throw new Error('Failed to update article');
    }
  },

  async delete(id) {
    const result = await remove(`/api/articles/${id}/delete`, {});
    if (!result.success) {
      throw new Error('Failed to delete article');
    }
  },

  async archive(id) {
    const result = await post(`/api/articles/${id}/archive`, {});
    if (!result.success) {
      throw new Error('Failed to archive article');
    }
  },

  async unarchive(id) {
    const result = await post(`/api/articles/${id}/unarchive`, {});
    if (!result.success) {
      throw new Error('Failed to unarchive article');
    }
  },
};
