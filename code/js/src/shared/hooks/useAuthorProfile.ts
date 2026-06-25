import { useState, useEffect } from 'react';

import { useApi } from '@/shared/services/http/client';
import { useBootstrap } from '@/shared/hooks/useBootstrap';
import type { TeamMember } from './useTeam';

// Public profile of any user by username — works for any author or credited
// person, not only team members.
export const useAuthorProfile = (slug?: string) => {
    const { get } = useApi();
    const { endpoints } = useBootstrap();
    const [author, setAuthor] = useState<TeamMember | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) return;
        let active = true;
        get<TeamMember>(endpoints.guest.author.href.replace('{slug}', slug))
            .then((result) => {
                if (!active) return;
                if (result.success) {
                    setAuthor(result.data);
                    setError(null);
                } else {
                    setError(result.error);
                    setAuthor(null);
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, [slug, get, endpoints]);

    return { author, loading, error };
};
