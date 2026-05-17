import { getEnv } from '@/config/env';

import type { AuthService } from './auth.types';
import { useAuthApiService } from './auth.api';
import { useAuthMockService } from './auth.mock';

const useFake = getEnv('VITE_MOCK_API') === 'true';

export const useAuthService: () => AuthService = useFake
  ? useAuthMockService
  : useAuthApiService;
