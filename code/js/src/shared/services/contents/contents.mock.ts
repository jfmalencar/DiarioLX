import { useMemo } from 'react';

import type { ContentsService, Content } from './contents.types';

const fakeContents: Content[] = [
  {
    id: '1',
    type: 'article',
    title: 'Content 1',
    slug: 'content-1',
    headline: 'Description 1',
    blocks: [],
    featuredImage: null,
    category: {
      id: '1',
      name: 'Category 1',
      slug: 'category-1',
    },
    authors: [
      {
        authorId: '1',
        name: 'Author 1',
        slug: 'author-1',
      },
    ],
    tags: [
      {
        tagId: '1',
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
          title: art.title,
          type: art.type,
          slug: art.slug,
          featuredImage: art.featuredImage ? art.featuredImage.url : '',
          category: art.category.name,
          authors: art.authors.map((author) => author.name),
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

    async fetchOne(id) {
      const content = fakeContents.find((art) => art.id === id);
      if (!content) {
        throw new Error('Content not found');
      }
      return content;
    },

    async create(content) {
      const newContent = {
        ...content,
        id: String(fakeContents.length + 1),
        category: {
          id: content.category.id,
          name: `Category ${content.category.id}`,
          slug: `category-${content.category.id}`,
        },
        authors: content.authors.map((author) => ({
          authorId: author.authorId,
          name: `Author ${author.authorId}`,
          slug: `author-${author.authorId}`,
        })),
        tags: content.tags.map((tag) => ({
          tagId: tag.tagId,
          name: `Tag ${tag.tagId}`,
          slug: `tag-${tag.tagId}`,
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: null,
        archivedAt: null,
        featuredImage: null,
      };
      await new Promise((resolve) => setTimeout(resolve, 2000));
      fakeContents.push(newContent);
      return newContent.id;
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
    }
  }), [])
};
