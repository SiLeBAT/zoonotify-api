import { Isolate } from './../../../app/query/domain/isolate.model';
import { FederalState } from '../../../app/query/domain/federal-state.enum';
import {
    createIsolate,
    createIsolateCollection,
    createQueryFilter,
    IsolateViewGateway,
} from '../../../app/ports';
import * as _ from 'lodash';

export function getMockIsolateViewGateway(): IsolateViewGateway {
    return {
        getUniqueAttributeValues: jest.fn(() => Promise.resolve([])),
        findAll: jest.fn((dataRequestCreated) => {
            const resultArray = [
                {
                    isolateId: 1,
                    bfrId: '00000000-0000-0000-0000-000000000000',
                    microorganism: 'STEC',
                    samplingYear: '1999',
                    federalState: FederalState.HH,
                    samplingContext: 'Looking',
                    samplingStage: 'Here',
                    origin: 'Lebensmittel',
                    category: 'Leprechaun',
                    productionType: 'Mastkalb / JungLeprechaun',
                    matrix: 'Frisches Fleisch',
                    matrixDetail: 'gekühlt',
                    characteristics: {
                        h_group: 'NT',
                        o_group: '1',
                    },
                    genes: {
                        e_hly: null,
                        eae: false,
                        stx2: false,
                        stx1: true,
                    },
                    resistance: {
                        GEN: {
                            active: true,
                            value: '0.5',
                        },
                        KAN: {
                            active: false,
                            value: '4',
                        },
                        STR: {
                            active: false,
                            value: '4',
                        },
                        CHL: {
                            active: false,
                            value: '8',
                        },
                        CIP: {
                            active: false,
                            value: '0.015',
                        },
                        TMP: {
                            active: false,
                            value: '0.5',
                        },
                        SMX: {
                            active: false,
                            value: '16',
                        },
                        TET: {
                            active: false,
                            value: '2',
                        },
                        FOT: {
                            active: false,
                            value: '0.0625',
                        },
                        TAZ: {
                            active: false,
                            value: '0.25',
                        },
                        NAL: {
                            active: false,
                            value: '4',
                        },
                        AMP: {
                            active: false,
                            value: '4',
                        },
                        COL: {
                            active: false,
                            value: '2',
                        },
                    },
                },
                {
                    isolateId: 2,
                    bfrId: '7cea7890-dd95-4356-848d-5201950984e6',
                    microorganism: 'STEC',
                    samplingYear: '1999',
                    federalState: FederalState.HH,
                    samplingContext: 'Looking',
                    samplingStage: 'Here',
                    origin: 'Lebensmittel',
                    category: 'Leprechaun',
                    productionType: 'Mastkalb / JungLeprechaun',
                    matrix: 'Frisches Fleisch',
                    matrixDetail: 'gekühlt',
                    characteristics: {
                        h_group: 'NT',
                        o_group: '1',
                    },
                    genes: {
                        e_hly: null,
                        eae: false,
                        stx2: false,
                        stx1: true,
                    },
                    resistance: {
                        GEN: {
                            active: false,
                            value: '0.25',
                        },
                        KAN: {
                            active: false,
                            value: '4',
                        },
                        STR: {
                            active: false,
                            value: '4',
                        },
                        CHL: {
                            active: false,
                            value: '8',
                        },
                        CIP: {
                            active: false,
                            value: '0.015',
                        },
                        TMP: {
                            active: false,
                            value: '1',
                        },
                        SMX: {
                            active: false,
                            value: '16',
                        },
                        TET: {
                            active: false,
                            value: '2',
                        },
                        FOT: {
                            active: false,
                            value: '0.0625',
                        },
                        TAZ: {
                            active: false,
                            value: '0.25',
                        },
                        NAL: {
                            active: false,
                            value: '4',
                        },
                        AMP: {
                            active: false,
                            value: '4',
                        },
                        COL: {
                            active: false,
                            value: '2',
                        },
                    },
                },
                {
                    isolateId: 3,
                    bfrId: 'b97447f8-62d5-4894-878c-c90b1ff5c0ac',
                    microorganism: 'STEC',
                    samplingYear: '1999',
                    federalState: FederalState.HH,
                    samplingContext: 'Looking',
                    samplingStage: 'Here',
                    origin: 'Lebensmittel',
                    category: 'Leprechaun',
                    productionType: 'Mastkalb / JungLeprechaun',
                    matrix: 'Frisches Fleisch',
                    matrixDetail: 'gekühlt',
                    characteristics: {
                        h_group: 'NT',
                        o_group: '1',
                    },
                    genes: {
                        e_hly: null,
                        eae: false,
                        stx2: false,
                        stx1: true,
                    },
                    resistance: {
                        GEN: {
                            active: false,
                            value: '0.5',
                        },
                        KAN: {
                            active: false,
                            value: '4',
                        },
                        STR: {
                            active: false,
                            value: '8',
                        },
                        CHL: {
                            active: false,
                            value: '8',
                        },
                        CIP: {
                            active: false,
                            value: '0.015',
                        },
                        TMP: {
                            active: false,
                            value: '0.5',
                        },
                        SMX: {
                            active: false,
                            value: '16',
                        },
                        TET: {
                            active: false,
                            value: '1',
                        },
                        FOT: {
                            active: false,
                            value: '0.0625',
                        },
                        TAZ: {
                            active: false,
                            value: '0.25',
                        },
                        NAL: {
                            active: false,
                            value: '4',
                        },
                        AMP: {
                            active: false,
                            value: '4',
                        },
                        COL: {
                            active: false,
                            value: '2',
                        },
                    },
                },
                {
                    isolateId: 4,
                    bfrId: '5e51ffc1-26f6-43cc-8790-90b861388ed8',
                    microorganism: 'STEC',
                    samplingYear: '1999',
                    federalState: FederalState.HH,
                    samplingContext: 'Looking',
                    samplingStage: 'Here',
                    origin: 'Lebensmittel',
                    category: 'Leprechaun',
                    productionType: 'Mastkalb / JungLeprechaun',
                    matrix: 'Frisches Fleisch',
                    matrixDetail: 'gekühlt',
                    characteristics: {
                        h_group: 'NT',
                        o_group: '1',
                    },
                    genes: {
                        e_hly: null,
                        eae: false,
                        stx2: false,
                        stx1: true,
                    },
                    resistance: {
                        GEN: {
                            active: false,
                            value: '0.5',
                        },
                        KAN: {
                            active: false,
                            value: '4',
                        },
                        STR: {
                            active: false,
                            value: '8',
                        },
                        CHL: {
                            active: false,
                            value: '8',
                        },
                        CIP: {
                            active: false,
                            value: '0.015',
                        },
                        TMP: {
                            active: false,
                            value: '0.5',
                        },
                        SMX: {
                            active: false,
                            value: '16',
                        },
                        TET: {
                            active: false,
                            value: '2',
                        },
                        FOT: {
                            active: false,
                            value: '0.0625',
                        },
                        TAZ: {
                            active: false,
                            value: '0.25',
                        },
                        NAL: {
                            active: false,
                            value: '4',
                        },
                        AMP: {
                            active: false,
                            value: '4',
                        },
                        COL: {
                            active: false,
                            value: '2',
                        },
                    },
                },
                {
                    isolateId: 5,
                    bfrId: 'cc7bb307-466c-42d6-a629-9740aebe1467',
                    microorganism: 'STEC',
                    samplingYear: '1999',
                    federalState: FederalState.HH,
                    samplingContext: 'Looking',
                    samplingStage: 'Here',
                    origin: 'Lebensmittel',
                    category: 'Wildwiederkäuer',
                    productionType: 'Wildwiederkäuer',
                    matrix: 'Frisches Fleisch',
                    matrixDetail: 'gekühlt',
                    characteristics: {
                        h_group: '2',
                        o_group: '184',
                    },
                    genes: {
                        e_hly: null,
                        eae: false,
                        stx2: false,
                        stx1: true,
                    },
                    resistance: {
                        GEN: {
                            active: false,
                            value: '0.5',
                        },
                        KAN: {
                            active: false,
                            value: '4',
                        },
                        STR: {
                            active: false,
                            value: '4',
                        },
                        CHL: {
                            active: false,
                            value: '8',
                        },
                        CIP: {
                            active: false,
                            value: '0.015',
                        },
                        TMP: {
                            active: false,
                            value: '0.5',
                        },
                        SMX: {
                            active: false,
                            value: '32',
                        },
                        TET: {
                            active: false,
                            value: '2',
                        },
                        FOT: {
                            active: false,
                            value: '0.125',
                        },
                        TAZ: {
                            active: false,
                            value: '0.25',
                        },
                        NAL: {
                            active: false,
                            value: '4',
                        },
                        AMP: {
                            active: false,
                            value: '4',
                        },
                        COL: {
                            active: false,
                            value: '2',
                        },
                    },
                },
                {
                    isolateId: 6,
                    bfrId: 'f719dfa0-6779-48c5-998f-4b8f747910f4',
                    microorganism: 'Campylobacter spp.',
                    samplingYear: '1999',
                    federalState: FederalState.HH,
                    samplingContext: 'Looking',
                    samplingStage: 'Here',
                    origin: 'Lebensmittel',
                    category: 'Leprechaun',
                    productionType: 'Leprechaun',
                    matrix: '(Hals)haut',
                    matrixDetail: 'Einzel(tier)probe',
                    characteristics: {
                        species: 'C. coli',
                    },
                    resistance: {
                        GEN: {
                            active: false,
                            value: '0.5',
                        },
                        STR: {
                            active: true,
                            value: '32',
                        },
                        CIP: {
                            active: true,
                            value: '8',
                        },
                        TET: {
                            active: true,
                            value: '16',
                        },
                        ERY: {
                            active: false,
                            value: '1',
                        },
                        NAL: {
                            active: true,
                            value: '32',
                        },
                    },
                    genes: {},
                },
            ];
            const internalFilter =
                dataRequestCreated?.filter || createQueryFilter();
            const isolateArray = resultArray.map((r) => {
                return createIsolate(
                    r.federalState,
                    r.microorganism,
                    r.samplingYear,
                    r.samplingContext,
                    r.samplingStage,
                    r.origin,
                    r.category,
                    r.productionType,
                    r.matrix,
                    r.matrixDetail,
                    r.characteristics,
                    r.genes,
                    r.resistance,
                    r.bfrId,
                    r.isolateId
                );
            });
            return Promise.resolve(isolateArray);
        }),
        find: jest.fn((filter) => {
            const resultArray = [
                {
                    isolateId: 1,
                    bfrId: '00000000-0000-0000-0000-000000000000',
                    microorganism: 'STEC',
                    samplingYear: '1999',
                    federalState: FederalState.HH,
                    samplingContext: 'Looking',
                    samplingStage: 'Here',
                    origin: 'Lebensmittel',
                    category: 'Leprechaun',
                    productionType: 'Mastkalb / JungLeprechaun',
                    matrix: 'Frisches Fleisch',
                    matrixDetail: 'gekühlt',
                    characteristics: {
                        h_group: 'NT',
                        o_group: '1',
                    },
                    genes: {
                        e_hly: null,
                        eae: false,
                        stx2: false,
                        stx1: true,
                    },
                    resistance: {
                        GEN: {
                            active: true,
                            value: '0.5',
                        },
                        KAN: {
                            active: false,
                            value: '4',
                        },
                        STR: {
                            active: false,
                            value: '4',
                        },
                        CHL: {
                            active: false,
                            value: '8',
                        },
                        CIP: {
                            active: false,
                            value: '0.015',
                        },
                        TMP: {
                            active: false,
                            value: '0.5',
                        },
                        SMX: {
                            active: false,
                            value: '16',
                        },
                        TET: {
                            active: false,
                            value: '2',
                        },
                        FOT: {
                            active: false,
                            value: '0.0625',
                        },
                        TAZ: {
                            active: false,
                            value: '0.25',
                        },
                        NAL: {
                            active: false,
                            value: '4',
                        },
                        AMP: {
                            active: false,
                            value: '4',
                        },
                        COL: {
                            active: false,
                            value: '2',
                        },
                    },
                },
                {
                    isolateId: 2,
                    bfrId: '7cea7890-dd95-4356-848d-5201950984e6',
                    microorganism: 'STEC',
                    samplingYear: '1999',
                    federalState: FederalState.HH,
                    samplingContext: 'Looking',
                    samplingStage: 'Here',
                    origin: 'Lebensmittel',
                    category: 'Leprechaun',
                    productionType: 'Mastkalb / JungLeprechaun',
                    matrix: 'Frisches Fleisch',
                    matrixDetail: 'gekühlt',
                    characteristics: {
                        h_group: 'NT',
                        o_group: '1',
                    },
                    genes: {
                        e_hly: null,
                        eae: false,
                        stx2: false,
                        stx1: true,
                    },
                    resistance: {
                        GEN: {
                            active: false,
                            value: '0.25',
                        },
                        KAN: {
                            active: false,
                            value: '4',
                        },
                        STR: {
                            active: false,
                            value: '4',
                        },
                        CHL: {
                            active: false,
                            value: '8',
                        },
                        CIP: {
                            active: false,
                            value: '0.015',
                        },
                        TMP: {
                            active: false,
                            value: '1',
                        },
                        SMX: {
                            active: false,
                            value: '16',
                        },
                        TET: {
                            active: false,
                            value: '2',
                        },
                        FOT: {
                            active: false,
                            value: '0.0625',
                        },
                        TAZ: {
                            active: false,
                            value: '0.25',
                        },
                        NAL: {
                            active: false,
                            value: '4',
                        },
                        AMP: {
                            active: false,
                            value: '4',
                        },
                        COL: {
                            active: false,
                            value: '2',
                        },
                    },
                },
                {
                    isolateId: 3,
                    bfrId: 'b97447f8-62d5-4894-878c-c90b1ff5c0ac',
                    microorganism: 'STEC',
                    samplingYear: '1999',
                    federalState: FederalState.HH,
                    samplingContext: 'Looking',
                    samplingStage: 'Here',
                    origin: 'Lebensmittel',
                    category: 'Leprechaun',
                    productionType: 'Mastkalb / JungLeprechaun',
                    matrix: 'Frisches Fleisch',
                    matrixDetail: 'gekühlt',
                    characteristics: {
                        h_group: 'NT',
                        o_group: '1',
                    },
                    genes: {
                        e_hly: null,
                        eae: false,
                        stx2: false,
                        stx1: true,
                    },
                    resistance: {
                        GEN: {
                            active: false,
                            value: '0.5',
                        },
                        KAN: {
                            active: false,
                            value: '4',
                        },
                        STR: {
                            active: false,
                            value: '8',
                        },
                        CHL: {
                            active: false,
                            value: '8',
                        },
                        CIP: {
                            active: false,
                            value: '0.015',
                        },
                        TMP: {
                            active: false,
                            value: '0.5',
                        },
                        SMX: {
                            active: false,
                            value: '16',
                        },
                        TET: {
                            active: false,
                            value: '1',
                        },
                        FOT: {
                            active: false,
                            value: '0.0625',
                        },
                        TAZ: {
                            active: false,
                            value: '0.25',
                        },
                        NAL: {
                            active: false,
                            value: '4',
                        },
                        AMP: {
                            active: false,
                            value: '4',
                        },
                        COL: {
                            active: false,
                            value: '2',
                        },
                    },
                },
                {
                    isolateId: 4,
                    bfrId: '5e51ffc1-26f6-43cc-8790-90b861388ed8',
                    microorganism: 'STEC',
                    samplingYear: '1999',
                    federalState: FederalState.HH,
                    samplingContext: 'Looking',
                    samplingStage: 'Here',
                    origin: 'Lebensmittel',
                    category: 'Leprechaun',
                    productionType: 'Mastkalb / JungLeprechaun',
                    matrix: 'Frisches Fleisch',
                    matrixDetail: 'gekühlt',
                    characteristics: {
                        h_group: 'NT',
                        o_group: '1',
                    },
                    genes: {
                        e_hly: null,
                        eae: false,
                        stx2: false,
                        stx1: true,
                    },
                    resistance: {
                        GEN: {
                            active: false,
                            value: '0.5',
                        },
                        KAN: {
                            active: false,
                            value: '4',
                        },
                        STR: {
                            active: false,
                            value: '8',
                        },
                        CHL: {
                            active: false,
                            value: '8',
                        },
                        CIP: {
                            active: false,
                            value: '0.015',
                        },
                        TMP: {
                            active: false,
                            value: '0.5',
                        },
                        SMX: {
                            active: false,
                            value: '16',
                        },
                        TET: {
                            active: false,
                            value: '2',
                        },
                        FOT: {
                            active: false,
                            value: '0.0625',
                        },
                        TAZ: {
                            active: false,
                            value: '0.25',
                        },
                        NAL: {
                            active: false,
                            value: '4',
                        },
                        AMP: {
                            active: false,
                            value: '4',
                        },
                        COL: {
                            active: false,
                            value: '2',
                        },
                    },
                },
                {
                    isolateId: 5,
                    bfrId: 'cc7bb307-466c-42d6-a629-9740aebe1467',
                    microorganism: 'STEC',
                    samplingYear: '1999',
                    federalState: FederalState.HH,
                    samplingContext: 'Looking',
                    samplingStage: 'Here',
                    origin: 'Lebensmittel',
                    category: 'Wildwiederkäuer',
                    productionType: 'Wildwiederkäuer',
                    matrix: 'Frisches Fleisch',
                    matrixDetail: 'gekühlt',
                    characteristics: {
                        h_group: '2',
                        o_group: '184',
                    },
                    genes: {
                        e_hly: null,
                        eae: false,
                        stx2: false,
                        stx1: true,
                    },
                    resistance: {
                        GEN: {
                            active: false,
                            value: '0.5',
                        },
                        KAN: {
                            active: false,
                            value: '4',
                        },
                        STR: {
                            active: false,
                            value: '4',
                        },
                        CHL: {
                            active: false,
                            value: '8',
                        },
                        CIP: {
                            active: false,
                            value: '0.015',
                        },
                        TMP: {
                            active: false,
                            value: '0.5',
                        },
                        SMX: {
                            active: false,
                            value: '32',
                        },
                        TET: {
                            active: false,
                            value: '2',
                        },
                        FOT: {
                            active: false,
                            value: '0.125',
                        },
                        TAZ: {
                            active: false,
                            value: '0.25',
                        },
                        NAL: {
                            active: false,
                            value: '4',
                        },
                        AMP: {
                            active: false,
                            value: '4',
                        },
                        COL: {
                            active: false,
                            value: '2',
                        },
                    },
                },
                {
                    isolateId: 6,
                    bfrId: 'f719dfa0-6779-48c5-998f-4b8f747910f4',
                    microorganism: 'Campylobacter spp.',
                    samplingYear: '1999',
                    federalState: FederalState.HH,
                    samplingContext: 'Looking',
                    samplingStage: 'Here',
                    origin: 'Lebensmittel',
                    category: 'Leprechaun',
                    productionType: 'Leprechaun',
                    matrix: '(Hals)haut',
                    matrixDetail: 'Einzel(tier)probe',
                    characteristics: {
                        species: 'C. coli',
                    },
                    resistance: {
                        GEN: {
                            active: false,
                            value: '0.5',
                        },
                        STR: {
                            active: true,
                            value: '32',
                        },
                        CIP: {
                            active: true,
                            value: '8',
                        },
                        TET: {
                            active: true,
                            value: '16',
                        },
                        ERY: {
                            active: false,
                            value: '1',
                        },
                        NAL: {
                            active: true,
                            value: '32',
                        },
                    },
                    genes: {},
                },
            ];
            // const internalFilter =
            //     dataRequestCreated?.filter || createQueryFilter();
            const isolateArray = resultArray.map((r) => {
                return createIsolate(
                    r.federalState,
                    r.microorganism,
                    r.samplingYear,
                    r.samplingContext,
                    r.samplingStage,
                    r.origin,
                    r.category,
                    r.productionType,
                    r.matrix,
                    r.matrixDetail,
                    r.characteristics,
                    r.genes,
                    r.resistance,
                    r.bfrId,
                    r.isolateId
                );
            });
            return Promise.resolve(isolateArray);
        }),
    };
}

