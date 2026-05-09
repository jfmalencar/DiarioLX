import { getEnv } from '@/config/env';

import type { TagsService } from './tags.types';
import { tagsApiService } from './tags.api';
import { tagsMockService } from './tags.mock';

const useFake = getEnv('VITE_USE_MOCK_API') === 'true';

export const tagsService: TagsService = useFake
  ? tagsMockService
  : tagsApiService;
