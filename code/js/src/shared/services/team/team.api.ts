import { useMemo } from 'react';

import { useBootstrap } from '@/shared/hooks/useBootstrap';

import type { TeamService, TeamMember } from './team.types';
import { useApi } from '../http/client';

export const useTeamApiService = (): TeamService => {
  const { get } = useApi();
  const { endpoints } = useBootstrap();

  return useMemo<TeamService>(() => ({
    async fetchTeam() {
      const result = await get<TeamMember[]>(endpoints.guest.team.href);
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch team');
      }
      return result.data;
    },

    async fetchByUsername(slug) {
      const result = await get<TeamMember>(endpoints.guest.author.href.replace('{slug}', slug));
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch author');
      }
      return result.data;
    },
  }), [get, endpoints])
};
