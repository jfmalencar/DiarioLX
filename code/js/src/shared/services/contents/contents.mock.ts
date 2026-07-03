import { useMemo } from 'react';

import type { ContentsService, ContentSummary, Content, ContentType, ContentState } from './contents.types';

const PUBLIC_FEED_SIZE = 15;

const fakeSummaries: ContentSummary[] = Array.from({ length: PUBLIC_FEED_SIZE }, (_, i) => {
  const id = i + 1;
  return {
    id,
    title: `Conteúdo de teste ${id}`,
    headline: 'Resumo de teste para o conteúdo público.',
    state: 'PUBLISHED',
    type: 'ARTICLE',
    slug: `mock-${id}`,
    featuredImage: `https://picsum.photos/seed/${id}/640/420`,
    embedUrl: null,
    category: { id: 1, name: 'Category 1', slug: 'category-1', color: '#FF0000' },
    tag: { id: 1, name: 'Tag 1', slug: 'tag-1' },
    authors: [{ id: 1, name: 'Author 1', slug: 'author-1' }],
    createdAt: '2026-01-01T00:00:00Z',
    publishedAt: '2026-01-01T00:00:00Z',
  };
});

const fakeContents: Content[] = [
  {
    id: 1,
    parentId: null,
    parent: null,
    embedUrl: null,
    type: 'ARTICLE',
    title: 'Content 1',
    slug: 'content-1',
    state: 'DRAFT',
    headline: 'Description 1',
    blocks: [],
    featuredImage: null,
    category: {
      id: 1,
      name: 'Category 1',
      slug: 'category-1',
      color: '#FF0000',
    },
    authors: [
      {
        id: 1,
        name: 'Author 1',
        slug: 'author-1',
      },
    ],
    tags: [
      {
        id: 1,
        name: 'Tag 1',
        slug: 'tag-1',
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    publishedAt: '2024-01-02T00:00:00Z',
    archivedAt: null,
  }
]

export const useContentsMockService = (): ContentsService => {
  return useMemo<ContentsService>(() => ({
    async fetchAll(params) {
      const page = Number(params?.page ?? 1);
      const size = Number(params?.size ?? 10);
      const start = (page - 1) * size;
      const items = fakeSummaries.slice(start, start + size);
      return {
        items,
        pagination: {
          page,
          size,
          hasPrevious: page > 1,
          hasNext: start + size < fakeSummaries.length,
        }
      };
    },

    async fetchPublicContents(params) {
      return this.fetchAll(params)
    },

    async fetchTag(slug, params) {
      const { items, pagination } = await this.fetchAll(params);
      return { resource: { id: 1, name: 'Tag 1', slug }, items, pagination };
    },

    async fetchCategory(slug, params) {
      const { items, pagination } = await this.fetchAll(params);
      return { resource: { id: 1, name: 'Category 1', slug, color: '#FF0000' }, items, pagination };
    },

    async fetchById(id) {
      const content = fakeContents.find((art) => art.id === id);
      if (!content) {
        throw new Error('Content not found');
      }
      return content;
    },

    async fetchBySlug(slug) {
      const content = fakeContents.find((art) => art.slug === slug);
      if (!content) {
        throw new Error('Content not found');
      }
      return content;
    },

    async create(content) {
      const newContent = {
        id: fakeContents.length + 1,
        type: content.type as ContentType,
        title: 'DRAFT',
        state: 'DRAFT' as ContentState,
        slug: '',
        category: {
          id: 1,
          name: 'Category 1',
          slug: 'category-1',
          color: '#FF0000',
        },
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
      fakeContents.push(newContent);
      return { id: newContent.id }
    },

    async update(id, content) {
      const index = fakeContents.findIndex((art) => art.id === id);
      if (index === -1) {
        throw new Error('Content not found');
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      fakeContents[index] = {
        ...content,
        ...fakeContents[index],
        updatedAt: new Date().toISOString(),
      };
    },

    async delete(id) {
      const index = fakeContents.findIndex((art) => art.id === id);
      if (index === -1) {
        throw new Error('Content not found');
      }
      fakeContents.splice(index, 1);
    },

    async publish(id) {
      const index = fakeContents.findIndex((art) => art.id === id);
      if (index === -1) {
        throw new Error('Content not found');
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      fakeContents[index] = {
        ...fakeContents[index],
        state: 'PUBLISHED',
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    },

    async submit(id) {
      const index = fakeContents.findIndex((art) => art.id === id);
      if (index === -1) {
        throw new Error('Content not found');
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      fakeContents[index] = {
        ...fakeContents[index],
        state: 'PENDING_REVIEW',
        updatedAt: new Date().toISOString(),
      };
    },

    async reject(id) {
      const index = fakeContents.findIndex((art) => art.id === id);
      if (index === -1) {
        throw new Error('Content not found');
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      fakeContents[index] = {
        ...fakeContents[index],
        state: 'REJECTED',
        updatedAt: new Date().toISOString(),
      };
    },

    async fetchHistoryById(id) {
      const content = fakeContents.find((art) => art.id === id);
      if (!content) {
        throw new Error('Content not found');
      }
      return {
        history: [
          {
            id: '1',
            type: 'approved',
            date: new Date().toISOString(),
            by: 'Editor 1',
            comment: 'Looks good!',
          },
          {
            id: '2',
            type: 'rejected',
            date: new Date().toISOString(),
            by: 'Editor 2',
            comment: 'Needs more work.',
          },
        ],
      };
    },

    async archive(id) {
      const index = fakeContents.findIndex((art) => art.id === id);
      if (index === -1) {
        throw new Error('Content not found');
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      fakeContents[index] = {
        ...fakeContents[index],
        archivedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    },

    async unarchive(id) {
      const index = fakeContents.findIndex((art) => art.id === id);
      if (index === -1) {
        throw new Error('Content not found');
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      fakeContents[index] = {
        ...fakeContents[index],
        archivedAt: null,
        updatedAt: new Date().toISOString(),
      };
    },
  }), [])
};
