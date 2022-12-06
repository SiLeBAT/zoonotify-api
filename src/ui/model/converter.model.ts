import { GroupAttributes, Isolate, QueryFilter } from './../../app/ports';
import {
    IIsolateCharacteristics,
    IsolateCharacteristicsDTO,
    IsolateDto,
} from './response.model';

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
        partialCharacteristic: Partial<IIsolateCharacteristics>
    ): IsolateCharacteristicsDTO;
}
