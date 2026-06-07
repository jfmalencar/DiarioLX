
import { useState, useCallback } from 'react';

import { useContentsService } from '../services/contents';

import type { Content, UpdateContentRequest, ContentSummary, CreateContentRequest } from '../services/contents/contents.types';
import type { Query } from '@/shared/types/Query';
import type { Pagination } from '@/shared/types/Pagination';

export type { Content, ContentSummary, UpdateContentRequest as ContentRequest };

export const useContents = () => {
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [contents, setContents] = useState<ContentSummary[]>([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const contentsService = useContentsService()

    const fetchOne = useCallback(
        async (slug: string): Promise<Content | undefined> => {
            setLoading(true)
            setError(null)
            try {
                const data = await contentsService.fetchOne(slug)
                return data
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to fetch category'
                setError(message)
                return undefined
            } finally {
                setLoading(false)
            }
        },
        [contentsService]
    )

    const fetchAll = useCallback(
        async (params: Query): Promise<undefined> => {
            setLoading(true)
            setError(null)
            try {
                const data = await contentsService.fetchAll(params)
                setContents(data.items)
                setPagination(data.pagination)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to fetch contents'
                setError(message)
                setContents([])
            } finally {
                setLoading(false)
            }
        },
        [contentsService]
    )

    const fetchPublished = useCallback(
        async (params: Query): Promise<undefined> => {
            setLoading(true)
            setError(null)
            try {
                const data = await contentsService.fetchPublished(params)
                setContents(data.items)
                setPagination(data.pagination)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to fetch contents'
                setError(message)
                setContents([])
            } finally {
                setLoading(false)
            }
        },
        [contentsService]
    )

    const create = useCallback(
        async (content: CreateContentRequest): Promise<number> => {
            setLoading(true)
            setError(null)
            try {
                const newContentId = await contentsService.create(content)
                return newContentId
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to create category'
                setError(message)
                throw err
            } finally {
                setLoading(false)
            }
        },
        [contentsService]
    )

    const update = useCallback(
        async (id: number, content: UpdateContentRequest): Promise<void> => {
            setLoading(true)
            setError(null)
            try {
                await contentsService.update(id, content)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to update content'
                setError(message)
            } finally {
                setLoading(false)
            }
        },
        [contentsService]
    )

    const publish = useCallback(
        async (id: number): Promise<boolean> => {
            setLoading(true)
            setError(null)
            try {
                await contentsService.publish(id)
                return true
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to publish content'
                setError(message)
                return false
            } finally {
                setLoading(false)
            }
        },
        [contentsService]
    )


    const archive = useCallback(
        async (id: number): Promise<void> => {
            setLoading(true)
            setError(null)
            try {
                await contentsService.archive(id)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to archive content'
                setError(message)
            } finally {
                setLoading(false)
            }
        },
        [contentsService]
    )

    const deleteContent = useCallback(
        async (id: number): Promise<void> => {
            setLoading(true)
            setError(null)
            try {
                await contentsService.delete(id)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to delete content'
                setError(message)
                throw err
            } finally {
                setLoading(false)
            }
        },
        [contentsService]
    )

    return {
        loading,
        error,
        contents,
        pagination,
        fetchAll,
        fetchPublished,
        fetchOne,
        create,
        update,
        publish,
        archive,
        delete: deleteContent
    }
}