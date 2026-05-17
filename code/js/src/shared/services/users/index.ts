import { getEnv } from '@/config/env';

import type { UsersService } from './users.types';
import { useUsersApiService } from './users.api';
import { useUsersMockService } from './users.mock';

const useFake = getEnv('VITE_MOCK_API') === 'true';

export const useUsersService: () => UsersService = useFake
  ? useUsersMockService
  : useUsersApiService;
