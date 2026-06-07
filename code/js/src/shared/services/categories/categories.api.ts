import { useMemo } from 'react'

import { useBootstrap } from '@/shared/hooks/useBootstrap';

import type { CategoryRequest, CategoriesService, CategoriesResponse, CategoryResponse } from './categories.types';
import { useApi } from '../http/client';

export const useCategoriesApiService = (): CategoriesService => {
  const { get, post, put, remove } = useApi()
  const { endpoints } = useBootstrap()

  return useMemo<CategoriesService>(() => ({
    async fetchAll(params) {
      const result = await get<CategoriesResponse>(`${endpoints.categories.list.href}?${new URLSearchParams(params as Record<string, string>)}`);
      if (!result.success) {
        throw new Error('Failed to fetch categories');
      }
      return result.data;
    },

    async fetchOne(id) {
      const result = await get<CategoryResponse>(endpoints.categories.get.href.replace('{id}', id));
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch category');
      }
      return result.data;
    },

    async create(category) {
      const request: CategoryRequest = {
        id: category.id,
        name: category.name,
        description: category.description,
        color: category.color,
        slug: category.slug,
        parentId: category.parentId,
        parentName: category.parentName
      }
      const result = await post<void>(endpoints.categories.create.href, request);
      if (!result.success) {
        throw new Error(result.error || 'Failed to create category');
      }
      return true;
    },

    async update(id, category) {
      const request: CategoryRequest = {
        id: category.id,
        name: category.name,
        description: category.description,
        color: category.color,
        slug: category.slug,
        parentId: category.parentId,
        parentName: category.parentName
      }
      const result = await put(endpoints.categories.update.href.replace('{id}', id), request);
      if (!result.success) {
        throw new Error(result.error || 'Failed to update category');
      }
    },

    async delete(id) {
      const result = await remove(endpoints.categories.delete.href.replace('{id}', id), {});
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete category');
      }
    },

    async archive(id) {
      const result = await post(endpoints.categories.archive.href.replace('{id}', id), {});
      if (!result.success) {
        throw new Error(result.error || 'Failed to archive category');
      }
    },

    async unarchive(id) {
      const result = await post(endpoints.categories.unarchive.href.replace('{id}', id), {});
      if (!result.success) {
        throw new Error(result.error || 'Failed to unarchive category');
      }
    }
  }), [get, post, put, remove, endpoints])
};
