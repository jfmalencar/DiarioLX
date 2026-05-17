import { getEnv } from '@/config/env';

import type { BootstrapService } from './bootstrap.types';
import { bootstrapApiService } from './bootstrap.api';
import { bootstrapMockService } from './bootstrap.mock';

const useFake = getEnv('VITE_MOCK_API') === 'true';

export const bootstrapService: BootstrapService = useFake
    ? bootstrapMockService
    : bootstrapApiService;
