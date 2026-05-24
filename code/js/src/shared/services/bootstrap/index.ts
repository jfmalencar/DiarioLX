import { getEnv } from '@/config/env';

import type { BootstrapService } from './bootstrap.types';
import { useBootstrapApiService } from './bootstrap.api';
import { useBootstrapMockService } from './bootstrap.mock';

const useFake = getEnv('VITE_MOCK_API') === 'true';

export const useBootstrapService: () => BootstrapService = useFake
    ? useBootstrapMockService
    : useBootstrapApiService;
