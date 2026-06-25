import { useMemo } from 'react';

import type {
  FeaturedService,
  BackofficeHomepageResponse,
  SaveHomepageRequest,
  FeaturedSectionResponse,
} from './featured.types';

const fakeSections: FeaturedSectionResponse[] = [
  { id: 1, type: 'HIGHLIGHT', category: null, position: 0, contents: [] },
  { id: 2, type: 'FEATURED', category: null, position: 1, contents: [] },
  { id: 3, type: 'CATEGORY', category: null, position: 2, contents: [] },
  { id: 4, type: 'PHOTOS', category: null, position: 3, contents: [] },
  { id: 5, type: 'PODCASTS', category: null, position: 4, contents: [] },
  { id: 6, type: 'VIDEOS', category: null, position: 5, contents: [] },
];

export const useFeaturedMockService = (): FeaturedService => {
  return useMemo<FeaturedService>(
    () => ({
      async getHomepage(): Promise<BackofficeHomepageResponse> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { sections: fakeSections };
      },

      async save(request: SaveHomepageRequest): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        fakeSections.length = 0;
        request.sections.forEach((s, idx) => {
          fakeSections.push({
            id: idx + 1,
            type: s.type,
            category: null,
            position: idx,
            contents: [],
          });
        });
      },
    }),
    [],
  );
};