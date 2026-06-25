import { useMemo } from 'react';

import type { ContentsService, Content, ContentType, ContentState } from './contents.types';

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
    async fetchAll() {
      return {
        items: fakeContents.map((art) => ({
          id: art.id,
          embedUrl: art.embedUrl,
          headline: art.headline,
          state: art.state,
          title: art.title,
          type: art.type,
          slug: art.slug,
          featuredImage: art.featuredImage ? art.featuredImage.path : '',
          category: art.category,
          authors: art.authors,
          tag: art.tags[0],
          createdAt: art.createdAt,
          publishedAt: art.publishedAt,
        })),
        pagination: {
          page: 1,
          size: 10,
          hasPrevious: false,
          hasNext: false,
        }
      };
    },

    async fetchPublished(params) {
      return this.fetchAll(params)
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
  }), [])
};
