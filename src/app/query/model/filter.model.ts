export interface FilterPort {
    getFilterConfiguration(): Promise<FilterConfiguration[]>;
}

export interface FilterService extends FilterPort {}

export interface FilterConfiguration {
    id: string;
    name: string;
    values: string[];
}

export interface FilterDefinition {
    valueProvider: FilterValueProvider;
    id: string;
}

export interface FilterValueProvider {
    (): Promise<string[]>;
}
