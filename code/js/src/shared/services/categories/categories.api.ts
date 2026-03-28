import type { CategoriesService, CategoriesResponse, CategoryResponse } from './categories.types';
import { get, post, put, remove } from '../http/client';

export const categoriesApiService: CategoriesService = {

  async fetchAll(params) {
    const result = await get<CategoriesResponse>('/api/categories?' + new URLSearchParams(params as Record<string, string>).toString());
    if (!result.success) {
      throw new Error('Failed to fetch categories');
    }
    return result.data;
  },

  async fetchOne(id) {
    const result = await get<CategoryResponse>(`/api/categories/${id}`);
    if (!result.success) {
      throw new Error('Failed to fetch category');
    }
    return result.data;
  },

  async create(category) {
    const result = await post<string>('/api/categories', category);
    if (!result.success) {
      throw new Error('Failed to create category');
    }
    return result.data;
  },

  async update(id, category) {
    const result = await put(`/api/categories/${id}`, category);
    if (!result.success) {
      throw new Error('Failed to update category');
    }
  },

  async delete(id) {
    const result = await remove(`/api/categories/${id}/delete`, {});
    if (!result.success) {
      throw new Error('Failed to delete category');
    }
  },

  async archive(id) {
    const result = await post(`/api/categories/${id}/archive`, {});
    if (!result.success) {
      throw new Error('Failed to archive category');
    }
  },

  async unarchive(id) {
    const result = await post(`/api/categories/${id}/unarchive`, {});
    if (!result.success) {
      throw new Error('Failed to unarchive category');
    }
  },
};
