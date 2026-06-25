import { useState, useEffect } from 'react';

import { useApi } from '@/shared/services/http/client';
import { useBootstrap } from '@/shared/hooks/useBootstrap';

export type TeamMember = {
    id: number;
    name: string;
    slug: string;
    position: string;
    bio: string;
    photoPath: string | null;
};

export const useTeam = () => {
    const { get } = useApi();
    const { endpoints } = useBootstrap();
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        get<TeamMember[]>(endpoints.guest.team.href)
            .then((result) => {
                if (!active) return;
                if (result.success) {
                    setTeam(result.data);
                    setError(null);
                } else {
                    setError(result.error);
                    setTeam([]);
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, [get, endpoints]);

    return { team, loading, error };
};
