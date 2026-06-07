import { useMemo } from 'react'

import { useBootstrap } from '@/shared/hooks/useBootstrap';

import type { ContentsService, ContentsResponse, ContentResponse } from './contents.types';
import { useApi } from '../http/client';

export const useContentsApiService = (): ContentsService => {
  const { get, post, put, remove } = useApi()
  const { endpoints } = useBootstrap()

  return useMemo<ContentsService>(() => ({
    async fetchAll(params) {
      const result = await get<ContentsResponse>(`${endpoints.contents.list.href}?${new URLSearchParams(params as Record<string, string>)}`);
      if (!result.success) {
        throw new Error('Failed to fetch contents');
      }
      return result.data;
    },

    async fetchPublished(params) {
      const result = await get<ContentsResponse>(`${endpoints.contents.list.href}?${new URLSearchParams(params as Record<string, string>)}`);
      if (!result.success) {
        throw new Error('Failed to fetch contents');
      }
      return result.data;
    },

    async fetchOne(slug) {
      const result = await get<ContentResponse>(endpoints.contents.get.href.replace('{slug}', slug));
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

      const result = await post<string>(endpoints.contents.create.href, request);
      if (!result.success) {
        throw new Error('Failed to create content');
      }
      return result.data;
    },

    async update(id, content) {
      const result = await put(endpoints.contents.update.href.replace('{id}', id), content);
      if (!result.success) {
        throw new Error('Failed to update content');
      }
    },

    async delete(id) {
      const result = await remove(endpoints.contents.delete.href.replace('{id}', id), {});
      if (!result.success) {
        throw new Error('Failed to delete content');
      }
    },

    async archive(id) {
      const result = await post(endpoints.contents.archive.href.replace('{id}', id), {});
      if (!result.success) {
        throw new Error('Failed to archive content');
      }
    },

    async unarchive(id) {
      const result = await post(endpoints.contents.unarchive.href.replace('{id}', id), {});
      if (!result.success) {
        throw new Error('Failed to unarchive content');
      }
    }
  }), [get, post, put, remove, endpoints])
};
