import { getEnv } from '@/config/env';

import type { InvitesService } from './invites.types';
import { useInvitesApiService } from './invites.api';
import { useInvitesMockService } from './invites.mock';

const useFake = getEnv('VITE_MOCK_API') === 'true';

export const useInvitesService: () => InvitesService = useFake
  ? useInvitesMockService
  : useInvitesApiService;
