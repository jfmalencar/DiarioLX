
import { useState, useCallback } from 'react';

import { useUsersService } from '@/shared/services/users';
import type { ResetRequest, User, UserRole } from '@/shared/services/users/users.types';
import type { Query } from '@/shared/types/Query';
import type { Pagination } from '@/shared/types/Pagination';
import type { Result } from '@/shared/types/Result';
import { runAction } from '@/shared/utils/action';
import { useAuthApiService } from '../services/auth/auth.api';

export type { User, UserRole };

export const useUsers = () => {
    const usersService = useUsersService();
    const authService = useAuthApiService();
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [resetRequests, setResetRequests] = useState<ResetRequest[]>([]);
    const [resetRequestsPagination, setResetRequestsPagination] = useState<Pagination | null>(null);
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

    const updateRole = useCallback(
        (id: number, role: UserRole): Promise<Result> =>
            runAction(() => usersService.updateRole(id, role), 'Failed to change role', setLoading, setError),
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

    const activate = useCallback(
        (id: number): Promise<Result> =>
            runAction(() => usersService.activate(id), 'Failed to activate user', setLoading, setError),
        [usersService]
    )

    const requestPasswordReset = useCallback(
        async (username: string): Promise<Result> => {
            setLoading(true)
            setError(null)
            try {
                await authService.requestPasswordReset(username)
                return { ok: true }
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Failed to request password reset'
                setError(message)
                return { ok: false, error: message }
            } finally {
                setLoading(false)
            }
        },
        [authService]
    )

    const getAllResetRequests = useCallback(
        async (params: Query): Promise<undefined> => {
            setLoading(true)
            setError(null)
            try {
                const data = await usersService.getAllResetRequests(params)
                setResetRequests(data.items)
                setResetRequestsPagination(data.pagination)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to fetch reset requests'
                setError(message)
                setResetRequests([])
            } finally {
                setLoading(false)
            }
        },
        [usersService]
    )

    const approveResetRequest = useCallback(
        (id: number): Promise<Result> =>
            runAction(() => usersService.approveResetRequest(id), 'Failed to approve reset request', setLoading, setError),
        [usersService]
    )

    const rejectResetRequest = useCallback(
        (id: number): Promise<Result> =>
            runAction(() => usersService.rejectResetRequest(id), 'Failed to reject reset request', setLoading, setError),
        [usersService]
    )

    const completePasswordReset = useCallback(
        async (resetToken: string, newPassword: string): Promise<Result> => {
            setLoading(true)
            setError(null)
            try {
                const result = await authService.completePasswordReset(resetToken, newPassword)
                if (result) {
                    return { ok: true }
                } else {
                    throw new Error('Failed to complete password reset')
                }
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Failed to complete password reset'
                setError(message)
                return { ok: false, error: message }
            } finally {
                setLoading(false)
            }
        },
        [authService]
    )

    return {
        loading,
        error,
        users,
        pagination,
        fetchAll,
        updateProfile,
        updateRole,
        setOnTeam,
        completeAvatarUpload,
        deactivate,
        activate,
        remove,
        resetRequests,
        resetRequestsPagination,
        requestPasswordReset,
        getAllResetRequests,
        approveResetRequest,
        rejectResetRequest,
        completePasswordReset
    }
}
