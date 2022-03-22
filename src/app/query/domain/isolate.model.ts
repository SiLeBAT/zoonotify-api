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
    id: number;
    hasGene(gene: string): boolean | undefined;
    getValueFor(key: keyof Isolate): string | undefined;
    getCharacteristicValue(
        key: keyof IsolateCharacteristicSet
    ): string | undefined;
    getResistances(): Partial<IsolateResistanceSet>;
    getCharacteristics(): Partial<IsolateCharacteristicSet>;
    addCharacteristics(
        characteristics: Partial<IsolateCharacteristicSet> & GeneSet
    ): void;
    addResistances(characteristics: Partial<IsolateResistanceSet>): void;
    getGenes(): GeneSet;
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
    stx1?: boolean;
    stx2?: boolean;
    eae?: boolean;
    e_hly?: boolean;
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
