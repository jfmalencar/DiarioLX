
import { useState, useCallback } from 'react';
import { articlesService } from '../services/articles';

import type { Article, ArticleRequest } from '../services/articles/articles.types';
import type { Query } from '@/shared/types/Query';

export type { Article, ArticleRequest };

export const useArticles = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchOne = useCallback(
        async (slug: string): Promise<Article | undefined> => {
            setLoading(true)
            setError(null)
            try {
                const data = await articlesService.fetchOne(slug)
                return data.article
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
                const data = await articlesService.fetchAll(params)
                setArticles(data.articles)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to fetch articles'
                setError(message)
                setArticles([])
            } finally {
                setLoading(false)
            }
        },
        []
    )

    const create = useCallback(
        async (article: ArticleRequest): Promise<string | undefined> => {
            setLoading(true)
            setError(null)
            try {
                const newArticleId = await articlesService.create(article)
                return newArticleId
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
        async (id: string, article: ArticleRequest): Promise<void> => {
            setLoading(true)
            setError(null)
            try {
                await articlesService.update(id, article)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to update article'
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
                await articlesService.archive(id)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to archive article'
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
                await articlesService.unarchive(id)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to unarchive article'
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
        articles,
        fetchAll,
        fetchOne,
        create,
        update,
        archive,
        unarchive
    }
}