import {
    GeneSet,
    Isolate,
    IsolateCharacteristicSet,
    IsolateResistanceSet,
    ResistanceProfile,
} from './isolate.model';
import * as _ from 'lodash';
import { FederalState } from './federal-state.enum';

class DefaultIsolate implements Isolate {
    constructor(
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

        public characteristics: IsolateCharacteristicSet,
        public geneSet: Partial<GeneSet>,
        public resistance: IsolateResistanceSet,

        public bfrId: string,
        public isolateId: number
    ) {}
    hasGene(gene: keyof GeneSet): boolean | null | undefined {
        return this.geneSet[gene];
    }
    getValueFor(key: keyof Isolate): string | undefined {
        return _.isUndefined(this[key]) ? undefined : String(this[key]);
    }
    getCharacteristicValue(key: keyof IsolateCharacteristicSet): any {
        return this.characteristics[key];
    }
    getResistances(): Partial<IsolateResistanceSet> {
        return { ...this.resistance };
    }
    getCharacteristics(): Partial<IsolateCharacteristicSet> {
        return { ...this.characteristics };
    }
    getResistancesProfileFor(
        resistance: keyof IsolateResistanceSet
    ): ResistanceProfile | undefined {
        return this.resistance[resistance];
    }
    getGenes(): Partial<GeneSet> {
        return { ...this.geneSet };
    }
}

export function createIsolate(
    federalState: FederalState,
    microorganism: string,
    samplingYear: string,
    samplingContext: string,
    samplingStage: string,
    origin: string,
    category: string,
    productionType: string,
    matrix: string,
    matrixDetail: string,
    characteristics: Partial<IsolateCharacteristicSet>,
    geneSet: Partial<GeneSet>,
    resistance: IsolateResistanceSet,
    bfrId: string,
    isolateId: number
): Isolate {
    return new DefaultIsolate(
        federalState,
        microorganism,
        samplingYear,
        samplingContext,
        samplingStage,
        origin,
        category,
        productionType,
        matrix,
        matrixDetail,
        characteristics,
        geneSet,
        resistance,
        bfrId,
        isolateId
    );
}
