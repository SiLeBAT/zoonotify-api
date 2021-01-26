export type FilterConfigurationCollection = FilterConfiguration[];
export interface FilterConfigurationPort {
    getFilterConfiguration(): Promise<FilterConfigurationCollection>;
}

export interface FilterConfigurationService extends FilterConfigurationPort {}

export type FilterValueCollection = string[];
export interface FilterConfiguration {
    id: string;
    name: string;
    values: FilterValueCollection;
}

export interface FilterDefinition {
    valueProvider: FilterValueProvider;
    id: string;
}

export type FilterDefinitionCollection = FilterDefinition[];
export interface FilterValueProvider {
    (): Promise<FilterValueCollection>;
}
