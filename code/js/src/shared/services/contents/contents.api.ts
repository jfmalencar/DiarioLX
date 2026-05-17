import type { ContentsService, ContentsResponse, ContentResponse } from './contents.types';
import { get, post, put, remove } from '../http/client';

export const contentsApiService: ContentsService = {

  async fetchAll(params) {
    const result = await get<ContentsResponse>('/api/contents?' + new URLSearchParams(params as Record<string, string>).toString());
    if (!result.success) {
      throw new Error('Failed to fetch contents');
    }
    return result.data;
  },

  async fetchOne(slug) {
    const result = await get<ContentResponse>(`/api/contents/${slug}`);
    if (!result.success) {
      throw new Error('Failed to fetch content');
    }
    return result.data;
  },

  async create(content) {
    const request = {
      title: content.title,
      headline: content.headline,
      type: content.type,
      slug: content.slug,
      featuredMediaId: content.featuredMediaId,
      categoryId: content.category.id,
      authors: content.authors.map((author) => ({
        authorId: author.authorId,
      })),
      tags: content.tags.map((tag) => ({
        tagId: tag.tagId,
      })),
      blocks: content.blocks.map(block => {
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

    const result = await post<string>('/api/contents', request);
    if (!result.success) {
      throw new Error('Failed to create content');
    }
    return result.data;
  },

  async update(id, content) {
    const result = await put(`/api/contents/${id}`, content);
    if (!result.success) {
      throw new Error('Failed to update content');
    }
  },

  async delete(id) {
    const result = await remove(`/api/contents/${id}/delete`, {});
    if (!result.success) {
      throw new Error('Failed to delete content');
    }
  },

  async archive(id) {
    const result = await post(`/api/contents/${id}/archive`, {});
    if (!result.success) {
      throw new Error('Failed to archive content');
    }
  },

  async unarchive(id) {
    const result = await post(`/api/contents/${id}/unarchive`, {});
    if (!result.success) {
      throw new Error('Failed to unarchive content');
    }
  },
};
