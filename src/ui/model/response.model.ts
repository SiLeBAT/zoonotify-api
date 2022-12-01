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
    characteristics?: IIsolateCharacteristics;
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
            this.e_hly = partialGeneSet.e_hly;
        }
        return this;
    }
}

export interface IIsolateCharacteristics {
    species?: string | null | undefined;
    serovar?: string | null | undefined;
    serotype?: string | null | undefined;
    spa_type?: string | null | undefined;
    o_group?: string | null | undefined;
    h_group?: string | null | undefined;
    ampc_carba_phenotype?: string | null | undefined;
    clonal_group?: string | null | undefined;
    genes?: IsolateGeneDto | null | undefined;
}
export class IsolateCharacteristicsDTO implements IIsolateCharacteristics {
    species?: string | null | undefined;
    serovar?: string | null | undefined;
    serotype?: string | null | undefined;
    spa_type?: string | null | undefined;
    o_group?: string | null | undefined;
    h_group?: string | null | undefined;
    ampc_carba_phenotype?: string | null | undefined;
    clonal_group?: string | null | undefined;
    genes?: IsolateGeneDto | null | undefined;
}
interface SpeciesCharacteristics extends IIsolateCharacteristics {
    species: string | null;
}
export class SpeciesCharacteristicsDto implements SpeciesCharacteristics {
    constructor(public species: string | null = null) {}
    create(
        partialCharacteristic: Partial<IIsolateCharacteristics>
    ): IIsolateCharacteristics {
        if (null != partialCharacteristic.species) {
            this.species = partialCharacteristic.species;
        }
        return this;
    }
}
interface SerovarCharacteristics extends IIsolateCharacteristics {
    serovar: string | null;
}
export class SerovarCharacteristicsDto implements SerovarCharacteristics {
    constructor(public serovar: string | null = null) {}
    create(
        partialCharacteristic: Partial<IIsolateCharacteristics>
    ): SerovarCharacteristics {
        if (null != partialCharacteristic.serovar) {
            this.serovar = partialCharacteristic.serovar;
        }
        return this;
    }
}
interface SeroTypeCharacteristics extends IIsolateCharacteristics {
    serotype: string | null;
}
export class SeroTypeCharacteristicsDto implements SeroTypeCharacteristics {
    constructor(public serotype: string | null = null) {}
    create(
        partialCharacteristic: Partial<IIsolateCharacteristics>
    ): IIsolateCharacteristics {
        if (null != partialCharacteristic.serotype) {
            this.serotype = partialCharacteristic.serotype;
        }
        return this;
    }
}
interface GenesCharacteristics extends IIsolateCharacteristics {
    o_group?: string | null;
    h_group?: string | null;
}
export class GenesCharacteristicsDto implements GenesCharacteristics {
    constructor(
        public o_group: string | null = null,
        public h_group: string | null = null
    ) {}
    create(
        partialCharacteristic: Partial<IIsolateCharacteristics>
    ): IIsolateCharacteristics {
        if (null != partialCharacteristic.o_group) {
            this.o_group = partialCharacteristic.o_group;
        }
        if (null != partialCharacteristic.h_group) {
            this.h_group = partialCharacteristic.h_group;
        }
        return this;
    }
}
interface PhenoTypeCharacteristics extends IIsolateCharacteristics {
    ampc_carba_phenotype: string | null;
}
export class PhenoTypeCharacteristicsDto implements PhenoTypeCharacteristics {
    constructor(public ampc_carba_phenotype: string | null = null) {}
    create(
        partialCharacteristic: Partial<IIsolateCharacteristics>
    ): IIsolateCharacteristics {
        if (null != partialCharacteristic.ampc_carba_phenotype) {
            this.ampc_carba_phenotype =
                partialCharacteristic.ampc_carba_phenotype;
        }
        return this;
    }
}
interface SpaTypeCharacteristics extends IIsolateCharacteristics {
    spa_type: string | null;
    clonal_group: string | null;
}
export class SpaTypeCharacteristicsDto implements SpaTypeCharacteristics {
    constructor(
        public spa_type: string | null = null,
        public clonal_group: string | null = null
    ) {}
    create(
        partialCharacteristic: Partial<IIsolateCharacteristics>
    ): IIsolateCharacteristics {
        if (null != partialCharacteristic.spa_type) {
            this.spa_type = partialCharacteristic.spa_type;
        }
        if (null != partialCharacteristic.clonal_group) {
            this.clonal_group = partialCharacteristic.clonal_group;
        }
        return this;
    }
}
