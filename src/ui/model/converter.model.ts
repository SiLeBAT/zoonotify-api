import {
    Isolate,
    IsolateCharacteristicSet,
    IsolateQueryFilter,
} from './../../app/ports';

import { IsolateCharacteristicsDTO, IsolateDto } from './response.model';

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
    createIsolateQueryFilter(filterValueString: any[]): IsolateQueryFilter;
}
