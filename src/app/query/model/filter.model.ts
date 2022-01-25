import { FilterType } from './../domain/filter-type.enum';
import {
    DependentQueryFilter,
    QueryFilter,
    QueryParameters,
} from './shared.model';

export type FilterConfigurationCollection = FilterConfiguration[];

export interface FilterConfigurationPort {
    getFilterConfigurationById(
        id: string,
        filter?: QueryFilter
    ): Promise<FilterConfiguration>;
    getFilterConfigurationCollection(): Promise<FilterConfigurationCollection>;
}

export interface FilterConfigurationProvider extends FilterConfigurationPort {
    determineFilterType(id: string): FilterType;
    findDefinitionById(id: string, type?: FilterType): FilterDefinition;
    parseDynamicFilterId(id: string): [string, string | undefined];
}
export interface FilterResolutionPort {
    createFilter(queryParameters: QueryParameters): Promise<QueryFilter>;
}

export interface FilterNamesToAttributesHash {
    [key: string]: string;
}
export type FilterResolutionService = FilterResolutionPort;

export type FilterValueCollection = (string | number | boolean)[];
export interface FilterConfiguration extends IdentifiedEntry {
    readonly parent?: string;
    readonly trigger?: string;
    readonly values: FilterValueCollection;
}

export interface FilterDefinition extends IdentifiedEntry {
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
    readonly id: string;
}
export interface DependentFilter {
    parent: string;
    child: DependentQueryFilter;
}
