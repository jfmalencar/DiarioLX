import { useMemo } from 'react'

import { useBootstrap } from '@/shared/hooks/useBootstrap';

import type { ContentsService, ContentsResponse, ContentResponse, NewContentResponse, ContentHistory, ResourceContentsResponse, TagResource, CategoryResource } from './contents.types';
import { useApi } from '../http/client';

export const useContentsApiService = (): ContentsService => {
  const { get, post, put, remove } = useApi()
  const { endpoints } = useBootstrap()

  return useMemo<ContentsService>(() => ({
    async fetchAll(params) {
      const result = await get<ContentsResponse>(`${endpoints.backoffice.contents.internalList.href}?${new URLSearchParams(params as Record<string, string>)}`);
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch contents');
      }
      return result.data;
    },

    async fetchPublicContents(params) {
      const result = await get<ContentsResponse>(`${endpoints.guest.listContent.href}?${new URLSearchParams(params as Record<string, string>)}`);
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch contents');
      }
      return result.data;
    },

    async fetchTag(slug, params) {
      const url = `${endpoints.guest.tag.href.replace('{slug}', slug)}?${new URLSearchParams(params as Record<string, string>)}`;
      const result = await get<ResourceContentsResponse<TagResource>>(url);
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch tag');
      }
      return result.data;
    },

    async fetchCategory(slug, params) {
      const url = `${endpoints.guest.category.href.replace('{slug}', slug)}?${new URLSearchParams(params as Record<string, string>)}`;
      const result = await get<ResourceContentsResponse<CategoryResource>>(url);
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch category');
      }
      return result.data;
    },

    async fetchById(id) {
      const result = await get<ContentResponse>(endpoints.backoffice.contents.internalGetById.href.replace('{id}', id.toString()));
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch content');
      }
      return result.data;
    },

    async fetchBySlug(slug) {
      const result = await get<ContentResponse>(endpoints.guest.getContent.href.replace('{slug}', slug));
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch content');
      }
      return result.data;
    },

    async fetchHistoryById(id) {
      const result = await get<ContentHistory>(endpoints.backoffice.contents.internalGetHistory.href.replace('{id}', id.toString()));
      if (!result.success) {
        throw new Error('Failed to fetch content history');
      }
      return result.data;
    },

    async create(content) {
      const request = {
        type: content.type
      };

      const result = await post<NewContentResponse>(endpoints.backoffice.contents.create.href, request);
      if (!result.success) {
        throw new Error(result.error || 'Failed to create content');
      }
      return result.data
    },

    async update(id, content) {
      const request = {
        id,
        title: content.title,
        headline: content.headline,
        featuredMediaId: content.featuredMediaId,
        slug: content.slug,
        categoryId: content.categoryId,
        parentId: content.parentId,
        embedUrl: content.embedUrl,
        authors: content.authors.map((author) => ({
          authorId: typeof author.authorId === 'string' ? parseInt(author.authorId) : author.authorId,
        })),
        tags: content.tags.map((tag) => ({
          tagId: typeof tag.tagId === 'string' ? parseInt(tag.tagId) : tag.tagId,
        })),
        blocks: content.blocks.map(block => {
          if (block.type === 'MEDIA') {
            return {
              type: block.type,
              mediaId: block.media.id,
              caption: block.caption,
              position: block.position
            }
          }
          if (block.type === 'GALLERY') {
            return {
              type: block.type,
              position: block.position,
              images: block.images.map((image) => ({
                mediaId: image.media.id,
                caption: image.caption,
              })),
            }
          }
          return {
            type: block.type,
            content: block.content,
            position: block.position
          }
        })
      };
      const result = await put(endpoints.backoffice.contents.update.href, request);
      if (!result.success) {
        throw new Error(result.error || 'Failed to update content');
      }
    },

    async submit(id) {
      const result = await post(endpoints.backoffice.contents.submit.href.replace('{id}', id.toString()), {});
      if (!result.success) {
        throw new Error('Failed to submit content');
      }
    },

    async publish(id, comment, publishedAt) {
      const body = comment || publishedAt !== undefined ? { comment, publishedAt } : null;
      const result = await post(endpoints.backoffice.contents.publish.href.replace('{id}', id.toString()), body);
      if (!result.success) {
        throw new Error(result.error || 'Failed to publish content');
      }
    },

    async reject(id, comment) {
      const result = await post(endpoints.backoffice.contents.reject.href.replace('{id}', id.toString()), comment ? { comment } : null);
      if (!result.success) {
        throw new Error(result.error || 'Failed to reject content');
      }
    },

    async delete(id) {
      const result = await remove(endpoints.backoffice.contents.delete.href.replace('{id}', id.toString()), {});
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete content');
      }
    },

    async archive(id) {
      const result = await post(endpoints.backoffice.contents.archive.href.replace('{id}', id.toString()), {});
      if (!result.success) {
        throw new Error(result.error || 'Failed to archive content');
      }
    },

    async unarchive(id) {
      const result = await post(endpoints.backoffice.contents.unarchive.href.replace('{id}', id.toString()), {});
      if (!result.success) {
        throw new Error(result.error || 'Failed to unarchive content');
      }
    }
  }), [get, post, put, remove, endpoints])
};
