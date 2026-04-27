
import { useState, useCallback } from 'react';
import { categoriesService } from '@/shared/services/categories';
import type { Category, CategoryFormValues } from '@/shared/services/categories/categories.types';
import type { Query } from '@/shared/types/Query';

export type { Category, CategoryFormValues };

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchOne = useCallback(
        async (id: string): Promise<Category | undefined> => {
            setLoading(true)
            setError(null)
            try {
                const data = await categoriesService.fetchOne(id)
                return data.category
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to fetch category'
                setError(message)
                return undefined
            } finally {
                setLoading(false)
            }
        },
        []
    )

    const fetchAll = useCallback(
        async (params: Query): Promise<undefined> => {
            setLoading(true)
            setError(null)
            try {
                const data = await categoriesService.fetchAll(params)
                setCategories(data.categories)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to fetch categories'
                setError(message)
                setCategories([])
            } finally {
                setLoading(false)
            }
        },
        []
    )

    const create = useCallback(
        async (category: CategoryFormValues): Promise<string | undefined> => {
            setLoading(true)
            setError(null)
            try {
                const newCategoryId = await categoriesService.create(category)
                return newCategoryId
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to create category'
                setError(message)
                return undefined
            } finally {
                setLoading(false)
            }
        },
        []
    )

    const update = useCallback(
        async (id: string, category: CategoryFormValues): Promise<void> => {
            setLoading(true)
            setError(null)
            try {
                await categoriesService.update(id, category)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to update category'
                setError(message)
            } finally {
                setLoading(false)
            }
        },
        []
    )


    const archive = useCallback(
        async (id: string): Promise<void> => {
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
        []
    )

    const unarchive = useCallback(
        async (id: string): Promise<void> => {
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
        []
    )

    return {
        loading,
        error,
        categories,
        fetchAll,
        fetchOne,
        create,
        update,
        archive,
        unarchive
    }
}