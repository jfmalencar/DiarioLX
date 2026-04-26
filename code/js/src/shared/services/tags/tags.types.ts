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

export type TagFormValues = {
  id: string;
  name: string;
  description: string;
  slug: string;
}

export type TagRequest = {
  id: string;
  name: string;
  description: string;
  slug: string;
}

export type TagsResponse = {
  tags: Tag[];
};

export type TagResponse = {
  tag: Tag;
}

export interface TagsService {
  fetchAll(params: Query): Promise<TagsResponse>;

  fetchOne(id: string): Promise<TagResponse>;

  create(tag: TagFormValues): Promise<string | undefined>;

  update(id: string, tag: TagRequest): Promise<void>;

  delete(id: string): Promise<void>;

  archive(id: string): Promise<void>;

  unarchive(id: string): Promise<void>;
}
