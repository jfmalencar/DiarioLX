import { get, upload, post } from '../http/client';
import type { Media, MediaService, MediasResponse, SignedUpload } from './media.types';

export const mediaApiService: MediaService = {

  async fetchAll(params) {
    const result = await get<MediasResponse>('/api/media?' + new URLSearchParams(params as Record<string, string>).toString());
    if (!result.success) {
      throw new Error('Failed to fetch media');
    }
    return result.data;
  },

  async upload(media) {
    const formData = new FormData();
    formData.append('file', media.file);
    formData.append('altText', media.altText);
    formData.append('photographerId', media.photographerId);

    const result = await upload<Media>('/api/media', formData);
    if (!result.success) {
      throw new Error('Failed to upload media');
    }
    return result.data;
  },

  async getSignedUrl(media) {
    const result = await post<SignedUpload>('/api/media/signed-url', {
      altText: media.altText,
      photographerId: media.photographerId,
      originalFileName: media.file.name,
      contentType: media.file.type,
    });
    if (!result.success) {
      throw new Error('Failed to get signed URL');
    }
    return result.data;
  },

  async completeUpload(id) {
    const result = await post(`/api/media/${id}`, {});
    if (!result.success) {
      throw new Error('Failed to complete upload');
    }
  }
}
