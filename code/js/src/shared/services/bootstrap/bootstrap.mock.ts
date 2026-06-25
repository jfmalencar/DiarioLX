import { useMemo } from 'react';

import type { Assets, BootstrapService, Endpoints, SiteSettings } from './bootstrap.types';

const mockSettings: SiteSettings = {
  social: { facebook: '#', twitter: '#', instagram: '#' },
  contact: { email: 'diariolx@escs.ipl.pt', address: 'Campus de Benfica do IPL\n1549-014 Lisboa' },
  navigation: { featured: [], sections: [], showPhotos: true, showPodcasts: true, showVideos: true },
};

export const useBootstrapMockService = (): BootstrapService => {
  return useMemo<BootstrapService>(() => ({
    async fetchBootstrapData() {
      return { api: {} as Endpoints, assets: {} as Assets, creditRoles: [], sections: [], settings: mockSettings };
    },
  }), [])
};
