import { getEnv } from '@/config/env';

import type { CategoriesService } from './categories.types';
import { useCategoriesApiService } from './categories.api';
import { useCategoriesMockService } from './categories.mock';

const useFake = getEnv('VITE_MOCK_API') === 'true';

export const useCategoriesService: () => CategoriesService = useFake
  ? useCategoriesMockService
  : useCategoriesApiService;