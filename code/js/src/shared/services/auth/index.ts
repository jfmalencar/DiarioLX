import type { AuthService } from './auth.types';
import { authApiService } from './auth.api';
import { authMockService } from './auth.mock';

const useFake = true//import.meta.env.VITE_MOCK_API === 'true';

export const authService: AuthService = useFake
  ? authMockService
  : authApiService;