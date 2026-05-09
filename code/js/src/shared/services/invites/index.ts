import { getEnv } from '@/config/env';

import type { InvitesService } from './invites.types';
import { invitesApiService } from './invites.api';
import { invitesMockService } from './invites.mock';

const useFake = getEnv('VITE_MOCK_API') === 'true';

export const invitesService: InvitesService = useFake
  ? invitesMockService
  : invitesApiService;