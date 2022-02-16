import 'reflect-metadata';
import { Op } from 'sequelize';
import {
    FilterConverter,
    SequelizeFilterConverter,
} from './../filter-converter.service';

describe('Filter Conversion Use Case', () => {
    let service: FilterConverter;
    beforeEach(() => {
        service = new SequelizeFilterConverter();
    });

    it('should return an empty filter', () => {
        const result = service.convertFilter({});
        expect(result).toStrictEqual({});
    });
    it('should convert a simple filter', async () => {
        const result = await service.convertFilter({
            matrix: 'Blinddarminhalt',
            matrixDetail: 'Poolprobe',
        });
        expect(result).toStrictEqual({
            where: {
                matrix: 'Blinddarminhalt',
                matrixDetail: 'Poolprobe',
            },
        });
    });
    it('should convert a filter with array', async () => {
        const result = await service.convertFilter({
            matrix: ['Blinddarminhalt', 'Kot'],
        });
        expect(result).toStrictEqual({
            where: {
                matrix: ['Blinddarminhalt', 'Kot'],
            },
        });
    });
    it('should convert a dependent filter', async () => {
        const result = await service.convertFilter({
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
        expect(result).toStrictEqual({
            where: {
                [Op.or]: [
                    { matrix: ['Blinddarminhalt'] },
                    {
                        [Op.and]: [
                            { matrix: 'Kot' },
                            { matrixDetail: 'Einzeltierprobe' },
                        ],
                    },
                ],
            },
        });
    });
    it('should convert two dependent filter', async () => {
        const result = await service.convertFilter({
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

    it('should convert resistance filter', async () => {
        const result = await service.convertFilter({
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
        expect(result).toStrictEqual({
            where: {
                [Op.or]: [
                    {
                        [Op.and]: [
                            { microorganism: 'Campylobacter spp.' },
                            {
                                resistance: 'GEN',
                                resistance_active: 'true',
                            },
                        ],
                    },
                ],
            },
        });
    });

    it('should convert two resistance filter', async () => {
        const result = await service.convertFilter({
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
        expect(result).toStrictEqual({
            where: {
                [Op.or]: [
                    {
                        [Op.and]: [
                            { microorganism: 'Campylobacter spp.' },
                            {
                                resistance: 'GEN',
                                resistance_active: 'true',
                            },
                        ],
                    },
                    {
                        [Op.and]: [
                            { microorganism: 'Campylobacter spp.' },
                            {
                                resistance: 'CIP',
                                resistance_active: 'true',
                            },
                        ],
                    },
                ],
            },
        });
    });

    it('should convert characteristic filter', async () => {
        const result = await service.convertFilter({
            microorganism: [
                {
                    trigger: 'STEC',
                    dependent: {
                        characteristic: 'o_group',
                        characteristicValue: '116',
                    },
                },
            ],
        });
        expect(result).toStrictEqual({
            where: {
                [Op.or]: [
                    {
                        [Op.and]: [
                            { microorganism: 'STEC' },
                            {
                                characteristic: 'O_Gruppe',
                                characteristicValue: '116',
                            },
                        ],
                    },
                ],
            },
        });
    });
});
