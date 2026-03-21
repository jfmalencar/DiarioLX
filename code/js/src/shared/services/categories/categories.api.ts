import type { CategoriesService, CategoriesResponse } from './categories.types';
import { get, post } from '../http/client';

export const categoriesApiService: CategoriesService = {

  async fetch() {
    const result = await get<CategoriesResponse>('/api/categories');
    if (!result.success) {
      throw new Error('Failed to fetch categories');
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
    const result = await post(`/api/categories/${id}`, category);
    if (!result.success) {
      throw new Error('Failed to update category');
    }
  },

  async delete(id) {
    const result = await post(`/api/categories/${id}/delete`, {});
    if (!result.success) {
      throw new Error('Failed to delete category');
    }
  }
};
