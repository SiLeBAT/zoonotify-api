interface ErrorDTO {
    code: number;
    message: string;
}

export interface DefaultServerErrorDTO extends ErrorDTO {}

export interface SystemInformationDTO {
    version: string;
    lastChange: string;
    supportContact: string;
}

export interface DatabaseStatusDTO {
    date: string;
    directive: string;
}

export type FilterConfigurationCollectionDTO = FilterConfigurationDTO[];

export interface GetFilterConfigurationContainerDTO {
    filters: FilterConfigurationCollectionDTO;
}

export type FilterValueCollectionDTO = string[];
export interface FilterConfigurationDTO {
    id: string;
    parent?: string;
    values: FilterValueCollectionDTO;
}

export type IsolateCollectionDTO = IsolateDTO[];
export interface GetIsolatesSuccessResponse {
    isolates: IsolateCollectionDTO;
}

export type CountGroupDTO = {
    [key in keyof IsolateDTO]: string;
} & {
    count: number;
};
export interface GetCountedIsolatesSuccessResponse {
    totalNumberOfIsolates: number;
    groups?: CountGroupDTO[];
}

export interface IsolateDTO {
    microorganism: string;
    samplingYear: string;
    federalState: string;
    samplingContext: string;
    samplingStage: string;
    origin: string;
    category: string;
    productionType: string;
    matrix: string;
    matrixDetail: string;
    characteristics: IsolateCharacteristicsDTO;
    resistance: IsolateResistanceDTO;
}

interface ResistanceProfileDTO {
    value: string;
    active: boolean;
}

type IsolateResistanceDTO = Record<string, ResistanceProfileDTO>;
interface IsolateCharacteristicsDTO {
    species?: string;
    serovar?: string;
    serotype?: string;
    spa_typ?: string;
    o_group?: string;
    h_group?: string;
    stx1?: string;
    stx2?: string;
    eae?: string;
    e_hly?: string;
    ampc_carba_phenotype?: string;
}
