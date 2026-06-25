
import { useState, useCallback } from 'react';

import { useUsersService } from '@/shared/services/users';
import type { User } from '@/shared/services/users/users.types';
import type { Query } from '@/shared/types/Query';
import type { Pagination } from '@/shared/types/Pagination';
import type { Result } from '@/shared/types/Result';
import { runAction } from '@/shared/utils/action';

export type { User };

export const useUsers = () => {
    const usersService = useUsersService();
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchAll = useCallback(
        async (params: Query): Promise<undefined> => {
            setLoading(true)
            setError(null)
            try {
                const data = await usersService.fetchAll(params)
                setUsers(data.items)
                setPagination(data.pagination)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to fetch users'
                setError(message)
                setUsers([])
            } finally {
                setLoading(false)
            }
        },
        [usersService]
    )

    const updateProfile = useCallback(
        (username?: string, email?: string, password?: string, firstName?: string, lastName?: string, bio?: string | null, position?: string | null, onTeam?: boolean): Promise<Result<boolean | undefined>> =>
            runAction(
                () => usersService.updateProfile(username, email, password, firstName, lastName, bio, position, onTeam),
                'Failed to update profile',
                setLoading,
                setError,
            ),
        [usersService]
    )

    const completeAvatarUpload = useCallback(
        (id: number): Promise<Result> =>
            runAction(() => usersService.completeAvatarUpload(id), 'Failed to complete avatar upload', setLoading, setError),
        [usersService]
    )

    const setOnTeam = useCallback(
        (id: number, onTeam: boolean): Promise<Result> =>
            runAction(() => usersService.setOnTeam(id, onTeam), 'Failed to update team membership', setLoading, setError),
        [usersService]
    )

    const remove = useCallback(
        (id: number): Promise<Result> =>
            runAction(() => usersService.remove(id), 'Failed to remove user', setLoading, setError),
        [usersService]
    )

    const deactivate = useCallback(
        (id: number): Promise<Result> =>
            runAction(() => usersService.deactivate(id), 'Failed to deactivate user', setLoading, setError),
        [usersService]
    )

    return {
        loading,
        error,
        users,
        pagination,
        fetchAll,
        updateProfile,
        setOnTeam,
        completeAvatarUpload,
        deactivate,
        remove
    }
}
