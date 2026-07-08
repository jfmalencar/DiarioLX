import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useContents, type Content } from '@/shared/hooks/useContents';
import { ContentPreview } from '@/shared/components/ContentPreview';
import { ContentPreviewSkeleton } from '@/shared/components/ContentPreviewSkeleton';
import { NotFound } from '@/modules/public/NotFound';

export function Content() {
    const { slug } = useParams();
    const { fetchBySlug } = useContents();
    const [content, setContent] = useState<Content | undefined>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        const loadContent = async () => {
            if (!slug) {
                setLoading(false);
                return;
            }
            setLoading(true);
            const result = await fetchBySlug(slug);
            if (active) {
                setContent(result);
                setLoading(false);
            }
        };
        loadContent();
        return () => {
            active = false;
        };
    }, [fetchBySlug, slug]);

    if (loading) return <ContentPreviewSkeleton />;
    if (!content) return <NotFound />;

    return <ContentPreview content={content} />;
}
