import type { TagsService } from './tags.types';
import { tagsApiService } from './tags.api';
import { tagsMockService } from './tags.mock';

const useFake = import.meta.env.VITE_MOCK_API === 'true';

export const tagsService: TagsService = useFake
  ? tagsMockService
  : tagsApiService;
