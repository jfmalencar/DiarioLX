import { useMemo } from 'react';

import type { TeamService, TeamMember } from './team.types';

const fakeTeam: TeamMember[] = [
  {
    id: 1,
    name: 'Author 1',
    slug: 'author-1',
    position: 'Jornalista',
    bio: 'Bio do Author 1.',
    photoPath: null,
  },
];

export const useTeamMockService = (): TeamService => {
  return useMemo<TeamService>(() => ({
    async fetchTeam() {
      return fakeTeam;
    },

    async fetchByUsername(slug) {
      const member = fakeTeam.find((m) => m.slug === slug);
      if (!member) {
        throw new Error('Author not found');
      }
      return member;
    },
  }), [])
};
