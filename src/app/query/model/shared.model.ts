export type DependentQueryFilter = {
    trigger: string;
    dependent: {
        [key: string]: QueryValue;
    };
};

export type QueryValue = string | (string | DependentQueryFilter)[];
export interface EntityGateway<T> {
    findAll(filter?: QueryFilter): Promise<T[]>;
}
type QueryParametersValue = string | string[];

export type QueryParameters = Record<string, QueryParametersValue>;

export type GroupAttributes = string[];

export type QueryFilter = Record<string, QueryValue>;
