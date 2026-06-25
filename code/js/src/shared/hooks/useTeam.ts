import { useState, useEffect } from 'react';

import { useTeamService } from '@/shared/services/team';
import type { TeamMember } from '@/shared/services/team/team.types';

export type { TeamMember };

export const useTeam = () => {
    const teamService = useTeamService();
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        teamService.fetchTeam()
            .then((members) => {
                if (!active) return;
                setTeam(members);
                setError(null);
            })
            .catch((err) => {
                if (!active) return;
                setError(err instanceof Error ? err.message : 'Failed to fetch team');
                setTeam([]);
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, [teamService]);

    return { team, loading, error };
};
