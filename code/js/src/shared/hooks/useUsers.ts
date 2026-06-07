
import { useState, useCallback } from 'react';

import { useUsersService } from '@/shared/services/users';
import type { User } from '@/shared/services/users/users.types';
import type { Query } from '@/shared/types/Query';
import type { Pagination } from '@/shared/types/Pagination';

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
        async (username?: string, email?: string, password?: string, firstName?: string, lastName?: string, bio?: string | null): Promise<boolean> => {
            setLoading(true)
            setError(null)
            try {
                const updatedUser = await usersService.updateProfile(username, email, password, firstName, lastName, bio)
                if (!updatedUser) {
                    setError('Failed to update profile')
                    return false
                }
                return true
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to update profile'
                setError(message)
                return false
            } finally {
                setLoading(false)
            }
        },
        [usersService]
    )

    const completeAvatarUpload = useCallback(
        async (id: string): Promise<void> => {
            setLoading(true)
            setError(null)
            try {
                await usersService.completeAvatarUpload(id)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to complete avatar upload'
                setError(message)
            } finally {
                setLoading(false)
            }
        },
        [usersService]
    )

    return {
        loading,
        error,
        users,
        pagination,
        fetchAll,
        updateProfile,
        completeAvatarUpload
    }
}
