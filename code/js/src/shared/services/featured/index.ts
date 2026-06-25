import { getEnv } from '@/config/env';

import type { FeaturedService } from './featured.types';
import { useFeaturedApiService } from './featured.api';
import { useFeaturedMockService } from './featured.mock';

const useFake = getEnv('VITE_MOCK_API') === 'true';

export const useFeaturedService: () => FeaturedService = useFake
    ? useFeaturedMockService
    : useFeaturedApiService;
