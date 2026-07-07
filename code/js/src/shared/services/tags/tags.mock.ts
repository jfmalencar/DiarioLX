import { useMemo } from 'react';

import type { TagsService, Tag } from './tags.types';
import { mockTags } from './tags.fixtures';

const fakeTags: Tag[] = mockTags.map((t) => ({ ...t }))

export const useTagsMockService = (): TagsService => {
  return useMemo<TagsService>(() => ({
    async fetchAll() {
      return {
        items: fakeTags,
        pagination: {
          page: 1,
          size: 10,
          hasPrevious: false,
          hasNext: false,
        }
      };
    },

    async fetchOne(id) {
      const tag = fakeTags.find((t) => t.id === id);
      if (!tag) {
        throw new Error('Tag not found');
      }
      return tag;
    },

    async create(tag) {
      const newTag = {
        id: fakeTags.length + 1,
        name: tag.name,
        description: tag.description,
        slug: tag.slug,
        quantity: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        archivedAt: null,
      };
      await new Promise((resolve) => setTimeout(resolve, 2000));
      fakeTags.push(newTag);
      return newTag.id;
    },

    async update(id, tag) {
      const index = fakeTags.findIndex((t) => t.id === id);
      if (index === -1) {
        throw new Error('Tag not found');
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      fakeTags[index] = {
        ...fakeTags[index],
        id: tag.id,
        name: tag.name,
        description: tag.description,
        slug: tag.slug,
        updatedAt: new Date().toISOString(),
      };
    },

    async delete(id) {
      const index = fakeTags.findIndex((t) => t.id === id);
      if (index === -1) {
        throw new Error('Tag not found');
      }
      fakeTags.splice(index, 1);
    },

    async archive(id) {
      const index = fakeTags.findIndex((t) => t.id === id);
      if (index === -1) {
        throw new Error('Tag not found');
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      fakeTags[index] = {
        ...fakeTags[index],
        archivedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    },

    async unarchive(id) {
      const index = fakeTags.findIndex((t) => t.id === id);
      if (index === -1) {
        throw new Error('Tag not found');
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      fakeTags[index] = {
        ...fakeTags[index],
        archivedAt: null,
        updatedAt: new Date().toISOString(),
      };
    }
  }), [])
}
