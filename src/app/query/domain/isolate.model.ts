import { EntityGateway } from './shared.model';
import { FederalState } from './federal-state.enum';

export interface Isolate {
    bfrId: string;
    isolateId: number;
    federalState: FederalState;
    microorganism: string;
    samplingYear: string;
    samplingContext: string;
    samplingStage: string;
    origin: string;
    category: string;
    productionType: string;
    matrix: string;
    matrixDetail: string;
    hasGene(gene: string): boolean | null | undefined;
    getValueFor(key: keyof Isolate): string | undefined;
    getCharacteristicValue(
        key: keyof IsolateCharacteristicSet
    ): string | undefined;
    getResistances(): Partial<IsolateResistanceSet>;
    getCharacteristics(): IsolateCharacteristicSet;
    getGenes(): Partial<GeneSet>;
    getResistancesProfileFor(
        resistance: keyof IsolateResistanceSet
    ): ResistanceProfile | undefined;
}
export class Isolate implements Isolate {
    constructor(
        public bfrId: string,
        public isolateId: number,
        public federalState: FederalState,
        public microorganism: string,
        public samplingYear: string,
        public samplingContext: string,
        public samplingStage: string,
        public origin: string,
        public category: string,
        public productionType: string,
        public matrix: string,
        public matrixDetail: string,
        public characteristics?: IsolateCharacteristicSet,
        public resistance?: IsolateResistanceSet
    ) {}
}
export interface IsolateCharacteristicSet {
    species?: string;
    serovar?: string;
    serotype?: string;
    spa_typ?: string;
    o_group?: string;
    h_group?: string;
    ampc_carba_phenotype?: string;
    clonal_group?: string;
    genes?: GeneSet;
}
export class IsolateCharacteristicSet implements IsolateCharacteristicSet {
    constructor(
        public species?: string,
        public serovar?: string,
        public serotype?: string,
        public spa_typ?: string,
        public o_group?: string,
        public h_group?: string,
        public ampc_carba_phenotype?: string,
        public clonal_group?: string,
        public genes?: GeneSet
    ) {}
}
export interface GeneSet {
    stx1: boolean | null;
    stx2: boolean | null;
    eae: boolean | null;
    e_hly: boolean | null;
}
export class GeneSet implements GeneSet {
    constructor(
        public stx1: boolean | null,
        public stx2: boolean | null,
        public eae: boolean | null,
        public e_hly: boolean | null
    ) {}
}
export type AllIsolateCharacteristics = Partial<IsolateCharacteristicSet> &
    GeneSet;
export interface ResistanceProfile {
    value: string;
    active?: boolean;
}
export type IsolateResistanceSet = Record<string, any>;

export type IsolateCollection = {
    isolates: Isolate[];
};

export type IsolateViewGateway = EntityGateway<Isolate[]>
