import type { ContentSummary } from '@/shared/services/contents/contents.types';
import type { SectionType } from '@/modules/backoffice/home/Homepage.types';

export type FeaturedSectionResponse = {
  id: number;
  type: SectionType;
  category: {
    id: number;
    name: string;
    color: string;
    slug: string
  } | null;
  position: number;
  contents: ContentSummary[];
};

export type BackofficeHomepageResponse = {
  sections: FeaturedSectionResponse[];
};

export type FeaturedSectionRequest = {
  type: SectionType;
  categoryId: number | null;
  contentIds: number[];
};

export type SaveHomepageRequest = {
  sections: FeaturedSectionRequest[];
};

export interface FeaturedService {
  getHomepage(): Promise<BackofficeHomepageResponse>;

  save(request: SaveHomepageRequest): Promise<void>;
}
