import { useMemo } from 'react';

import type { MediaService, Media } from './media.types';

const fakeMedia: Media[] = []

export const useMediaMockService = (): MediaService => {
  return useMemo<MediaService>(() => ({

    async fetchAll() {
      return {
        items: fakeMedia,
        pagination: {
          page: 1,
          size: 1,
          hasPrevious: false,
          hasNext: false,
        }
      };
    },

    async getSignedUrl() {
      return {
        id: String(fakeMedia.length + 1),
        signedUrl: '/api/media/'
      };
    },

    async getUserSignedUrl() {
      return {
        signedUrl: '/api/media/user-profile'
      };
    },

    async completeUpload() {
      return;
    }
  }), [])
};
