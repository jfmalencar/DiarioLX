import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { Query, QueryParamMap, QueryValue } from '@/shared/types/Query';

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
    buildQuery: (paramMap?: QueryParamMap, extraParams?: Query) => Query;
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

const normalizeQueryValue = (value: QueryValue): string | null => {
    if (value === null || value === undefined) {
        return null;
    }

    if (Array.isArray(value)) {
        const values = value
            .filter((item) => item !== null && item !== undefined)
            .map((item) => String(item).trim())
            .filter((item) => item.length > 0);

        return values.length > 0 ? values.join(',') : null;
    }

    const normalized = String(value).trim();
    return normalized.length > 0 ? normalized : null;
};

export const useFilters = (sections: FilterSection[] = []): UseFiltersReturn => {
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

    const buildQuery = useCallback((paramMap: QueryParamMap = {}, extraParams: Query = {}): Query => {
        const result: Query = {};
        const handledKeys = new Set<string>();

        searchParams.forEach((_, key) => {
            if (handledKeys.has(key)) return;
            handledKeys.add(key);

            const apiKey = paramMap[key];
            if (!apiKey) return;

            const allValues = searchParams.getAll(key);
            const value: QueryValue = allValues.length > 1 ? allValues : (allValues[0] ?? null);

            const normalized = normalizeQueryValue(value);
            if (normalized !== null) {
                result[apiKey] = normalized;
            }
        });

        Object.entries(extraParams).forEach(([apiKey, value]) => {
            const normalized = normalizeQueryValue(value);
            if (normalized !== null) {
                result[apiKey] = normalized;
            }
        });

        return result;
    }, [searchParams]);

    return {
        isOpen,
        draft,
        open,
        close,
        clear,
        apply,
        setDraft,
        buildQuery,
    };
}
