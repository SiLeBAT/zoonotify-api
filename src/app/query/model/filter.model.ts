import {
    DependentQueryFilter,
    QueryFilter,
    QueryParameters,
} from './shared.model';

export type FilterConfigurationCollection = FilterConfiguration[];

export interface FilterPort {
    getFilterConfigurationById(
        id: string,
        filter?: QueryFilter
    ): Promise<FilterConfiguration>;
    getFilterConfigurationCollection(): Promise<FilterConfigurationCollection>;
    createFilter(queryParameters: QueryParameters): Promise<QueryFilter>;
}

export interface FilterNamesToAttributesHash {
    [key: string]: string;
}
export type FilterService = FilterPort;

export type FilterValueCollection = (string | number | boolean)[];
export interface FilterConfiguration {
    readonly id: string;
    readonly parent?: string;
    readonly trigger?: string;
    readonly values: FilterValueCollection;
}

export interface FilterDefinition {
    readonly id: string;
    readonly attribute: string;
}

export interface SubfilterDefinition extends FilterDefinition {
    readonly parent: string;
    readonly attribute: string;
    readonly trigger: string;
    readonly target: string;
    readonly targetValue: string | string[];
}

export type FilterDefinitionCollection = FilterDefinition[];
export type SubfilterDefinitionCollection = SubfilterDefinition[];
export interface FilterValueProvider {
    (): Promise<FilterValueCollection>;
}

export interface IdentifiedEntry {
    id: string;
}
export interface DependentFilter {
    parent: string;
    child: DependentQueryFilter;
}
