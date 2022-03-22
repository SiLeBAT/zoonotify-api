import { GroupAttributes, QueryFilter } from './../../app/ports';

type QueryParametersValue = string[];

export type QueryParameters = Record<string, QueryParametersValue>;

export interface QueryParameterToQueryFilterConverter {
    convertParameterToFilter(
        queryParameters: QueryParameters
    ): Promise<QueryFilter>;
}

export interface QueryParameterToGroupingConverter {
    getGroupAttribute(query: QueryParameters): GroupAttributes;
}
