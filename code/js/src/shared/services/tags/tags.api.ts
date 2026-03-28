import type { TagsService, TagsResponse, TagResponse } from './tags.types';
import { get, post, put, remove } from '../http/client';

export const tagsApiService: TagsService = {

  async fetchAll(params) {
    const result = await get<TagsResponse>('/api/tags?' + new URLSearchParams(params as Record<string, string>).toString());
    if (!result.success) {
      throw new Error('Failed to fetch tags');
    }
    return result.data;
  },

  async fetchOne(id) {
    const result = await get<TagResponse>(`/api/tags/${id}`);
    if (!result.success) {
      throw new Error('Failed to fetch tag');
    }
    return result.data;
  },

  async create(tag) {
    const result = await post<string>('/api/tags', tag);
    if (!result.success) {
      throw new Error('Failed to create tag');
    }
    return result.data;
  },

  async update(id, tag) {
    const result = await put(`/api/tags/${id}`, tag);
    if (!result.success) {
      throw new Error('Failed to update tag');
    }
  },

  async delete(id) {
    const result = await remove(`/api/tags/${id}/delete`, {});
    if (!result.success) {
      throw new Error('Failed to delete tag');
    }
  },

  async archive(id) {
    const result = await post(`/api/tags/${id}/archive`, {});
    if (!result.success) {
      throw new Error('Failed to archive tag');
    }
  },
  async unarchive(id) {
    const result = await post(`/api/tags/${id}/unarchive`, {});
    if (!result.success) {
      throw new Error('Failed to unarchive tag');
    }
  }
};
