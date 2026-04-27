
import { useState, useCallback } from 'react';

import { usersService } from '@/shared/services/users';
import type { User } from '@/shared/services/users/users.types';
import type { Query } from '@/shared/types/Query';

export type { User };

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchAll = useCallback(
        async (params: Query): Promise<undefined> => {
            setLoading(true)
            setError(null)
            try {
                const data = await usersService.fetchAll(params)
                setUsers(data.users)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to fetch users'
                setError(message)
                setUsers([])
            } finally {
                setLoading(false)
            }
        },
        []
    )

    return {
        loading,
        error,
        users,
        fetchAll,
    }
}
