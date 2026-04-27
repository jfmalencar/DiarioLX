import type { ArticlesService } from './articles.types';
import { articlesApiService } from './articles.api';
import { articlesMockService } from './articles.mock';

const useFake = import.meta.env.VITE_MOCK_API === 'true';

export const articlesService: ArticlesService = useFake
  ? articlesMockService
  : articlesApiService;
