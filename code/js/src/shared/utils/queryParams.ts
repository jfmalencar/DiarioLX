type QueryTypeString = 'string' | 'number' | 'array'
type QueryType = string | number | string[];

export const getQueryParams = (
    searchParams: URLSearchParams,
    config: Record<
        string,
        {
            type?: QueryTypeString;
            param?: string;
        }
    >
) => {
    const result: Record<string, QueryType> = {};

    Object.entries(config).forEach(([key, options]) => {
        const { type = 'string', param = key } = options;
        const raw = searchParams.get(key);

        if (type === 'array') {
            const value = raw
                ? raw.split(',').map((v) => v.trim()).filter(Boolean)
                : [];

            if (value.length > 0) result[param] = value;
            return;
        }

        if (type === 'number') {
            const num = Number(raw);
            const value = !Number.isNaN(num) && raw !== null ? num : undefined;

            if (value !== undefined) result[param] = value;
            return;
        }

        const value = raw ? raw.trim() : '';
        if (value && value !== '') result[param] = value;
    });

    return result;
}