import type { Query } from '@/shared/types/Query';

export type Tag = {
  id: string;
  name: string;
  description: string;
  slug: string;
  count: number;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
}

export type TagRequest = Omit<Tag, 'count' | 'createdAt' | 'updatedAt' | 'archivedAt'>;

export type TagsResponse = {
  tags: Tag[];
  _links: {
    self: {
      href: string;
      method: string;
    };
    previous?: {
      href: string;
      method: string;
    };
    next?: {
      href: string;
      method: string;
    };
  };
};

export type TagResponse = {
  tag: Tag;
  _links: {
    self: {
      href: string;
      method: string;
    }
  };
}

export interface TagsService {
  fetchAll(params: Query): Promise<TagsResponse>;

  fetchOne(id: string): Promise<TagResponse>;

  create(tag: TagRequest): Promise<string | undefined>;

  update(id: string, tag: TagRequest): Promise<void>;

  delete(id: string): Promise<void>;

  archive(id: string): Promise<void>;

  unarchive(id: string): Promise<void>;
}
