import { get, upload, post } from '../http/client';
import type { Media, MediaService, MediasResponse, SignedUpload, UserSignedUpload } from './media.types';

export const mediaApiService: MediaService = {

  async fetchAll(params) {
    const result = await get<MediasResponse>('/api/medias?' + new URLSearchParams(params as Record<string, string>).toString());
    if (!result.success) {
      throw new Error('Failed to fetch media');
    }
    return result.data;
  },

  async upload(media) {
    const formData = new FormData();
    formData.append('file', media.file);
    formData.append('altText', media.altText);
    formData.append('credits', JSON.stringify(media.credits));

    const result = await upload<Media>('/api/medias', formData);
    if (!result.success) {
      throw new Error('Failed to upload media');
    }
    return result.data;
  },

  async getSignedUrl(media) {
    const result = await post<SignedUpload>('/api/medias/signed-url', {
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
    const result = await post<UserSignedUpload>('/api/medias/user-signed-url', {
      contentType: media.file.type,
    });
    if (!result.success) {
      throw new Error('Failed to get user signed URL');
    }
    return result.data;
  },

  async completeUpload(id) {
    const result = await post(`/api/medias/${id}`, {});
    if (!result.success) {
      throw new Error('Failed to complete upload');
    }
  }
}
