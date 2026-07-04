import { useMemo } from 'react';

import type { Assets, BootstrapService, Endpoints, SiteSettings } from './bootstrap.types';

const mockSettings: SiteSettings = {
  social: { facebook: '#', twitter: '#', instagram: '#' },
  contact: {
    email: 'diariolx@escs.ipl.pt',
    address: 'Campus de Benfica - Edifício Escola Superior de Comunicação Social, LIACOM - piso 1 549-014, Lisboa',
  },
  publication: {
    erc: '128219',
    periodicity: 'Diário',
    owner: 'Escola Superior de Comunicação Social (ESCS) - Instituto Politécnico de Lisboa',
    nipc: '508 519 713',
  },
  navigation: {
    featured: [
      { name: 'Lisboa, Cidade Aberta', slug: 'lisboa-cidade-aberta', color: '#1E90FF' },
      { name: 'A Fundo', slug: 'a-fundo', color: '#FF5733' },
    ],
    sections: [
      { name: 'Mundo', slug: 'mundo', color: '#3B82F6' },
      { name: 'Política', slug: 'politica', color: '#EF4444' },
      {
        name: 'Sociedade',
        slug: 'sociedade',
        color: '#10B981',
        children: [
          { name: 'Educação', slug: 'educacao', color: '#6366F1' },
          { name: 'Saúde', slug: 'saude', color: '#EC4899' },
          { name: 'Habitação', slug: 'habitacao', color: '#84CC16' },
          { name: 'Justiça', slug: 'justica', color: '#F97316' },
          { name: 'Ambiente', slug: 'ambiente', color: '#22C55E' },
        ],
      },
      { name: 'Cultura', slug: 'cultura', color: '#A855F7' },
      { name: 'Media', slug: 'media', color: '#F59E0B' },
      { name: 'Desporto', slug: 'desportos', color: '#06B6D4' },
    ],
    showPhotos: true,
    showPodcasts: true,
    showVideos: true,
  },
};

export const useBootstrapMockService = (): BootstrapService => {
  return useMemo<BootstrapService>(() => ({
    async fetchBootstrapData() {
      return { api: {} as Endpoints, assets: {} as Assets, creditRoles: [], sections: [], settings: mockSettings };
    },
  }), [])
};
