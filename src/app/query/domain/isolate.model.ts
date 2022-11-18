import {
    DataRequestCreatedEvent,
    EntityGateway,
    GroupAttributes,
} from './shared.model';
import { FederalState } from './federal-state.enum';

export interface Isolate {
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
    bfrId: string;
    isolateId: number;
    hasGene(gene: string): boolean | null | undefined;
    getValueFor(key: keyof Isolate): string | undefined;
    getCharacteristicValue(
        key: keyof IsolateCharacteristicSet
    ): string | undefined;
    getResistances(): Partial<IsolateResistanceSet>;
    getCharacteristics(): Partial<IsolateCharacteristicSet>;
    getGenes(): Partial<GeneSet>;
    getResistancesProfileFor(
        resistance: keyof IsolateResistanceSet
    ): ResistanceProfile | undefined;
}

export type IsolateCollection = {
    isolates: Isolate[];
    getIsolateCount(grouping: GroupAttributes): IsolateCount;
};
export interface IsolateCharacteristicSet {
    species: string;
    serovar: string;
    serotype: string;
    spa_typ: string;
    o_group: string;
    h_group: string;
    ampc_carba_phenotype: string;
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
    active: boolean;
}
export type IsolateResistanceSet = Record<string, ResistanceProfile>;

export interface IsolateViewGateway extends EntityGateway<IsolateCollection> {
    getCount(
        datasetOperations: DataRequestCreatedEvent
    ): Promise<IsolateCollection>;
    getUniqueAttributeValues(
        property: string,
        datasetOperations?: DataRequestCreatedEvent
    ): Promise<(string | number | boolean)[]>;
}
export interface IsolateCount {
    totalNumberOfIsolates: number;
    groups?: IsolateCountGroup[];
}

export type IsolateCountGroup =
    | {
          [key: string]: string;
      }
    | {
          count: number;
      };
