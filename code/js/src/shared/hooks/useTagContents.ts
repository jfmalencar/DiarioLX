import { useContentList } from './useContentList';

export const useTagContents = (slug: string | undefined) => useContentList({ tag: slug });
