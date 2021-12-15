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
});
