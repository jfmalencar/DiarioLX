import { useMemo } from 'react';

import { useBootstrap } from '@/shared/hooks/useBootstrap';

import { useApi } from '../http/client';
import type { MediaService, MediasResponse, SignedUpload, UserSignedUpload } from './media.types';

export const useMediaApiService = (): MediaService => {
  const { get, post } = useApi()
  const { endpoints } = useBootstrap()

  return useMemo<MediaService>(() => ({
    async fetchAll(params) {
      const result = await get<MediasResponse>(`${endpoints.medias.list.href}?${new URLSearchParams(params as Record<string, string>)}`);
      if (!result.success) {
        throw new Error('Failed to fetch media');
      }
      return result.data;
    },

    async getSignedUrl(media) {
      const result = await post<SignedUpload>(endpoints.medias.signedUrl.href, {
        altText: media.altText,
        credits: media.credits.map(
          (credit) => ({
            userId: credit.userId,
            role: credit.role,
          })
        ),
        originalFileName: media.file.name,
        contentType: media.file.type,
      });
      if (!result.success) {
        throw new Error('Failed to get signed URL');
      }
      return result.data;
    },

    async getUserSignedUrl(media) {
      const result = await post<UserSignedUpload>(endpoints.medias.userSignedUrl.href, {
        contentType: media.file.type,
      });
      if (!result.success) {
        throw new Error('Failed to get user signed URL');
      }
      return result.data;
    },

    async completeUpload(id) {
      const result = await post(endpoints.medias.completeUpload.href.replace('{id}', id), {});
      if (!result.success) {
        throw new Error('Failed to complete upload');
      }
    }
  }), [get, post, endpoints])
}
