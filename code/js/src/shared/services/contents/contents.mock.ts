import { useMemo } from 'react';

import type { ContentsService, Content, ContentSummary, ContentType, ContentState } from './contents.types';
import type { Pagination } from '@/shared/types/Pagination';
import type { Query } from '@/shared/types/Query';

import { mockContents, summaryOf } from './contents.fixtures';

const store: Content[] = mockContents.map((content) => ({ ...content }));

const summaries = (): ContentSummary[] => store.map(summaryOf);

const paginate = <T>(items: T[], params?: Query): { items: T[]; pagination: Pagination } => {
  const page = Number(params?.page ?? 1);
  const size = Number(params?.size ?? 10);
  const start = (page - 1) * size;
  return {
    items: items.slice(start, start + size),
    pagination: {
      page,
      size,
      hasPrevious: page > 1,
      hasNext: start + size < items.length,
    },
  };
};

export const useContentsMockService = (): ContentsService => {
  return useMemo<ContentsService>(() => ({
    async fetchAll(params) {
      const query = String(params?.query ?? '').trim().toLowerCase();
      const type = params?.type ? String(params.type) : null;
      let items = summaries();
      if (type) items = items.filter((s) => s.type === type);
      if (query) {
        items = items.filter(
          (s) => s.title.toLowerCase().includes(query) || s.slug.toLowerCase().includes(query),
        );
      }
      return paginate(items, params);
    },

    async fetchPublicContents(params) {
      return this.fetchAll(params);
    },

    async fetchTag(slug, params) {
      const items = summaries().filter((s) => s.tag.slug === slug);
      const resource = items[0]?.tag ?? { id: 1, name: slug, slug };
      return { resource, ...paginate(items, params) };
    },

    async fetchCategory(slug, params) {
      const items = summaries().filter((s) => s.category.slug === slug);
      const resource = items[0]?.category ?? { id: 1, name: slug, slug, color: '#FF0000' };
      return { resource, ...paginate(items, params) };
    },

    async fetchById(id) {
      const content = store.find((c) => c.id === id);
      if (!content) {
        throw new Error('Content not found');
      }
      return content;
    },

    async fetchBySlug(slug) {
      const content = store.find((c) => c.slug === slug);
      if (!content) {
        throw new Error('Content not found');
      }
      return content;
    },

    async create(content) {
      const newContent: Content = {
        id: store.length + 1,
        type: content.type as ContentType,
        title: 'DRAFT',
        state: 'DRAFT' as ContentState,
        slug: '',
        category: { id: 1, name: 'Category 1', slug: 'category-1', color: '#FF0000' },
        headline: '',
        blocks: [],
        authors: [],
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: null,
        archivedAt: null,
        featuredImage: null,
        parentId: null,
        parent: null,
        embedUrl: null,
      };
      await new Promise((resolve) => setTimeout(resolve, 2000));
      store.push(newContent);
      return { id: newContent.id };
    },

    async update(id, content) {
      const index = store.findIndex((c) => c.id === id);
      if (index === -1) {
        throw new Error('Content not found');
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      store[index] = {
        ...content,
        ...store[index],
        updatedAt: new Date().toISOString(),
      };
    },

    async delete(id) {
      const index = store.findIndex((c) => c.id === id);
      if (index === -1) {
        throw new Error('Content not found');
      }
      store.splice(index, 1);
    },

    async publish(id) {
      const index = store.findIndex((c) => c.id === id);
      if (index === -1) {
        throw new Error('Content not found');
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      store[index] = {
        ...store[index],
        state: 'PUBLISHED',
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    },

    async submit(id) {
      const index = store.findIndex((c) => c.id === id);
      if (index === -1) {
        throw new Error('Content not found');
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      store[index] = {
        ...store[index],
        state: 'PENDING_REVIEW',
        updatedAt: new Date().toISOString(),
      };
    },

    async reject(id) {
      const index = store.findIndex((c) => c.id === id);
      if (index === -1) {
        throw new Error('Content not found');
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      store[index] = {
        ...store[index],
        state: 'REJECTED',
        updatedAt: new Date().toISOString(),
      };
    },

    async fetchHistoryById(id) {
      const content = store.find((c) => c.id === id);
      if (!content) {
        throw new Error('Content not found');
      }
      return {
        history: [
          { id: '1', type: 'approved', date: new Date().toISOString(), by: 'Editor 1', comment: 'Looks good!' },
          { id: '2', type: 'rejected', date: new Date().toISOString(), by: 'Editor 2', comment: 'Needs more work.' },
        ],
      };
    },

    async archive(id) {
      const index = store.findIndex((c) => c.id === id);
      if (index === -1) {
        throw new Error('Content not found');
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      store[index] = {
        ...store[index],
        archivedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    },

    async unarchive(id) {
      const index = store.findIndex((c) => c.id === id);
      if (index === -1) {
        throw new Error('Content not found');
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      store[index] = {
        ...store[index],
        archivedAt: null,
        updatedAt: new Date().toISOString(),
      };
    },
  }), []);
};
