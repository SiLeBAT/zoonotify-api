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

export interface GetFilterConfigurationContainerDTO {
    filters: FilterConfigurationDTO[];
}

export interface FilterConfigurationDTO {
    id: string;
    name: string;
    parent?: string;
    values: string[];
}

export interface GetIsolatesContainerDTO {
    isolates: IsolateDTO[];
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
    resistance: IsolateResistanceDTO; // TODO: Type
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
