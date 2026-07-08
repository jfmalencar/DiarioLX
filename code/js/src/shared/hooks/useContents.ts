
import { useState, useCallback } from 'react';

import { useContentsService } from '../services/contents';

import type { Content, UpdateContentRequest, ContentSummary, CreateContentRequest, ContentState, ContentHistory } from '../services/contents/contents.types';
import type { Query } from '@/shared/types/Query';
import type { Pagination } from '@/shared/types/Pagination';
import type { Result } from '@/shared/types/Result';
import { runAction } from '@/shared/utils/action';

export type { Content, ContentSummary, UpdateContentRequest as ContentRequest, ContentState };

export const useContents = () => {
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [contents, setContents] = useState<ContentSummary[]>([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const contentsService = useContentsService()

    const fetchBySlug = useCallback(
        async (slug: string): Promise<Content | undefined> => {
            setLoading(true)
            setError(null)
            try {
                const data = await contentsService.fetchBySlug(slug)
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

    const fetchById = useCallback(
        async (id: number): Promise<Content | undefined> => {
            setLoading(true)
            setError(null)
            try {
                const data = await contentsService.fetchById(id)
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

    const fetchHistoryById = useCallback(
        async (id: number): Promise<ContentHistory | undefined> => {
            setLoading(true)
            setError(null)
            try {
                const data = await contentsService.fetchHistoryById(id)
                return data
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to fetch content history'
                setError(message)
                return undefined
            } finally {
                setLoading(false)
            }
        },
        [contentsService]
    )

    const create = useCallback(
        (content: CreateContentRequest): Promise<Result<number>> =>
            runAction(() => contentsService.create(content).then((d) => d.id), 'Failed to create content', setLoading, setError),
        [contentsService]
    )

    const update = useCallback(
        (id: number, content: UpdateContentRequest): Promise<Result> =>
            runAction(() => contentsService.update(id, content), 'Failed to update content', setLoading, setError),
        [contentsService]
    )

    const publish = useCallback(
        (id: number, comment?: string, publishedAt?: number): Promise<Result> =>
            runAction(() => contentsService.publish(id, comment, publishedAt), 'Failed to publish content', setLoading, setError),
        [contentsService]
    )

    const submit = useCallback(
        (id: number): Promise<Result> =>
            runAction(() => contentsService.submit(id), 'Failed to submit content', setLoading, setError),
        [contentsService]
    )

    const reject = useCallback(
        async (id: number, comment: string): Promise<boolean> => {
            setLoading(true)
            setError(null)
            try {
                await contentsService.reject(id, comment)
                return true
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to reject content'
                setError(message)
                return false
            } finally {
                setLoading(false)
            }
        },
        [contentsService]
    )

    const archive = useCallback(
        (id: number): Promise<Result> =>
            runAction(() => contentsService.archive(id), 'Failed to archive content', setLoading, setError),
        [contentsService]
    )

    const unarchive = useCallback(
        (id: number): Promise<Result> =>
            runAction(() => contentsService.unarchive(id), 'Failed to unarchive content', setLoading, setError),
        [contentsService]
    )

    const deleteContent = useCallback(
        (id: number): Promise<Result> =>
            runAction(() => contentsService.delete(id), 'Failed to delete content', setLoading, setError),
        [contentsService]
    )

    return {
        loading,
        error,
        contents,
        pagination,
        fetchAll,
        fetchById,
        fetchBySlug,
        fetchHistoryById,
        create,
        update,
        publish,
        submit,
        reject,
        archive,
        unarchive,
        delete: deleteContent
    }
}