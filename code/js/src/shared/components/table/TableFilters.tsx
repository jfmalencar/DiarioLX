import { FiltersDrawer, type FilterSection } from '@/shared/components/table/FiltersDrawer';
import { useFilters } from '@/shared/hooks/useFilters';

import { useI18n } from '@/shared/hooks/useI18n';

type Props = {
    sections: FilterSection[];
};

export function TableFilters({ sections }: Props) {
    const filters = useFilters(sections);
    const { t } = useI18n();

    return (
        <>
            <button
                type='button'
                className='btn btn-link text-dark p-0 text-decoration-underline'
                onClick={filters.open}
            >
                {t('filters.title').toUpperCase()}
            </button>
            <FiltersDrawer
                isOpen={filters.isOpen}
                value={filters.draft}
                onChange={filters.setDraft}
                onClose={filters.close}
                onClear={filters.clear}
                onApply={filters.apply}
                sections={sections}
            />
        </>
    );
}
