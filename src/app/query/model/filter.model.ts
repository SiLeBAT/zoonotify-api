export interface FilterConfigurationPort {
    getFilterConfiguration(): Promise<FilterConfiguration[]>;
}

export interface FilterConfigurationService extends FilterConfigurationPort {}

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
