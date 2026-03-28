export type QueryParamMap = Record<string, string>;

export type QueryPrimitive = string | number | boolean | null | undefined;

export type QueryValue = QueryPrimitive | QueryPrimitive[];

export type Query = Record<string, QueryValue>;