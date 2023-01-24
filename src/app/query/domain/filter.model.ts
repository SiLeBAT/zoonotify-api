import { QueryFilter, FilterValue } from './shared.model';

export type FilterConfigurationCollection = FilterConfiguration[];

export interface FilterConfigurationPort {
    getFilterConfigurationById(
        id: string,
        filter?: QueryFilter
    ): Promise<FilterConfiguration & Partial<SubfilterDefinition>>;
    getFilterConfigurationCollection(): Promise<FilterConfigurationCollection>;
    determineFilterType(id: string): UIFilterType;
    findDefinitionById(id: string, type?: UIFilterType): FilterDefinition;
    parseDynamicFilterId(id: string): [string, string | undefined];
}

export type FilterConfigurationProvider = FilterConfigurationPort;
export interface FilterNamesToAttributesHash {
    [key: string]: string;
}

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
    readonly dbTargetValue: string; // Value as it stands in the Database
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
    child: FilterValue;
}

export enum UIFilterType {
    DYNAMIC,
    MAIN,
    SUB,
    MANUAL,
}

export class IsolateQueryFilter {
    constructor(
        public hasORCondition: boolean,
        public isolateFilter: any[],
        public resistanceFilter: any[]
    ) {}
}

export interface PrefixInputParam {
    prefixValue: string;
    isInclusivePrefix: boolean;
}
export class PrefixInputParam implements PrefixInputParam {
    constructor(
        public prefixValue: string,
        public isInclusivePrefix: boolean
    ) {}
}
