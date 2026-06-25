import { getEnv } from '@/config/env';

import type { TeamService } from './team.types';
import { useTeamApiService } from './team.api';
import { useTeamMockService } from './team.mock';

const useFake = getEnv('VITE_MOCK_API') === 'true';

export const useTeamService: () => TeamService = useFake
  ? useTeamMockService
  : useTeamApiService;
