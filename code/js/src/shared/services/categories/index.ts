import { getEnv } from '@/config/env';

import type { CategoriesService } from './categories.types';
import { categoriesApiService } from './categories.api';
import { categoriesMockService } from './categories.mock';

const useFake = getEnv('VITE_MOCK_API') === 'true';

export const categoriesService: CategoriesService = useFake
  ? categoriesMockService
  : categoriesApiService;