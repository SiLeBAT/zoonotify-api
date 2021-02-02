export interface Filter {
    [key: string]: string | string[];
}
export interface EntityGateway<T> {
    findAll(filter?: Filter): Promise<T[]>;
}

export type QueryParameters = Record<string, string | string[]>;
