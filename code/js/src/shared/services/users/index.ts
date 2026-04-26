import type { UsersService } from './users.types';
import { usersApiService } from './users.api';
import { usersMockService } from './users.mock';

const useFake = import.meta.env.VITE_MOCK_API === 'true';

export const usersService: UsersService = useFake
  ? usersMockService
  : usersApiService;
