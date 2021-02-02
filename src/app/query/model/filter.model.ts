import { Filter, QueryParameters } from './shared.model';

export type FilterConfigurationCollection = FilterConfiguration[];

export interface FilterPort {
    getFilterConfiguration(): Promise<FilterConfigurationCollection>;
    createFilter(queryParameters: QueryParameters): Promise<Filter>;
    getFilterDefinitions(): FilterDefinitionCollection;
}

export interface FilterService extends FilterPort {}

export type FilterValueCollection = string[];
export interface FilterConfiguration {
    id: string;
    values: FilterValueCollection;
}

export interface FilterDefinition {
    valueProvider: FilterValueProvider;
    id: string;
    modelAttribute: string;
}

export type FilterDefinitionCollection = FilterDefinition[];
export interface FilterValueProvider {
    (): Promise<FilterValueCollection>;
}
