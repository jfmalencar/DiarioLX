import type { MediaService, Media } from './media.types';

const fakeMedia: Media[] = []

export const mediaMockService: MediaService = {
  async fetchAll() {
    return {
      medias: fakeMedia,
    };
  },

  async upload(file) {
    const newFile = {
      id: String(fakeMedia.length + 1),
      type: file.file.type.split('/')[0] as 'image' | 'video' | 'audio',
      url: URL.createObjectURL(file.file),
      thumbnailUrl: null,
      alt: file.alt,
      mimeType: file.file.type,
      photographer: file.photographer,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await new Promise((resolve) => setTimeout(resolve, 2000));
    fakeMedia.push(newFile);
    return newFile;
  },

  async getSignedUrl() {
    return {
      id: String(fakeMedia.length + 1),
      signedUrl: '/api/media/'
    };
  },

  async completeUpload() {
    return;
  }
};
