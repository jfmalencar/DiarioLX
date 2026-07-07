import { useMemo } from 'react';

import type { CategoriesService, Category } from './categories.types';
import { mockCategories } from './categories.fixtures';

const fakeCategories: Category[] = mockCategories.map((c) => ({ ...c }))

export const useCategoriesMockService = (): CategoriesService => {
  return useMemo<CategoriesService>(() => ({
    async fetchAll() {
      return {
        items: fakeCategories,
        pagination: {
          page: 1,
          size: 10,
          hasPrevious: false,
          hasNext: false,
        }
      };
    },

    async fetchOne(id) {
      const category = fakeCategories.find((cat) => cat.id === id);
      if (!category) {
        throw new Error('Category not found');
      }
      return category;
    },

    async create(category) {
      const newCategory = {
        ...category,
        id: fakeCategories.length + 1,
        parentName: category.parentId
          ? fakeCategories.find((cat) => cat.id === category.parentId)?.name || null
          : null,
        quantity: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        archivedAt: null,
      };
      await new Promise((resolve) => setTimeout(resolve, 2000));
      fakeCategories.push(newCategory);
      return true;
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
        updatedAt: new Date().toISOString(),
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
    },

    async archive(id) {
      const index = fakeCategories.findIndex((cat) => cat.id === id);
      if (index === -1) {
        throw new Error('Category not found');
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      fakeCategories[index] = {
        ...fakeCategories[index],
        archivedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    },

    async unarchive(id) {
      const index = fakeCategories.findIndex((cat) => cat.id === id);
      if (index === -1) {
        throw new Error('Category not found');
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      fakeCategories[index] = {
        ...fakeCategories[index],
        archivedAt: null,
        updatedAt: new Date().toISOString(),
      };
    }
  }), [])
};
