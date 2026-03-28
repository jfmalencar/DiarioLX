import type { TagsService, Tag } from './tags.types';

const fakeTags: Tag[] = [
  {
    id: '1',
    name: 'Tag 1',
    description: 'Description 1',
    slug: 'tag-1',
    count: 10,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    archivedAt: null,
  },
  {
    id: '2',
    name: 'Tag 2',
    description: 'Description 2',
    slug: 'tag-2',
    count: 5,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    archivedAt: null,
  },
]

export const tagsMockService: TagsService = {
  async fetchAll() {
    return {
      tags: fakeTags,
      _links: {
        self: {
          href: '/api/tags',
          method: 'GET',
        },
      },
    };
  },

  async fetchOne(id) {
    const tag = fakeTags.find((t) => t.id === id);
    if (!tag) {
      throw new Error('Tag not found');
    }
    return { tag, _links: { self: { href: `/api/tags/${id}`, method: 'GET' } } };
  },

  async create(tag) {
    const newTag = {
      ...tag,
      id: String(fakeTags.length + 1),
      count: 0,
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
      ...tag,
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
}
