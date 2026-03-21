
import { useState, useCallback, useMemo } from 'react';
import { categoriesService } from '../services/categories/index';
import { useSearchParams } from 'react-router-dom';
import { getQueryParams } from '../utils/queryParams';

export type Category = {
    id: string;
    name: string;
    slug: string;
    color: string;
    description?: string;
    parentName?: string | null;
    count: number;
}

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

    const fetch = useCallback(
        async (): Promise<undefined> => {
            setLoading(true)
            setError(null)
            try {
                const categoriesList = await categoriesService.fetch(query)
                setCategories(categoriesList.categories)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Login failed'
                setError(message)
                setCategories([])
            } finally {
                setLoading(false)
            }
        },
        [query]
    )

    return {
        loading,
        error,
        fetch,
        categories
    }
}