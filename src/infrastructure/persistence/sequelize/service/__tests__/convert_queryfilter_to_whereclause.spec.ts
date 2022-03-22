import 'reflect-metadata';
import { Op } from 'sequelize';
import { createQueryFilter, FilterValue } from '../../../../../app/ports';
import {
    FilterConverter,
    SequelizeFilterConverter,
} from './../filter-converter.service';

describe('Filter Conversion Use Case', () => {
    let service: FilterConverter;
    const testFilter: FilterValue[] = [
        {
            key: 'matrix',
            value: 'Blinddarminhalt',
        },
        {
            key: 'matrixDetail',
            value: 'Poolprobe',
        },
        {
            key: 'matrix',
            value: 'Kot',
        },
        {
            key: 'matrixDetail',
            value: 'Einzeltierprobe',
        },
        {
            key: 'matrixDetail',
            value: 'Einzeltierprobe',
        },
        {
            key: 'microorganism',
            value: 'Campylobacter spp.',
        },
        {
            key: 'resistance',
            value: 'GEN',
        },
        {
            key: 'resistance_active',
            value: 'true',
        },
        {
            key: 'resistance',
            value: 'CIP',
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
            value: '116',
        },
        {
            key: 'characteristic',
            value: 'o_group',
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
        service = new SequelizeFilterConverter();
    });

    it('should return an empty filter', () => {
        const result = service.convertFilter(createQueryFilter());
        expect(result).toStrictEqual({});
    });
    it('should convert a simple filter', async () => {
        const queryFilter = createQueryFilter();
        queryFilter.addFilter(testFilter[0]);
        const result = await service.convertFilter(queryFilter);

        expect(result).toStrictEqual({
            where: {
                matrix: 'Blinddarminhalt',
            },
        });
    });
    it('should convert a filter with array', async () => {
        const queryFilter = createQueryFilter();
        queryFilter.addFilter(testFilter[0]);
        queryFilter.addFilter(testFilter[2]);
        const result = await service.convertFilter(queryFilter);
        expect(result).toStrictEqual({
            where: {
                [Op.or]: [{ matrix: 'Blinddarminhalt' }, { matrix: 'Kot' }],
            },
        });
    });
    it('should convert a filter with two independent attributes', async () => {
        const queryFilter = createQueryFilter();
        queryFilter.addFilter(testFilter[0]);
        queryFilter.addFilter(testFilter[5]);
        queryFilter.addFilter(testFilter[10]);
        const result = await service.convertFilter(queryFilter);
        expect(result).toStrictEqual({
            where: {
                [Op.and]: [
                    { matrix: 'Blinddarminhalt' },
                    {
                        [Op.or]: [
                            { microorganism: 'Campylobacter spp.' },
                            { microorganism: 'STEC' },
                        ],
                    },
                ],
            },
        });
    });
    it('should convert a dependents filter', async () => {
        const queryFilter = createQueryFilter();
        const pk2 = queryFilter.addFilter(testFilter[2]);
        queryFilter.addFilter(testFilter[3], pk2);
        queryFilter.addFilter(testFilter[0]);

        const result = await service.convertFilter(queryFilter);

        expect(result).toStrictEqual({
            where: {
                [Op.or]: [
                    {
                        [Op.and]: [
                            { matrix: 'Kot' },
                            { matrixDetail: 'Einzeltierprobe' },
                        ],
                    },
                    { matrix: 'Blinddarminhalt' },
                ],
            },
        });
    });
    it('should convert two dependents filter', async () => {
        const queryFilter = createQueryFilter();
        const pk2 = queryFilter.addFilter(testFilter[2]);
        queryFilter.addFilter(testFilter[3], pk2);
        const pk0 = queryFilter.addFilter(testFilter[0]);
        queryFilter.addFilter(testFilter[4], pk0);
        const result = await service.convertFilter(queryFilter);
        expect(result).toStrictEqual({
            where: {
                [Op.or]: [
                    {
                        [Op.and]: [
                            { matrix: 'Kot' },
                            { matrixDetail: 'Einzeltierprobe' },
                        ],
                    },
                    {
                        [Op.and]: [
                            { matrix: 'Blinddarminhalt' },
                            { matrixDetail: 'Einzeltierprobe' },
                        ],
                    },
                ],
            },
        });
    });
});
