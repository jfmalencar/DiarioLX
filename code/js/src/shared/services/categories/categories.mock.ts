import type { CategoriesService, Category } from './categories.types';

const fakeCategories: Category[] = [
  {
    id: '1',
    name: 'Category 1',
    description: 'Description 1',
    slug: 'category-1',
    parentId: null,
    parentName: null,
    count: 10,
    color: '#ec6b43',
  },
  {
    id: '2',
    name: 'Category 2',
    description: 'Description 2',
    slug: 'category-2',
    parentId: null,
    parentName: null,
    count: 5,
    color: '#43a1ec',
  },
]

export const categoriesMockService: CategoriesService = {
  async fetchAll() {
    return {
      categories: fakeCategories,
      _links: {
        self: {
          href: '/api/categories',
          method: 'GET',
        },
      },
    };
  },

  async fetchOne(id) {
    const category = fakeCategories.find((cat) => cat.id === id);
    if (!category) {
      throw new Error('Category not found');
    }
    return { category, _links: { self: { href: `/api/categories/${id}`, method: 'GET' } } };
  },

  async create(category) {
    const newCategory = {
      ...category,
      id: String(fakeCategories.length + 1),
      parentName: category.parentId
        ? fakeCategories.find((cat) => cat.id === category.parentId)?.name || null
        : null,
      count: 0,
    };
    await new Promise((resolve) => setTimeout(resolve, 2000));
    fakeCategories.push(newCategory);
    return newCategory.id;
  },

  async update(id, category) {
    const index = fakeCategories.findIndex((cat) => cat.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
    fakeCategories[index] = {
      ...fakeCategories[index],
      ...category,
      parentName: category.parentId
        ? fakeCategories.find((cat) => cat.id === category.parentId)?.name || null
        : null,
    };
  },

  async delete(id) {
    const index = fakeCategories.findIndex((cat) => cat.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    fakeCategories.splice(index, 1);
  }
}
