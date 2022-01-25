import { FederalState } from './../../../app/query/domain/federal-state.entity';
import { IsolateViewGateway } from './../../../app/ports';

export function getMockIsolateViewGateway(): IsolateViewGateway {
    return {
        getCount: jest.fn(() =>
            Promise.resolve({
                totalNumberOfIsolates: 0,
            })
        ),
        getUniqueAttributeValues: jest.fn(() => Promise.resolve([])),
        findAll: jest.fn(() =>
            Promise.resolve([
                {
                    id: 1,
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
                        eae: '-',
                        stx2: '-',
                        stx1: '+',
                        h_group: 'NT',
                        o_group: '1',
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
                    id: 2,
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
                        eae: '-',
                        stx2: '-',
                        stx1: '+',
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
                    id: 3,
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
                        eae: '+',
                        stx2: '+',
                        stx1: '-',
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
                    id: 4,
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
                        eae: '-',
                        stx2: '-',
                        stx1: '+',
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
                    id: 5,
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
                        eae: '+',
                        stx2: '-',
                        stx1: '+',
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
            ])
        ),
    };
}

export const mockIsolates = [
    {
        id: 1,
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
            eae: '-',
            stx2: '-',
            stx1: '+',
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
        id: 2,
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
            eae: '-',
            stx2: '-',
            stx1: '+',
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
        id: 3,
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
            eae: '+',
            stx2: '+',
            stx1: '-',
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
        id: 4,
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
            eae: '-',
            stx2: '-',
            stx1: '+',
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
        id: 5,
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
            eae: '+',
            stx2: '-',
            stx1: '+',
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
        id: 6,
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
            e_hly: '+',
            eae: '+',
            stx2: '+',
            stx1: '-',
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
        id: 7,
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
            e_hly: '+',
            eae: '-',
            stx2: '+',
            stx1: '+',
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
        id: 8,
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
            e_hly: '-',
            eae: '-',
            stx2: '-',
            stx1: '+',
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
        id: 9,
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
            e_hly: '+',
            eae: '+',
            stx2: '+',
            stx1: '-',
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
        id: 10,
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
            e_hly: '-',
            eae: '-',
            stx2: '+',
            stx1: '-',
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
];
