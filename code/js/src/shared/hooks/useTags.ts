
import { useState, useCallback } from 'react';

import { tagsService } from '@/shared/services/tags';
import type { Tag, TagFormValues } from '@/shared/services/tags/tags.types';
import type { Query } from '@/shared/types/Query';

export type { Tag, TagFormValues };

export const useTags = () => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchOne = useCallback(
        async (id: string): Promise<Tag | undefined> => {
            setLoading(true)
            setError(null)
            try {
                const data = await tagsService.fetchOne(id)
                return data.tag
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to fetch tag'
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
                const data = await tagsService.fetchAll(params)
                setTags(data.tags)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to fetch tags'
                setError(message)
                setTags([])
            } finally {
                setLoading(false)
            }
        },
        []
    )

    const create = useCallback(
        async (tag: TagFormValues): Promise<string | undefined> => {
            setLoading(true)
            setError(null)
            try {
                const newTagId = await tagsService.create(tag)
                return newTagId
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to create tag'
                setError(message)
                return undefined
            } finally {
                setLoading(false)
            }
        },
        []
    )

    const update = useCallback(
        async (id: string, tag: TagFormValues): Promise<void> => {
            setLoading(true)
            setError(null)
            try {
                await tagsService.update(id, tag)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to update tag'
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
                await tagsService.archive(id)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to archive tag'
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
                await tagsService.unarchive(id)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to unarchive tag'
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
        tags,
        fetchAll,
        fetchOne,
        create,
        update,
        archive,
        unarchive
    }
}