import type { CategoriesService } from './categories.types';
import { categoriesApiService } from './categories.api';
import { categoriesMockService } from './categories.mock';

const useFake = import.meta.env.VITE_MOCK_API === 'true';

export const categoriesService: CategoriesService = useFake
  ? categoriesMockService
  : categoriesApiService;