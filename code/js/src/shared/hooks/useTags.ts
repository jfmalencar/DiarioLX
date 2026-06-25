
import { useState, useCallback } from 'react';

import { useTagsService } from '@/shared/services/tags';
import type { Tag, TagFormValues } from '@/shared/services/tags/tags.types';
import type { Query } from '@/shared/types/Query';
import type { Pagination } from '@/shared/types/Pagination';
import type { Result } from '@/shared/types/Result';
import { runAction } from '@/shared/utils/action';

export type { Tag, TagFormValues };

export const useTags = () => {
    const [pagination, setPagination] = useState<Pagination | null>(null)
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const tagsService = useTagsService()

    const fetchOne = useCallback(
        async (id: number): Promise<Tag | undefined> => {
            setLoading(true)
            setError(null)
            try {
                const data = await tagsService.fetchOne(id)
                return data
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to fetch tag'
                setError(message)
                return undefined
            } finally {
                setLoading(false)
            }
        },
        [tagsService]
    )

    const fetchAll = useCallback(
        async (params: Query): Promise<undefined> => {
            setLoading(true)
            setError(null)
            try {
                const data = await tagsService.fetchAll(params)
                setTags(data.items)
                setPagination(data.pagination)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to fetch tags'
                setError(message)
                setTags([])
            } finally {
                setLoading(false)
            }
        },
        [tagsService]
    )

    const create = useCallback(
        (tag: TagFormValues): Promise<Result<number>> =>
            runAction(() => tagsService.create(tag), 'Failed to create tag', setLoading, setError),
        [tagsService]
    )

    const update = useCallback(
        (id: number, tag: TagFormValues): Promise<Result> =>
            runAction(() => tagsService.update(id, tag), 'Failed to update tag', setLoading, setError),
        [tagsService]
    )

    const archive = useCallback(
        (id: number): Promise<Result> =>
            runAction(() => tagsService.archive(id), 'Failed to archive tag', setLoading, setError),
        [tagsService]
    )

    const unarchive = useCallback(
        (id: number): Promise<Result> =>
            runAction(() => tagsService.unarchive(id), 'Failed to unarchive tag', setLoading, setError),
        [tagsService]
    )

    const remove = useCallback(
        (id: number): Promise<Result> =>
            runAction(() => tagsService.delete(id), 'Failed to delete tag', setLoading, setError),
        [tagsService]
    )

    return {
        loading,
        error,
        tags,
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