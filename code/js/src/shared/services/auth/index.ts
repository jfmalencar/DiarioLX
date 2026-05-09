import { getEnv } from '@/config/env';

import type { AuthService } from './auth.types';
import { authApiService } from './auth.api';
import { authMockService } from './auth.mock';

const useFake = getEnv('VITE_MOCK_API') === 'true';

console.log(`Using ${useFake ? 'mock' : 'real'} auth service`);

export const authService: AuthService = useFake
  ? authMockService
  : authApiService;