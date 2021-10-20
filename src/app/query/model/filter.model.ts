import { Filter, QueryParameters } from './shared.model';

export type FilterConfigurationCollection = FilterConfiguration[];

export interface FilterPort {
    getFilterConfiguration(filterName: string, filter?: Filter): Promise<FilterConfiguration>;
    getAllFilterConfiguration(): Promise<FilterConfigurationCollection>;
    createFilter(queryParameters: QueryParameters): Promise<Filter>;
    readonly filterDefinitions: FilterDefinitionCollection;
}

export interface FilterNamesToAttributesHash {
    [key: string]: string;
}
export interface FilterService extends FilterPort {}

export type FilterValueCollection = (string | number | boolean)[];
export interface FilterConfiguration {
    readonly id: string;
    readonly values: FilterValueCollection;
}

export interface FilterDefinition {
    readonly valueProvider: FilterValueProvider;
    readonly id: string;
}

export type FilterDefinitionCollection = string[];
export interface FilterValueProvider {
    (): Promise<FilterValueCollection>;
}
