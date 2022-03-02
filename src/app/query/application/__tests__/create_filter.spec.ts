import { QueryParameters } from './../../model/shared.model';
import { FilterResolutionService } from './../../model/filter.model';
import { getContainer } from '../../../../aspects/container/container';
import { Container } from 'inversify';
import { mockPersistenceContainerModule } from '../../../../infrastructure/persistence/__mocks__/persistence-mock.module';
import { APPLICATION_TYPES } from '../../../application.types';
import { getApplicationContainerModule } from '../../../ports';

describe('Create Query Filter Use Case', () => {
    let service: FilterResolutionService;
    let container: Container | null;
    beforeEach(() => {
        container = getContainer();
        container.load(
            getApplicationContainerModule({
                appName: 'TestZN',
                apiUrl: '/',
                supportContact: 'none',
            }),
            mockPersistenceContainerModule
        );
        service = container.get<FilterResolutionService>(
            APPLICATION_TYPES.FilterResolutionService
        );
    });
    afterEach(() => {
        container = null;
    });
    const exampleQueryParameter: QueryParameters = {
        matrix: ['Blinddarminhalt'],
        matrixDetail: ['Poolprobe'],
    };

    it('should return a promise', () => {
        const result = service.createFilter(exampleQueryParameter);
        expect(result).toBeInstanceOf(Promise);
    });
    it('should return a simple filter', async () => {
        const result = await service.createFilter(exampleQueryParameter);
        expect(result).toStrictEqual({
            matrix: ['Blinddarminhalt'],
            matrixDetail: ['Poolprobe'],
        });
    });
    it('should not include "group-by" parameter', async () => {
        const enhancedQuery: QueryParameters = {
            ...exampleQueryParameter,
            ['group-by']: ['microorganism'],
        };

        const result = await service.createFilter(enhancedQuery);
        expect(result).toStrictEqual({
            matrix: ['Blinddarminhalt'],
            matrixDetail: ['Poolprobe'],
        });
    });
    it('should return a filter with array', async () => {
        const result = await service.createFilter({
            matrix: ['Blinddarminhalt', 'Kot'],
        });
        expect(result).toStrictEqual({
            matrix: ['Blinddarminhalt', 'Kot'],
        });
    });
    it('should return a manual filter', async () => {
        const queryParameter: QueryParameters = {
            genes: ['stx1'],
            microorganism: ['STEC'],
        };

        const result = await service.createFilter(queryParameter);
        expect(result).toStrictEqual({
            microorganism: [
                {
                    trigger: 'STEC',
                    dependent: {
                        characteristicValue: '+',
                        characteristic: ['stx1'],
                    },
                },
            ],
        });
    });
    it('should return a dependent filter', async () => {
        const result = await service.createFilter({
            entero_spez: ['Enterococcus faecalis'],
            microorganism: ['Enterococcus spp.'],
        });
        expect(result).toStrictEqual({
            microorganism: [
                {
                    trigger: 'Enterococcus spp.',
                    dependent: {
                        characteristicValue: ['Enterococcus faecalis'],
                        characteristic: 'spez',
                    },
                },
            ],
        });
    });
    it('should return a dependent dynamic filter', async () => {
        const result = await service.createFilter({
            matrix: ['Blinddarminhalt', 'Kot'],
            matrixDetail__Kot: ['Einzeltierprobe'],
        });
        expect(result).toStrictEqual({
            matrix: [
                'Blinddarminhalt',
                {
                    trigger: 'Kot',
                    dependent: {
                        matrixDetail: 'Einzeltierprobe',
                    },
                },
            ],
        });
    });
    it('should return two dependent dynamic filter', async () => {
        const result = await service.createFilter({
            matrix: ['Blinddarminhalt', 'Kot'],
            matrixDetail__Kot: ['Einzeltierprobe'],
            matrixDetail__Blinddarminhalt: ['Einzeltierprobe'],
        });
        expect(result).toStrictEqual({
            matrix: [
                {
                    trigger: 'Kot',
                    dependent: {
                        matrixDetail: 'Einzeltierprobe',
                    },
                },
                {
                    trigger: 'Blinddarminhalt',
                    dependent: {
                        matrixDetail: 'Einzeltierprobe',
                    },
                },
            ],
        });
    });
    it('should return a resistance filter', async () => {
        const result = await service.createFilter({
            microorganism: ['Campylobacter spp.'],
            ['resistance__Campylobacter spp.']: ['GEN'],
        });
        expect(result).toStrictEqual({
            microorganism: [
                {
                    trigger: 'Campylobacter spp.',
                    dependent: {
                        resistance: 'GEN',
                        resistance_active: 'true',
                    },
                },
            ],
        });
    });
    it('should return two resistance filter', async () => {
        const result = await service.createFilter({
            microorganism: ['Campylobacter spp.'],
            ['resistance__Campylobacter spp.']: ['GEN', 'CIP'],
        });
        expect(result).toStrictEqual({
            microorganism: [
                {
                    trigger: 'Campylobacter spp.',
                    dependent: {
                        resistance: 'GEN',
                        resistance_active: 'true',
                    },
                },
                {
                    trigger: 'Campylobacter spp.',
                    dependent: {
                        resistance: 'CIP',
                        resistance_active: 'true',
                    },
                },
            ],
        });
    });
    it('should return a characteristic filter', async () => {
        const result = await service.createFilter({
            microorganism: ['STEC'],
            ['o_group']: ['116'],
        });
        expect(result).toStrictEqual({
            microorganism: [
                {
                    trigger: 'STEC',
                    dependent: {
                        characteristic: 'O_Gruppe',
                        characteristicValue: ['116'],
                    },
                },
            ],
        });
    });
    it('should include genes characteristics parameter because of group-by', async () => {
        const enhancedQuery: QueryParameters = {
            ...exampleQueryParameter,
            ['group-by']: ['genes'],
        };

        const result = await service.createFilter(enhancedQuery);
        expect(result).toStrictEqual({
            characteristic: ['stx1', 'stx2', 'eae', 'e_hly'],
            characteristic_value: ['+'],
            matrix: ['Blinddarminhalt'],
            matrixDetail: ['Poolprobe'],
        });
    });
    it('should include o_group characteristics parameter because of group-by', async () => {
        const enhancedQuery: QueryParameters = {
            ...exampleQueryParameter,
            ['group-by']: ['o_group'],
        };

        const result = await service.createFilter(enhancedQuery);
        expect(result).toStrictEqual({
            characteristic: ['o_group'],
            matrix: ['Blinddarminhalt'],
            matrixDetail: ['Poolprobe'],
        });
    });

    it('should include spez characteristics and Campy microorganism parameter because of group-by', async () => {
        const enhancedQuery: QueryParameters = {
            ...exampleQueryParameter,
            ['group-by']: ['campy_spez'],
        };

        const result = await service.createFilter(enhancedQuery);
        expect(result).toStrictEqual({
            characteristic: ['spez'],
            microorganism: ['Campylobacter spp.'],
            matrix: ['Blinddarminhalt'],
            matrixDetail: ['Poolprobe'],
        });
    });

    it('should include spez characteristics and Entero microorganism parameter because of group-by', async () => {
        const enhancedQuery: QueryParameters = {
            ...exampleQueryParameter,
            ['group-by']: ['entero_spez'],
        };

        const result = await service.createFilter(enhancedQuery);
        expect(result).toStrictEqual({
            characteristic: ['spez'],
            microorganism: ['Enterococcus spp.'],
            matrix: ['Blinddarminhalt'],
            matrixDetail: ['Poolprobe'],
        });
    });

    it('should include ampc_carba_phenotype characteristics and CARBA-E. coli microorganism parameter because of group-by', async () => {
        const enhancedQuery: QueryParameters = {
            ...exampleQueryParameter,
            ['group-by']: ['carba_ampc_carba_phenotype'],
        };

        const result = await service.createFilter(enhancedQuery);
        expect(result).toStrictEqual({
            characteristic: ['ampc_carba_phenotype'],
            microorganism: ['CARBA-E. coli'],
            matrix: ['Blinddarminhalt'],
            matrixDetail: ['Poolprobe'],
        });
    });

    it('should include ampc_carba_phenotype characteristics and ESBL/AmpC-E. coli microorganism parameter because of group-by', async () => {
        const enhancedQuery: QueryParameters = {
            ...exampleQueryParameter,
            ['group-by']: ['esbl_ampc_carba_phenotype'],
        };

        const result = await service.createFilter(enhancedQuery);
        expect(result).toStrictEqual({
            characteristic: ['ampc_carba_phenotype'],
            microorganism: ['ESBL/AmpC-E. coli'],
            matrix: ['Blinddarminhalt'],
            matrixDetail: ['Poolprobe'],
        });
    });
});
