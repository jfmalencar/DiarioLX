import { useState, useEffect } from 'react';

import { useTeamService } from '@/shared/services/team';
import type { TeamMember } from '@/shared/services/team/team.types';

export const useAuthorProfile = (slug?: string) => {
    const teamService = useTeamService();
    const [author, setAuthor] = useState<TeamMember | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) return;
        let active = true;
        teamService.fetchByUsername(slug)
            .then((member) => {
                if (!active) return;
                setAuthor(member);
                setError(null);
            })
            .catch((err) => {
                if (!active) return;
                setError(err instanceof Error ? err.message : 'Failed to fetch author');
                setAuthor(null);
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, [slug, teamService]);

    return { author, loading, error };
};
