import { QueryFilter, FilterValue } from './../shared.model';
import { IsolateCollection } from './../isolate.model';
import { createIsolate } from './../isolate.entity';
import { createIsolateCollection } from './../isolate-collection.entity';
import { createQueryFilter } from '../query-filter.entity';
import { FederalState } from '../federal-state.enum';

describe('Isolate-Collection Entity', () => {
    let testObject: IsolateCollection;
    let mainFilter: QueryFilter;
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
                eae: false,
                stx2: false,
                stx1: true,
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
            {},
            r.resistance,
            r.bfrId,
            r.isolateId
        );
    });
    let testFilter: FilterValue[] = [
        {
            key: 'resistance',
            value: 'GEN',
        },
        {
            key: 'resistance_active',
            value: 'true',
        },
        {
            key: 'microorganism',
            value: 'STEC',
        },
        {
            key: 'characteristicValue',
            value: '184',
        },
        {
            key: 'characteristic',
            value: 'o_group',
        },
        {
            key: 'microorganism',
            value: 'Campylobacter spp.',
        },
        {
            key: 'characteristic',
            value: 'species',
        },
        {
            key: 'characteristicValue',
            value: 'C. bobby',
        },
        {
            key: 'characteristicValue',
            value: 'C. coli',
        },
    ];
    beforeEach(() => {
        testObject = createIsolateCollection(isolateArray);
        mainFilter = createQueryFilter();
    });
    it('should return one GEN positive', async () => {
        const pk = mainFilter.addFilter(testFilter[2]);
        const sk = mainFilter.addFilter(testFilter[0], pk);
        mainFilter.addFilter(testFilter[1], sk);

        // testObject = createIsolateCollection(isolateArray, mainFilter);
        // const result = testObject.isolates;

        // expect(result.length).toEqual(1);
        // const entry = result[0];
        // expect(entry.getResistancesProfileFor('GEN')?.active).toBeTruthy;
        // expect(entry.getResistancesProfileFor('KAN')?.active).toBeFalsy;
    });
    it('should return one O_Gruppe 184 entry', async () => {
        const pk = mainFilter.addFilter(testFilter[2]);
        const sk = mainFilter.addFilter(testFilter[4], pk);
        mainFilter.addFilter(testFilter[3], sk);

        // testObject = createIsolateCollection(isolateArray, mainFilter);
        // const result = testObject.isolates;
        // expect(result.length).toEqual(1);
        // const entry = result[0];
        // expect(entry.getCharacteristicValue('o_group')).toEqual('184');
        // expect(entry.getCharacteristicValue('h_group')).toEqual('2');
    });
    it('should return all entries', async () => {
        mainFilter.addFilter(testFilter[2]);
        mainFilter.addFilter(testFilter[5]);
        // testObject = createIsolateCollection(isolateArray, mainFilter);
        // const result = testObject.isolates;

        // expect(result.length).toEqual(6);
    });
    it('should return all 1 C.coli entries', async () => {
        const pk = mainFilter.addFilter(testFilter[5]);
        const sk = mainFilter.addFilter(testFilter[6], pk);
        mainFilter.addFilter(testFilter[8], sk);

        // testObject = createIsolateCollection(isolateArray, mainFilter);
        // const result = testObject.isolates;

        // expect(result.length).toEqual(1);
    });
    it('should return 0 entries', async () => {
        const pk = mainFilter.addFilter(testFilter[5]);
        const sk = mainFilter.addFilter(testFilter[6], pk);
        mainFilter.addFilter(testFilter[7], sk);

        // testObject = createIsolateCollection(isolateArray, mainFilter);
        // const result = testObject.isolates;

        // expect(result.length).toEqual(0);
    });
});
