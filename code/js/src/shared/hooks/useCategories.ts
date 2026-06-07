
import { useState, useCallback } from 'react';
import { useCategoriesService } from '@/shared/services/categories';
import type { Category, CategoryFormValues } from '@/shared/services/categories/categories.types';
import type { Query } from '@/shared/types/Query';
import type { Pagination } from '@/shared/types/Pagination';

export type { Category, CategoryFormValues };

export const useCategories = () => {
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const categoriesService = useCategoriesService()

    const fetchOne = useCallback(
        async (id: number): Promise<Category | undefined> => {
            setLoading(true)
            setError(null)
            try {
                const data = await categoriesService.fetchOne(id)
                return data
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to fetch category'
                setError(message)
                return undefined
            } finally {
                setLoading(false)
            }
        },
        [categoriesService]
    )

    const fetchAll = useCallback(
        async (params: Query): Promise<undefined> => {
            setLoading(true)
            setError(null)
            try {
                const data = await categoriesService.fetchAll(params)
                setCategories(data.items)
                setPagination(data.pagination)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to fetch categories'
                setError(message)
                setCategories([])
            } finally {
                setLoading(false)
            }
        },
        [categoriesService]
    )

    const create = useCallback(
        async (category: CategoryFormValues): Promise<boolean> => {
            setLoading(true)
            setError(null)
            try {
                await categoriesService.create(category)
                return true
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to create category'
                setError(message)
                return false
            } finally {
                setLoading(false)
            }
        },
        [categoriesService]
    )

    const update = useCallback(
        async (id: number, category: CategoryFormValues): Promise<boolean> => {
            setLoading(true)
            setError(null)
            try {
                await categoriesService.update(id, category)
                return true
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to update category'
                console.log(message)
                setError(message)
                return false
            } finally {
                setLoading(false)
            }
        },
        [categoriesService]
    )

    const archive = useCallback(
        async (id: number): Promise<void> => {
            setLoading(true)
            setError(null)
            try {
                await categoriesService.archive(id)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to archive category'
                setError(message)
            } finally {
                setLoading(false)
            }
        },
        [categoriesService]
    )

    const unarchive = useCallback(
        async (id: number): Promise<void> => {
            setLoading(true)
            setError(null)
            try {
                await categoriesService.unarchive(id)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to unarchive category'
                setError(message)
            } finally {
                setLoading(false)
            }
        },
        [categoriesService]
    )

    const remove = useCallback(
        async (id: number): Promise<void> => {
            setLoading(true)
            setError(null)
            try {
                await categoriesService.delete(id)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to delete category'
                setError(message)
            } finally {
                setLoading(false)
            }
        },
        [categoriesService]
    )

    return {
        loading,
        error,
        categories,
        pagination,
        fetchAll,
        fetchOne,
        create,
        update,
        archive,
        unarchive,
        remove
    }
}