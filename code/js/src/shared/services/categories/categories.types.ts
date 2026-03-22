export type Category = {
  id: string;
  name: string;
  description: string;
  color: string;
  slug: string;
  parentId: string | null;
  parentName: string | null;
  count: number;
}

export type CategoriesResponse = {
  categories: Category[];
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

export type CategoryResponse = {
  category: Category;
  _links: {
    self: {
      href: string;
      method: string;
    }
  };
}

export interface CategoriesService {
  fetchAll(params: Record<string, string | number | string[]>): Promise<CategoriesResponse>;

  fetchOne(id: string): Promise<CategoryResponse>;

  create(category: Omit<Category, 'id'>): Promise<string | undefined>;

  update(id: string, category: Omit<Category, 'id'>): Promise<void>;

  delete(id: string): Promise<void>;
}
