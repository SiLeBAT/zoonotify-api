import { Filter, QueryParameters } from './shared.model';

export type FilterConfigurationCollection = FilterConfiguration[];

export interface FilterPort {
    getFilterConfiguration(): Promise<FilterConfigurationCollection>;
    createFilter(queryParameters: QueryParameters): Promise<Filter>;
    readonly filterDefinitions: FilterDefinitionCollection;
}

export interface FilterNamesToAttributesHash {
    [key: string]: string;
}
export interface FilterService extends FilterPort {
    readonly filterNamesToAttributes: FilterNamesToAttributesHash;
}

export type FilterValueCollection = string[];
export interface FilterConfiguration {
    readonly id: string;
    readonly values: FilterValueCollection;
}

export interface FilterDefinition {
    readonly valueProvider: FilterValueProvider;
    readonly id: string;
    readonly modelAttribute: string;
}

export type FilterDefinitionCollection = FilterDefinition[];
export interface FilterValueProvider {
    (): Promise<FilterValueCollection>;
}
