
import { useState, useCallback } from 'react';

import { mediaService } from '@/shared/services/media';
import type { Query } from '@/shared/types/Query';
import type { Media, MediaFormValues, SignedUpload } from '@/shared/services/media/media.types';

export type { Media, MediaFormValues, SignedUpload };

export const useMedia = () => {
    const [medias, setMedias] = useState<Media[]>([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchAll = useCallback(
        async (params: Query): Promise<undefined> => {
            setLoading(true)
            setError(null)
            try {
                const response = await mediaService.fetchAll(params)
                setMedias(response.medias)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to fetch articles'
                setError(message)
                setMedias([])
            } finally {
                setLoading(false)
            }
        },
        []
    )

    const getSignedUrl = useCallback(
        async (media: MediaFormValues): Promise<SignedUpload | undefined> => {
            setLoading(true)
            setError(null)
            try {
                return await mediaService.getSignedUrl(media)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to get signed URL'
                setError(message)
                return undefined
            } finally {
                setLoading(false)
            }
        },
        []
    )

    const upload = useCallback(
        async (media: MediaFormValues): Promise<Media | undefined> => {
            setLoading(true)
            setError(null)
            try {
                return await mediaService.upload(media)
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

    const completeUpload = useCallback(
        async (id: string): Promise<void> => {
            setLoading(true)
            setError(null)
            try {
                await mediaService.completeUpload(id)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to complete upload'
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
        medias,
        fetchAll,
        getSignedUrl,
        completeUpload,
        upload,
    }
}