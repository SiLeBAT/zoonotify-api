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

class DefaultIsolate implements Isolate {
    //TODO : Create Getters , make readonly
    private _id: string;
    private _geneSet: GeneSet = {};
    private _characteristics: Partial<IsolateCharacteristicSet> = {};

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
        public characteristics: Partial<IsolateCharacteristicSet> &
            GeneSet = {},
        private _resistance: Partial<IsolateResistanceSet> = {},
        public id: number
    ) {
        this._id = uuidv4();
        this.addCharacteristics(characteristics);
    }
    hasGene(gene: keyof GeneSet): boolean | undefined {
        return this._geneSet[gene];
    }

    getValueFor(key: keyof Isolate): string | undefined {
        return _.isUndefined(this[key]) ? undefined : String(this[key]);
    }
    getCharacteristicValue(
        key: keyof IsolateCharacteristicSet
    ): string | undefined {
        return this._characteristics[key];
    }
    getResistances(): Partial<IsolateResistanceSet> {
        return this._resistance;
    }

    getCharacteristics(): Partial<IsolateCharacteristicSet> {
        return this._characteristics;
    }

    getResistancesProfileFor(
        resistance: keyof IsolateResistanceSet
    ): ResistanceProfile | undefined {
        return this._resistance[resistance];
    }

    getGenes(): GeneSet {
        return { ...this._geneSet };
    }

    addCharacteristics(
        characteristics: Partial<IsolateCharacteristicSet> & GeneSet
    ): void {
        this._geneSet = {
            ...this._geneSet,
            ...{
                stx1: characteristics['stx1'],
                stx2: characteristics['stx2'],
                eae: characteristics['eae'],
                e_hly: characteristics['e_hly'],
            },
        };

        this._characteristics = {
            ...this._characteristics,
            ...{
                species: characteristics['species'],
                serovar: characteristics['serovar'],
                serotype: characteristics['serotype'],
                spa_typ: characteristics['spa_typ'],
                o_group: characteristics['o_group'],
                h_group: characteristics['h_group'],
                ampc_carba_phenotype: characteristics['ampc_carba_phenotype'],
            },
        };
    }
    addResistances(resistances: Partial<IsolateResistanceSet>): void {
        this._resistance = { ...this._resistance, ...resistances };
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
    characteristics: Partial<IsolateCharacteristicSet> & GeneSet,
    resistance: Partial<IsolateResistanceSet>,
    id: number
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
        resistance,
        id
    );
}
