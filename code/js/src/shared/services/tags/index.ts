import { getEnv } from '@/config/env';

import type { TagsService } from './tags.types';
import { useTagsApiService } from './tags.api';
import { useTagsMockService } from './tags.mock';

const useFake = getEnv('VITE_MOCK_API') === 'true';

export const useTagsService: () => TagsService = useFake
  ? useTagsMockService
  : useTagsApiService;
