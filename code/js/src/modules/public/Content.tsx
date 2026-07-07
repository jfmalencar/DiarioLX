import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useContents, type Content } from '@/shared/hooks/useContents';
import { ContentPreview } from '@/shared/components/ContentPreview';
import { ContentPreviewSkeleton } from '@/shared/components/ContentPreviewSkeleton';

export function Content() {
    const { slug } = useParams();
    const { fetchBySlug } = useContents();
    const [content, setContent] = useState<Content | undefined>();

    useEffect(() => {
        const loadContent = async () => {
            if (slug) {
                const result = await fetchBySlug(slug);
                console.log('result', result);
                setContent(result);
            }
        };
        loadContent();
    }, [fetchBySlug, slug]);

    if (!content) return <ContentPreviewSkeleton />;

    return <ContentPreview content={content} />;
}