import { useMemo } from 'react';

import { useBootstrap } from '@/shared/hooks/useBootstrap';

import { useApi } from '../http/client';
import type { MediaService, MediasResponse, SignedUpload } from './media.types';

export const useMediaApiService = (): MediaService => {
  const { get, post } = useApi()
  const { endpoints } = useBootstrap()

  return useMemo<MediaService>(() => ({
    async fetchAll(params) {
      const result = await get<MediasResponse>(`${endpoints.backoffice.medias.list.href}?${new URLSearchParams(params as Record<string, string>)}`);
      if (!result.success) {
        throw new Error('Failed to fetch media');
      }
      return result.data;
    },

    async getSignedUrl(media) {
      const result = await post<SignedUpload>(endpoints.backoffice.medias.signedUrl.href, {
        altText: media.altText,
        credits: media.credits.map(
          (credit) => ({
            userId: credit.userId,
            role: credit.role,
          })
        ),
        originalFileName: media.file.name,
        mimeType: media.file.type,
        uploadType: media.uploadType
      });
      if (!result.success) {
        throw new Error('Failed to get signed URL');
      }
      return result.data;
    },

    async completeUpload(id) {
      const result = await post(endpoints.backoffice.medias.completeUpload.href.replace('{id}', id), {});
      if (!result.success) {
        throw new Error('Failed to complete upload');
      }
    },

  }), [get, post, endpoints])
}
