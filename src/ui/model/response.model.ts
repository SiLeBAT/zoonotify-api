interface ErrorDTO {
    code: number;
    message: string;
}

export type DefaultServerErrorDTO = ErrorDTO;

export interface SystemInformationDTO {
    version: string;
    lastChange: string;
    supportContact: string;
}

export interface DatabaseStatusDTO {
    date: string;
}

export type FilterConfigurationCollectionDTO = FilterConfigurationDTO[];

export interface GetFilterConfigurationContainerDTO {
    filters: FilterConfigurationCollectionDTO;
}

export type FilterValueCollectionDTO = (string | number | boolean)[];
export interface FilterConfigurationDTO {
    id: string;
    parent?: string;
    trigger?: string;
    values: FilterValueCollectionDTO;
}

export type IsolateCollectionDTO = IsolateDTO[];
export interface GetIsolatesSuccessResponse {
    isolates: IsolateCollectionDTO;
}

export type CountGroupDTO = {
    [key: string]: string;
} & {
    count: number;
};
export interface GetCountedIsolatesSuccessResponse {
    totalNumberOfIsolates: number;
    groups?: CountGroupDTO[];
}

export interface IsolateDTO {
    isolateId: number;
    bfrId: string;
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
    characteristics?: IsolateCharacteristicsDTO;
    resistance?: IsolateResistanceDTO;
}
export class IsolateDto implements IsolateDto {
    constructor(
        public isolateId: number,
        public bfrId: string,
        public microorganism: string,
        public samplingYear: string,
        public federalState: string,
        public samplingContext: string,
        public samplingStage: string,
        public origin: string,
        public category: string,
        public productionType: string,
        public matrix: string,
        public matrixDetail: string,
        public characteristics?: IsolateCharacteristicsDTO,
        public resistance?: IsolateResistanceDTO
    ) {}
}

interface ResistanceProfileDTO {
    value: string;
    active: boolean;
}

type IsolateResistanceDTO = Partial<Record<string, ResistanceProfileDTO>>;

interface IGeneSet {
    stx1: boolean | null;
    stx2: boolean | null;
    eae: boolean | null;
    e_hly: boolean | null;
}
export class IsolateGeneDto {
    public stx1: boolean | null = null;
    public stx2: boolean | null = null;
    public eae: boolean | null = null;
    public e_hly: boolean | null = null;

    build(partialGeneSet: Partial<IGeneSet>): IsolateGeneDto {
        if (null != partialGeneSet.stx1) {
            this.stx1 = partialGeneSet.stx1;
        }
        if (null != partialGeneSet.stx2) {
            this.stx2 = partialGeneSet.stx2;
        }
        if (null != partialGeneSet.eae) {
            this.eae = partialGeneSet.eae;
        }
        if (null != partialGeneSet.e_hly) {
            this.stx2 = partialGeneSet.e_hly;
        }
        return this;
    }
}

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
    genes?: IsolateGeneDto;
}
