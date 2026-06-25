
import { useState, useCallback } from 'react';

import { useInvitesService } from '@/shared/services/invites';
import type { Invite, InviteFormValues } from '@/shared/services/invites/invites.types';
import type { Query } from '@/shared/types/Query';
import type { Pagination } from '@/shared/types/Pagination';
import type { Result } from '@/shared/types/Result';
import { runAction } from '@/shared/utils/action';

export type { Invite, InviteFormValues };

export const useInvites = () => {
    const [invites, setInvites] = useState<Invite[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const invitesService = useInvitesService()

    const fetchAll = useCallback(
        async (params: Query): Promise<undefined> => {
            setLoading(true)
            setError(null)
            try {
                const data = await invitesService.fetchAll(params)
                setInvites(data.items)
                setPagination(data.pagination)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to fetch invites'
                setError(message)
                setInvites([])
            } finally {
                setLoading(false)
            }
        },
        [invitesService]
    )

    const create = useCallback(
        (invite: InviteFormValues): Promise<Result<string>> =>
            runAction(() => invitesService.create(invite), 'Failed to create invite', setLoading, setError),
        [invitesService]
    )

    const remove = useCallback(
        (id: number): Promise<Result> =>
            runAction(() => invitesService.delete(id), 'Failed to delete invite', setLoading, setError),
        [invitesService]
    )

    return {
        loading,
        error,
        invites,
        pagination,
        fetchAll,
        create,
        remove
    }
}
