import { Tree } from './../../core/domain/tree';
import { Isolate } from './isolate.model';

export type GroupAttributes = any[];
export interface DataRequestCreatedEvent {
    filter: QueryFilter;
    grouping: GroupAttributes;
}

export interface ApplicationFilter {
    doesFilterApply(isolate: Isolate): boolean;
}

export interface FilterValue {
    key: string;
    value: string;
}
export interface EntityGateway<T> {
    findAll(datasetOperations?: DataRequestCreatedEvent): Promise<T>;
}

export interface QueryFilter {
    getIdOf(filterValue: FilterValue): string | undefined;
    getAllFilterTrees(): Tree<FilterValue>[];
    getApplicationFilter(): ApplicationFilter[];
    getPersistenceFilter(): QueryFilter;
    removeFilter(key: string): boolean;
    addFilter(value: FilterValue, parentId?: string | null): string;
    isEmpty(): boolean;
}