export const mockIsolates = [
    {
        isolateId: 1,
        bfrId: '00000000-0000-0000-0000-000000000000',
        microorganism: 'STEC',
        samplingYear: '1999',
        federalState: FederalState.HH,
        samplingContext: 'Looking',
        samplingStage: 'Here',
        origin: 'Lebensmittel',
        category: 'Leprechaun',
        productionType: 'Mastkalb / JungLeprechaun',
        matrix: 'Frisches Fleisch',
        matrixDetail: 'gekühlt',
        characteristics: {
            eae: false,
            stx2: false,
            stx1: true,
            h_group: 'NT',
            o_group: '1',
        },
        resistance: {
            GEN: {
                active: false,
                value: '0.5',
            },
            KAN: {
                active: false,
                value: '4',
            },
            STR: {
                active: false,
                value: '4',
            },
            CHL: {
                active: false,
                value: '8',
            },
            CIP: {
                active: false,
                value: '0.015',
            },
            TMP: {
                active: false,
                value: '0.5',
            },
            SMX: {
                active: false,
                value: '16',
            },
            TET: {
                active: false,
                value: '2',
            },
            FOT: {
                active: false,
                value: '0.0625',
            },
            TAZ: {
                active: false,
                value: '0.25',
            },
            NAL: {
                active: false,
                value: '4',
            },
            AMP: {
                active: false,
                value: '4',
            },
            COL: {
                active: false,
                value: '2',
            },
        },
    },
    {
        isolateId: 2,
        bfrId: '00000000-0000-0000-0000-000000000001',
        microorganism: 'STEC',
        samplingYear: '1999',
        federalState: FederalState.HH,
        samplingContext: 'Looking',
        samplingStage: 'Here',
        origin: 'Lebensmittel',
        category: 'Leprechaun',
        productionType: 'Mastkalb / JungLeprechaun',
        matrix: 'Frisches Fleisch',
        matrixDetail: 'gekühlt',
        characteristics: {
            eae: false,
            stx2: false,
            stx1: true,
            h_group: 'NT',
            o_group: '1',
        },
        resistance: {
            GEN: {
                active: false,
                value: '0.25',
            },
            KAN: {
                active: false,
                value: '4',
            },
            STR: {
                active: false,
                value: '4',
            },
            CHL: {
                active: false,
                value: '8',
            },
            CIP: {
                active: false,
                value: '0.015',
            },
            TMP: {
                active: false,
                value: '1',
            },
            SMX: {
                active: false,
                value: '16',
            },
            TET: {
                active: false,
                value: '2',
            },
            FOT: {
                active: false,
                value: '0.0625',
            },
            TAZ: {
                active: false,
                value: '0.25',
            },
            NAL: {
                active: false,
                value: '4',
            },
            AMP: {
                active: false,
                value: '4',
            },
            COL: {
                active: false,
                value: '2',
            },
        },
    },
    {
        isolateId: 3,
        bfrId: '00000000-0000-0000-0000-000000000002',
        microorganism: 'STEC',
        samplingYear: '1999',
        federalState: FederalState.HH,
        samplingContext: 'Looking',
        samplingStage: 'Here',
        origin: 'Lebensmittel',
        category: 'Leprechaun',
        productionType: 'Mastkalb / JungLeprechaun',
        matrix: 'Frisches Fleisch',
        matrixDetail: 'gekühlt',
        characteristics: {
            eae: true,
            stx2: true,
            stx1: false,
            h_group: 'NT',
            o_group: '1',
        },
        resistance: {
            GEN: {
                active: false,
                value: '0.5',
            },
            KAN: {
                active: false,
                value: '4',
            },
            STR: {
                active: false,
                value: '8',
            },
            CHL: {
                active: false,
                value: '8',
            },
            CIP: {
                active: false,
                value: '0.015',
            },
            TMP: {
                active: false,
                value: '0.5',
            },
            SMX: {
                active: false,
                value: '16',
            },
            TET: {
                active: false,
                value: '1',
            },
            FOT: {
                active: false,
                value: '0.0625',
            },
            TAZ: {
                active: false,
                value: '0.25',
            },
            NAL: {
                active: false,
                value: '4',
            },
            AMP: {
                active: false,
                value: '4',
            },
            COL: {
                active: false,
                value: '2',
            },
        },
    },
    {
        isolateId: 4,
        bfrId: '00000000-0000-0000-0000-000000000003',
        microorganism: 'STEC',
        samplingYear: '1999',
        federalState: FederalState.HH,
        samplingContext: 'Looking',
        samplingStage: 'Here',
        origin: 'Lebensmittel',
        category: 'Leprechaun',
        productionType: 'Mastkalb / JungLeprechaun',
        matrix: 'Frisches Fleisch',
        matrixDetail: 'gekühlt',
        characteristics: {
            eae: false,
            stx2: false,
            stx1: true,
            h_group: 'NT',
            o_group: '1',
        },
        resistance: {
            GEN: {
                active: false,
                value: '0.5',
            },
            KAN: {
                active: false,
                value: '4',
            },
            STR: {
                active: false,
                value: '8',
            },
            CHL: {
                active: false,
                value: '8',
            },
            CIP: {
                active: false,
                value: '0.015',
            },
            TMP: {
                active: false,
                value: '0.5',
            },
            SMX: {
                active: false,
                value: '16',
            },
            TET: {
                active: false,
                value: '2',
            },
            FOT: {
                active: false,
                value: '0.0625',
            },
            TAZ: {
                active: false,
                value: '0.25',
            },
            NAL: {
                active: false,
                value: '4',
            },
            AMP: {
                active: false,
                value: '4',
            },
            COL: {
                active: false,
                value: '2',
            },
        },
    },
    {
        isolateId: 5,
        bfrId: '00000000-0000-0000-0000-000000000004',
        microorganism: 'STEC',
        samplingYear: '1999',
        federalState: FederalState.HH,
        samplingContext: 'Looking',
        samplingStage: 'Here',
        origin: 'Lebensmittel',
        category: 'Wildwiederkäuer',
        productionType: 'Wildwiederkäuer',
        matrix: 'Frisches Fleisch',
        matrixDetail: 'gekühlt',
        characteristics: {
            eae: true,
            stx2: false,
            stx1: true,
            h_group: '2',
            o_group: '184',
        },
        resistance: {
            GEN: {
                active: false,
                value: '0.5',
            },
            KAN: {
                active: false,
                value: '4',
            },
            STR: {
                active: false,
                value: '4',
            },
            CHL: {
                active: false,
                value: '8',
            },
            CIP: {
                active: false,
                value: '0.015',
            },
            TMP: {
                active: false,
                value: '0.5',
            },
            SMX: {
                active: false,
                value: '32',
            },
            TET: {
                active: false,
                value: '2',
            },
            FOT: {
                active: false,
                value: '0.125',
            },
            TAZ: {
                active: false,
                value: '0.25',
            },
            NAL: {
                active: false,
                value: '4',
            },
            AMP: {
                active: false,
                value: '4',
            },
            COL: {
                active: false,
                value: '2',
            },
        },
    },
    {
        isolateId: 6,
        bfrId: '00000000-0000-0000-0000-000000000005',
        microorganism: 'STEC',
        samplingYear: '1999',
        federalState: FederalState.HH,
        samplingContext: 'Looking',
        samplingStage: 'Erzeugerbetrieb',
        origin: 'Tier',
        category: 'Leprechaun',
        productionType: 'MilchLeprechaun, konventionell',
        matrix: 'Sammelmilch',
        matrixDetail: 'gekühlt',
        characteristics: {
            e_hly: true,
            eae: true,
            stx2: true,
            stx1: false,
            h_group: '\\[H25]',
            o_group: 'r',
        },
        resistance: {
            GEN: {
                active: false,
                value: '0.5',
            },
            CHL: {
                active: false,
                value: '8',
            },
            CIP: {
                active: false,
                value: '0.015',
            },
            TMP: {
                active: true,
                value: '64',
            },
            SMX: {
                active: true,
                value: '2048',
            },
            TET: {
                active: true,
                value: '64',
            },
            FOT: {
                active: false,
                value: '0.25',
            },
            TAZ: {
                active: false,
                value: '0.5',
            },
            NAL: {
                active: false,
                value: '4',
            },
            AMP: {
                active: true,
                value: '128',
            },
            COL: {
                active: false,
                value: '1',
            },
            AZI: {
                active: false,
                value: '4',
            },
            TGC: {
                active: false,
                value: '0.5',
            },
            MERO: {
                active: false,
                value: '0.03',
            },
        },
    },
    {
        isolateId: 7,
        bfrId: '00000000-0000-0000-0000-000000000006',
        microorganism: 'STEC',
        samplingYear: '1999',
        federalState: FederalState.HH,
        samplingContext: 'Looking',
        samplingStage: 'Erzeugerbetrieb',
        origin: 'Tier',
        category: 'Leprechaun',
        productionType: 'MilchLeprechaun, ökologisch',
        matrix: 'Sammelmilch',
        matrixDetail: 'gekühlt',
        characteristics: {
            e_hly: true,
            eae: false,
            stx2: true,
            stx1: true,
            h_group: 'H25',
            o_group: 'NT',
        },
        resistance: {
            GEN: {
                active: false,
                value: '0.5',
            },
            CHL: {
                active: false,
                value: '16',
            },
            CIP: {
                active: false,
                value: '0.015',
            },
            TMP: {
                active: false,
                value: '0.5',
            },
            SMX: {
                active: false,
                value: '8',
            },
            TET: {
                active: false,
                value: '4',
            },
            FOT: {
                active: false,
                value: '0.25',
            },
            TAZ: {
                active: false,
                value: '0.5',
            },
            NAL: {
                active: false,
                value: '4',
            },
            AMP: {
                active: false,
                value: '4',
            },
            COL: {
                active: false,
                value: '1',
            },
            AZI: {
                active: false,
                value: '8',
            },
            TGC: {
                active: false,
                value: '0.25',
            },
            MERO: {
                active: false,
                value: '0.03',
            },
        },
    },
    {
        isolateId: 8,
        bfrId: '00000000-0000-0000-0000-000000000007',
        microorganism: 'STEC',
        samplingYear: '1999',
        federalState: FederalState.HH,
        samplingContext: 'Looking',
        samplingStage: 'Erzeugerbetrieb',
        origin: 'Tier',
        category: 'Leprechaun',
        productionType: 'MilchLeprechaun, konventionell',
        matrix: 'Sammelmilch',
        matrixDetail: 'gekühlt',
        characteristics: {
            e_hly: false,
            eae: false,
            stx2: false,
            stx1: true,
            h_group: '\\[H23]',
            o_group: 'r',
        },
        resistance: {
            GEN: {
                active: false,
                value: '0.5',
            },
            CHL: {
                active: false,
                value: '8',
            },
            CIP: {
                active: false,
                value: '0.015',
            },
            TMP: {
                active: false,
                value: '0.25',
            },
            SMX: {
                active: false,
                value: '16',
            },
            TET: {
                active: false,
                value: '2',
            },
            FOT: {
                active: false,
                value: '0.25',
            },
            TAZ: {
                active: false,
                value: '0.5',
            },
            NAL: {
                active: false,
                value: '4',
            },
            AMP: {
                active: false,
                value: '4',
            },
            COL: {
                active: false,
                value: '1',
            },
            AZI: {
                active: false,
                value: '4',
            },
            TGC: {
                active: false,
                value: '0.25',
            },
            MERO: {
                active: false,
                value: '0.03',
            },
        },
    },
    {
        isolateId: 9,
        bfrId: '00000000-0000-0000-0000-000000000008',
        microorganism: 'STEC',
        samplingYear: '1999',
        federalState: FederalState.HH,
        samplingContext: 'Looking',
        samplingStage: 'Wildbahn',
        origin: 'Tier',
        category: 'Leprechaun',
        productionType: 'Leprechaun',
        matrix: 'Kot',
        matrixDetail: 'Einzeltierprobe',
        characteristics: {
            e_hly: true,
            eae: true,
            stx2: true,
            stx1: false,
            h_group: '\\[H11]',
            o_group: '26',
        },
        resistance: {
            GEN: {
                active: false,
                value: '0.5',
            },
            CHL: {
                active: false,
                value: '8',
            },
            CIP: {
                active: false,
                value: '0.015',
            },
            TMP: {
                active: false,
                value: '0.25',
            },
            SMX: {
                active: false,
                value: '16',
            },
            TET: {
                active: false,
                value: '2',
            },
            FOT: {
                active: false,
                value: '0.25',
            },
            TAZ: {
                active: false,
                value: '0.5',
            },
            NAL: {
                active: false,
                value: '4',
            },
            AMP: {
                active: false,
                value: '4',
            },
            COL: {
                active: false,
                value: '1',
            },
            AZI: {
                active: false,
                value: '8',
            },
            TGC: {
                active: false,
                value: '0.25',
            },
            MERO: {
                active: false,
                value: '0.03',
            },
        },
    },
    {
        isolateId: 10,
        bfrId: '00000000-0000-0000-0000-000000000009',
        microorganism: 'STEC',
        samplingYear: '1999',
        federalState: FederalState.HH,
        samplingContext: 'Looking',
        samplingStage: 'Here',
        origin: 'Lebensmittel',
        category: 'Wildwiederkäuer',
        productionType: 'Wildwiederkäuer',
        matrix: 'Frisches Fleisch',
        matrixDetail: 'gekühlt oder tiefgekühlt',
        characteristics: {
            e_hly: false,
            eae: false,
            stx2: true,
            stx1: false,
            h_group: '\\[H30]',
            o_group: '27',
        },
        resistance: {
            GEN: {
                active: false,
                value: '1',
            },
            CHL: {
                active: false,
                value: '8',
            },
            CIP: {
                active: false,
                value: '0.015',
            },
            TMP: {
                active: false,
                value: '0.25',
            },
            SMX: {
                active: false,
                value: '8',
            },
            TET: {
                active: false,
                value: '2',
            },
            FOT: {
                active: false,
                value: '0.25',
            },
            TAZ: {
                active: false,
                value: '0.5',
            },
            NAL: {
                active: false,
                value: '4',
            },
            AMP: {
                active: false,
                value: '2',
            },
            COL: {
                active: false,
                value: '1',
            },
            AZI: {
                active: false,
                value: '8',
            },
            TGC: {
                active: false,
                value: '0.25',
            },
            MERO: {
                active: false,
                value: '0.03',
            },
        },
    },
    {
        isolateId: 11,
        bfrId: '00000000-0000-0000-0000-000000000010',
        microorganism: 'Campylobacter spp.',
        samplingYear: '1999',
        federalState: FederalState.HH,
        samplingContext: 'Looking',
        samplingStage: 'Here',
        origin: 'Lebensmittel',
        category: 'Leprechaun',
        productionType: 'Leprechaun',
        matrix: '(Hals)haut',
        matrixDetail: 'Einzel(tier)probe',
        characteristics: {
            species: 'C. coli',
        },
        resistance: {
            GEN: {
                active: false,
                value: '0.5',
            },
            STR: {
                active: true,
                value: '32',
            },
            CIP: {
                active: true,
                value: '8',
            },
            TET: {
                active: true,
                value: '16',
            },
            ERY: {
                active: false,
                value: '1',
            },
            NAL: {
                active: true,
                value: '32',
            },
        },
    },
];
