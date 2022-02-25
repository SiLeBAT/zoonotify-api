import { EntityGateway, QueryFilter, GroupAttributes } from './shared.model';
import { FederalState } from '../domain/federal-state.enum';

export interface IsolateView {
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
    characteristics: IsolateCharacteristics;
    resistance: IsolateResistance;
    id: number;
}

export type IsolateCollection = IsolateView[];
export interface IsolateCharacteristics {
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
interface ResistanceProfile {
    value: string;
    active: boolean;
}
export type IsolateResistance = Record<string, ResistanceProfile | undefined>;
export interface IsolatePort {
    getIsolates(filter: QueryFilter): Promise<IsolateCollection>;
    getIsolateCount(
        filter: QueryFilter,
        groupAttributes: GroupAttributes
    ): Promise<IsolateCount>;
}

export type IsolateService = IsolatePort;

export interface IsolateViewGateway extends EntityGateway<IsolateView> {
    getCount(
        filter: QueryFilter,
        groupAttributes: GroupAttributes
    ): Promise<IsolateCount>;
    getUniqueAttributeValues(
        property: string,
        filter?: QueryFilter
    ): Promise<(string | number | boolean)[]>;
}
export interface IsolateCount {
    totalNumberOfIsolates: number;
    groups?: CountGroup[];
}

export type CountGroup = {
    [key in keyof IsolateView]: string;
} & {
    count: number;
};
