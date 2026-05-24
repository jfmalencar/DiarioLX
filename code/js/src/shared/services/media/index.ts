import { getEnv } from '@/config/env';

import type { MediaService } from './media.types';
import { useMediaApiService } from './media.api';
import { useMediaMockService } from './media.mock';

const useFake = getEnv('VITE_MOCK_API') === 'true';

export const useMediaService: () => MediaService = useFake
  ? useMediaMockService
  : useMediaApiService;
