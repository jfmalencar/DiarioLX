
import { useState, useCallback, useMemo } from 'react';
import { categoriesService } from '../services/categories/index';
import { useSearchParams } from 'react-router-dom';
import { getQueryParams } from '../utils/queryParams';
import type { Category } from '../services/categories/categories.types';

export type { Category };

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchParams] = useSearchParams();

    const query = useMemo(() => getQueryParams(searchParams, {
        search: { type: 'string' },
        page: { type: 'number' },
        perPage: { type: 'number' },
    }), [searchParams]);

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
        async (): Promise<undefined> => {
            setLoading(true)
            setError(null)
            try {
                const data = await categoriesService.fetchAll(query)
                setCategories(data.categories)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to fetch categories'
                setError(message)
                setCategories([])
            } finally {
                setLoading(false)
            }
        },
        [query]
    )

    const create = useCallback(
        async (category: Omit<Category, 'id'>): Promise<string | undefined> => {
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
        async (id: string, category: Omit<Category, 'id'>): Promise<void> => {
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

    return {
        loading,
        error,
        categories,
        fetchAll,
        fetchOne,
        create,
        update
    }
}