import { getEnv } from '@/config/env';

import type { HomepageService } from './homepage.types';
import { useHomepageApiService } from './homepage.api';
import { useHomepageMockService } from './homepage.mock';

const useFake = getEnv('VITE_MOCK_API') === 'true';

export const useHomepageService: () => HomepageService = useFake
    ? useHomepageMockService
    : useHomepageApiService;
