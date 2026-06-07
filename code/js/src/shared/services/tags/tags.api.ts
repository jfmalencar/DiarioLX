import { useMemo } from 'react';

import { useBootstrap } from '@/shared/hooks/useBootstrap';

import type { TagRequest, TagsService, TagsResponse, TagResponse } from './tags.types';
import { useApi } from '../http/client';

export const useTagsApiService = (): TagsService => {
  const { get, post, put, remove } = useApi()
  const { endpoints } = useBootstrap()

  return useMemo<TagsService>(() => ({
    async fetchAll(params) {
      const result = await get<TagsResponse>(`${endpoints.backoffice.tags.list.href}?${new URLSearchParams(params as Record<string, string>)}`);
      if (!result.success) {
        throw new Error('Failed to fetch tags');
      }
      return result.data;
    },

    async fetchOne(id) {
      const result = await get<TagResponse>(endpoints.backoffice.tags.get.href.replace('{id}', id.toString()));
      if (!result.success) {
        throw new Error('Failed to fetch tag');
      }
      return result.data;
    },

    async create(tag) {
      const request: TagRequest = {
        id: tag.id,
        name: tag.name,
        description: tag.description,
        slug: tag.slug
      }
      const result = await post<number>(endpoints.backoffice.tags.create.href, request);
      if (!result.success) {
        throw new Error('Failed to create tag');
      }
      return result.data;
    },

    async update(id, tag) {
      const request: TagRequest = {
        id: tag.id,
        name: tag.name,
        description: tag.description,
        slug: tag.slug
      }
      const result = await put(endpoints.backoffice.tags.update.href.replace('{id}', id.toString()), request);
      if (!result.success) {
        throw new Error('Failed to update tag');
      }
    },

    async delete(id) {
      const result = await remove(endpoints.backoffice.tags.delete.href.replace('{id}', id.toString()), {});
      if (!result.success) {
        throw new Error('Failed to delete tag');
      }
    },

    async archive(id) {
      const result = await post(endpoints.backoffice.tags.archive.href.replace('{id}', id.toString()), {});
      if (!result.success) {
        throw new Error('Failed to archive tag');
      }
    },
    async unarchive(id) {
      const result = await post(endpoints.backoffice.tags.unarchive.href.replace('{id}', id.toString()), {});
      if (!result.success) {
        throw new Error('Failed to unarchive tag');
      }
    }
  }), [get, post, put, remove, endpoints])
};
