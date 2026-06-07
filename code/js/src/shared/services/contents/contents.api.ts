import { useMemo } from 'react'

import { useBootstrap } from '@/shared/hooks/useBootstrap';

import type { ContentsService, ContentsResponse, ContentResponse, NewContentResponse } from './contents.types';
import { useApi } from '../http/client';

export const useContentsApiService = (): ContentsService => {
  const { get, post, put, remove } = useApi()
  const { endpoints } = useBootstrap()

  return useMemo<ContentsService>(() => ({
    async fetchAll(params) {
      const result = await get<ContentsResponse>(`${endpoints.backoffice.contents.internalList.href}?${new URLSearchParams(params as Record<string, string>)}`);
      if (!result.success) {
        throw new Error('Failed to fetch contents');
      }
      return result.data;
    },

    async fetchPublished(params) {
      const result = await get<ContentsResponse>(`${endpoints.backoffice.contents.list.href}?${new URLSearchParams(params as Record<string, string>)}`);
      if (!result.success) {
        throw new Error('Failed to fetch contents');
      }
      return result.data;
    },

    async fetchById(id) {
      const result = await get<ContentResponse>(endpoints.backoffice.contents.internalGetById.href.replace('{id}', id.toString()));
      if (!result.success) {
        throw new Error('Failed to fetch content');
      }
      return result.data;
    },

    async fetchBySlug(slug) {
      const result = await get<ContentResponse>(endpoints.guest.getContent.href.replace('{slug}', slug));
      if (!result.success) {
        throw new Error('Failed to fetch content');
      }
      return result.data;
    },

    async create(content) {
      const request = {
        type: content.type
      };

      const result = await post<NewContentResponse>(endpoints.backoffice.contents.create.href, request);
      if (!result.success) {
        throw new Error('Failed to create content');
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
        authors: content.authors.map((author) => ({
          authorId: typeof author.authorId === 'string' ? parseInt(author.authorId) : author.authorId,
        })),
        tags: content.tags.map((tag) => ({
          tagId: typeof tag.tagId === 'string' ? parseInt(tag.tagId) : tag.tagId,
        })),
        blocks: content.blocks.map(block => {
          if (block.type === 'IMAGE') {
            return {
              type: block.type,
              mediaId: block.media.id,
              caption: block.caption,
              position: block.position
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
        throw new Error('Failed to update content');
      }
    },

    async submit(id) {
      const result = await post(endpoints.backoffice.contents.submit.href.replace('{id}', id.toString()), {});
      if (!result.success) {
        throw new Error('Failed to publish content');
      }
    },

    async publish(id) {
      const result = await post(endpoints.backoffice.contents.publish.href.replace('{id}', id.toString()), {});
      if (!result.success) {
        throw new Error('Failed to publish content');
      }
    },

    async delete(id) {
      const result = await remove(endpoints.backoffice.contents.delete.href.replace('{id}', id.toString()), {});
      if (!result.success) {
        throw new Error('Failed to delete content');
      }
    },

    async archive(id) {
      const result = await post(endpoints.backoffice.contents.archive.href.replace('{id}', id.toString()), {});
      if (!result.success) {
        throw new Error('Failed to archive content');
      }
    }
  }), [get, post, put, remove, endpoints])
};
