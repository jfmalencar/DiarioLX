
import { useState, useCallback } from 'react';
import { useCategoriesService } from '@/shared/services/categories';
import type { Category, CategoryFormValues } from '@/shared/services/categories/categories.types';
import type { Query } from '@/shared/types/Query';
import type { Pagination } from '@/shared/types/Pagination';
import type { Result } from '@/shared/types/Result';
import { runAction } from '@/shared/utils/action';

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
        (category: CategoryFormValues): Promise<Result<boolean>> =>
            runAction(() => categoriesService.create(category), 'Failed to create category', setLoading, setError),
        [categoriesService]
    )

    const update = useCallback(
        (id: number, category: CategoryFormValues): Promise<Result> =>
            runAction(() => categoriesService.update(id, category), 'Failed to update category', setLoading, setError),
        [categoriesService]
    )

    const archive = useCallback(
        (id: number): Promise<Result> =>
            runAction(() => categoriesService.archive(id), 'Failed to archive category', setLoading, setError),
        [categoriesService]
    )

    const unarchive = useCallback(
        (id: number): Promise<Result> =>
            runAction(() => categoriesService.unarchive(id), 'Failed to unarchive category', setLoading, setError),
        [categoriesService]
    )

    const remove = useCallback(
        (id: number): Promise<Result> =>
            runAction(() => categoriesService.delete(id), 'Failed to delete category', setLoading, setError),
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