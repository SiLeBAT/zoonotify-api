import { Request } from 'express';
import {
    GroupAttributes,
    Isolate,
    IsolateCharacteristicSet,
    IsolateQueryFilter,
    QueryFilter,
} from './../../app/ports';

import { IsolateCharacteristicsDTO, IsolateDto } from './response.model';

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

export enum CharacteristicsType {
    NONE,
    SPECIES,
    SEROVAR,
    PHENOTYPE,
    GENES,
    SEROTYPE,
    SPA,
}
export interface IsolateConverter {
    createIsolateDTOViaIsolate(isolate: Isolate): IsolateDto;
    createCharacteristicsViaCharacteristicsType(
        characteristicType: CharacteristicsType,
        characteristic: IsolateCharacteristicSet | undefined
    ): IsolateCharacteristicsDTO;
}

export interface QueryFilterConverter {
    createIsolateQueryFilter(req: Request): IsolateQueryFilter;
    convertRequestToFilterList(req: Request): any[];
}
