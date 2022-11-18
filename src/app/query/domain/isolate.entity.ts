import {
    GeneSet,
    Isolate,
    IsolateCharacteristicSet,
    IsolateResistanceSet,
    ResistanceProfile,
} from './isolate.model';
import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { FederalState } from './federal-state.enum';
import e = require('express');

class DefaultIsolate implements Isolate {
    //TODO : Create Getters , make readonly
    // private _id: string;
    // private _geneSet: GeneSet = {};
    // private _characteristics: Partial<IsolateCharacteristicSet> = {};

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

        public characteristics: Partial<IsolateCharacteristicSet>,
        public geneSet: Partial<GeneSet>,
        public resistance: Partial<IsolateResistanceSet>,

        public bfrId: string,
        public isolateId: number
    ) {}
    hasGene(gene: keyof GeneSet): boolean | null | undefined {
        return this.geneSet[gene];
    }

    getValueFor(key: keyof Isolate): string | undefined {
        return _.isUndefined(this[key]) ? undefined : String(this[key]);
    }
    getCharacteristicValue(
        key: keyof IsolateCharacteristicSet
    ): string | undefined {
        return this.characteristics[key];
    }
    getResistances(): Partial<IsolateResistanceSet> {
        return this.resistance;
    }

    getCharacteristics(): Partial<IsolateCharacteristicSet> {
        return this.characteristics;
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
    resistance: Partial<IsolateResistanceSet>,
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
