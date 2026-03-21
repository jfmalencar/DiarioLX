import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export type FiltersValue = Record<string, string[]>;

export type FilterSection = {
    key: string;
    title: string;
    options: { value: string; label: string }[];
};

type UseFiltersReturn = {
    isOpen: boolean;
    draft: FiltersValue;
    open: () => void;
    close: () => void;
    clear: () => void;
    apply: () => void;
    setDraft: (value: FiltersValue) => void;
};

const buildEmptyValue = (sections: FilterSection[]): FiltersValue => {
    return sections.reduce<FiltersValue>((acc, section) => {
        acc[section.key] = [];
        return acc;
    }, {});
}

const readFiltersFromSearchParams = (
    searchParams: URLSearchParams,
    sections: FilterSection[]
): FiltersValue => {
    return sections.reduce<FiltersValue>((acc, section) => {
        acc[section.key] = (searchParams.get(section.key) || '')
            .split(',')
            .map((value) => value.trim())
            .filter((value) => value.length > 0);
        return acc;
    }, {});
}

export const useFilters = (sections: FilterSection[]): UseFiltersReturn => {
    const [isOpen, setIsOpen] = useState(false);
    const [draft, setDraft] = useState<FiltersValue>(buildEmptyValue(sections));
    const [searchParams, setSearchParams] = useSearchParams();

    const open = () => {
        setDraft(readFiltersFromSearchParams(searchParams, sections));
        setIsOpen(true);
    }

    const close = () => {
        setIsOpen(false);
    }

    const clear = () => {
        setDraft(buildEmptyValue(sections));
    }

    const apply = () => {
        const nextParams = new URLSearchParams(searchParams);

        sections.forEach((section) => {
            const values = draft[section.key] || [];
            if (values.length > 0) {
                nextParams.set(section.key, values.join(','));
            } else {
                nextParams.delete(section.key);
            }
        });

        nextParams.delete('page');
        setSearchParams(nextParams, { replace: true });
        setIsOpen(false);
    }

    return {
        isOpen,
        draft,
        open,
        close,
        clear,
        apply,
        setDraft,
    };
}
