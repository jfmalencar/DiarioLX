import type { Query } from '@/shared/types/Query';
import type { Pagination } from '@/shared/types/Pagination';

export type Category = {
  id: number;
  name: string;
  description: string;
  color: string;
  slug: string;
  parentId: number | null;
  parentName: string | null;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
}

export type CategoryFormValues = {
  id: number;
  name: string;
  description: string;
  color: string;
  slug: string;
  parentId: number | null;
  parentName: string | null;
}

export type CategoryRequest = {
  id: number;
  name: string;
  description: string;
  color: string;
  slug: string;
  parentId: number | null;
  parentName: string | null;
}

export type CategoriesResponse = {
  items: Category[];
  pagination: Pagination
};

export type CategoryResponse = Category

export interface CategoriesService {
  fetchAll(params: Query): Promise<CategoriesResponse>;

  fetchOne(id: number): Promise<CategoryResponse>;

  create(category: CategoryFormValues): Promise<boolean>;

  update(id: number, category: CategoryFormValues): Promise<void>;

  delete(id: number): Promise<void>;

  archive(id: number): Promise<void>;

  unarchive(id: number): Promise<void>;
}
