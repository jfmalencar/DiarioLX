import { getEnv } from '@/config/env';

import type { ContentsService } from './contents.types';
import { contentsApiService } from './contents.api';
import { contentsMockService } from './contents.mock';

const useFake = getEnv('VITE_MOCK_API') === 'true';

export const contentsService: ContentsService = useFake
  ? contentsMockService
  : contentsApiService;
