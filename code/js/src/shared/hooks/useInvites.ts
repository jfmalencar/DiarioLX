
import { useState, useCallback } from 'react';

import { useInvitesService } from '@/shared/services/invites';
import type { Invite, InviteFormValues } from '@/shared/services/invites/invites.types';
import type { Query } from '@/shared/types/Query';
import type { Pagination } from '@/shared/types/Pagination';

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
        async (tag: InviteFormValues): Promise<string | undefined> => {
            setLoading(true)
            setError(null)
            try {
                const newTagId = await invitesService.create(tag)
                return newTagId
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to create invite'
                setError(message)
                return undefined
            } finally {
                setLoading(false)
            }
        },
        [invitesService]
    )

    const remove = useCallback(
        async (id: number): Promise<void> => {
            setLoading(true)
            setError(null)
            try {
                await invitesService.delete(id)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to archive invite'
                setError(message)
            } finally {
                setLoading(false)
            }
        },
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
