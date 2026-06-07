import type { Query } from '@/shared/types/Query';
import type { Pagination } from '@/shared/types/Pagination';

export type Tag = {
  id: number;
  name: string;
  description: string;
  slug: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
}

export type TagFormValues = {
  id: number;
  name: string;
  description: string;
  slug: string;
}

export type TagRequest = {
  id: number;
  name: string;
  description: string;
  slug: string;
}

export type TagsResponse = {
  items: Tag[];
  pagination: Pagination
};

export type TagResponse = Tag

export interface TagsService {
  fetchAll(params: Query): Promise<TagsResponse>;

  fetchOne(id: number): Promise<TagResponse>;

  create(tag: TagFormValues): Promise<number | undefined>;

  update(id: number, tag: TagRequest): Promise<void>;

  delete(id: number): Promise<void>;

  archive(id: number): Promise<void>;

  unarchive(id: number): Promise<void>;
}
