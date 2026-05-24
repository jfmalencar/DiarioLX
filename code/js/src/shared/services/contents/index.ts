import { getEnv } from '@/config/env';

import type { ContentsService } from './contents.types';
import { useContentsApiService } from './contents.api';
import { useContentsMockService } from './contents.mock';

const useFake = getEnv('VITE_MOCK_API') === 'true';

export const useContentsService: () => ContentsService = useFake
  ? useContentsMockService
  : useContentsApiService;
