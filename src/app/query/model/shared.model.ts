export interface QueryFilter {
    [key: string]: string | string[];
}
export interface EntityGateway<T> {
    findAll(filter?: QueryFilter): Promise<T[]>;
}

export type QueryParameters = Record<string, string | string[]>;

export type GroupAttributes = [string | null, string | null];
