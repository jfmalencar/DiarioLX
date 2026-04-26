import type { Query } from '@/shared/types/Query';

export type Category = {
  id: string;
  name: string;
  description: string;
  color: string;
  slug: string;
  parentId: string | null;
  parentName: string | null;
  count: number;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
}

export type CategoryFormValues = {
  id: string;
  name: string;
  description: string;
  color: string;
  slug: string;
  parentId: string | null;
  parentName: string | null;
}

export type CategoryRequest = {
  id: string;
  name: string;
  description: string;
  color: string;
  slug: string;
  parentId: string | null;
  parentName: string | null;
}

export type CategoriesResponse = {
  categories: Category[];
};

export type CategoryResponse = {
  category: Category;
}

export interface CategoriesService {
  fetchAll(params: Query): Promise<CategoriesResponse>;

  fetchOne(id: string): Promise<CategoryResponse>;

  create(category: CategoryFormValues): Promise<string | undefined>;

  update(id: string, category: CategoryFormValues): Promise<void>;

  delete(id: string): Promise<void>;

  archive(id: string): Promise<void>;

  unarchive(id: string): Promise<void>;
}
