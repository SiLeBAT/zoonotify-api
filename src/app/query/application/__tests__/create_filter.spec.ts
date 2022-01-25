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
            genes: ['stx1_Gen'],
            microorganism: ['STEC'],
        };

        const result = await service.createFilter(queryParameter);
        expect(result).toStrictEqual({
            microorganism: [
                {
                    trigger: 'STEC',
                    dependent: {
                        characteristicValue: '+',
                        characteristic: ['stx1_Gen'],
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
});
