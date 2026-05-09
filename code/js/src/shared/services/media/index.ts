import { getEnv } from '@/config/env';

import type { MediaService } from './media.types';
import { mediaApiService } from './media.api';
import { mediaMockService } from './media.mock';

const useFake = getEnv('VITE_MOCK_API') === 'true';

export const mediaService: MediaService = useFake
  ? mediaMockService
  : mediaApiService;