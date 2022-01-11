import { inject, injectable } from 'inversify';
import * as _ from 'lodash';
import {
    IsolateViewAttributes,
    IsolateViewModel,
} from '../dao/isolate-view.model';
import { CountGroup } from '../../../../app/query/model/isolate.model';
import { FilterConverter } from '../service/filter-converter.service';
import { ModelStatic } from '../dao/shared.model';
import { PERSISTENCE_TYPES } from '../persistence.types';
import {
    IsolateView,
    FederalState,
    IsolateViewGateway,
    IsolateCollection,
    IsolateCharacteristics,
    IsolateResistance,
    IsolateCount,
    QueryFilter,
    GroupAttributes,
} from '../../../../app/ports';
import { logger } from '../../../../aspects';

@injectable()
export class SequelizeIsolateViewGateway implements IsolateViewGateway {
    static toEntity(isolateViewModel: IsolateViewModel): IsolateView {
        const characteristics: IsolateCharacteristics =
            SequelizeIsolateViewGateway.getCharacteristic(isolateViewModel);

        const resistances: IsolateResistance =
            SequelizeIsolateViewGateway.getResistance(isolateViewModel);
        return {
            microorganism: isolateViewModel.microorganism,
            id: isolateViewModel.isolateId,
            federalState: isolateViewModel.federalState as FederalState,
            samplingYear: isolateViewModel.samplingYear,
            samplingContext: isolateViewModel.samplingContext,
            samplingStage: isolateViewModel.samplingStage,
            origin: isolateViewModel.origin,
            category: isolateViewModel.category,
            productionType: isolateViewModel.productionType,
            matrix: isolateViewModel.matrix,
            matrixDetail: isolateViewModel.matrixDetail,
            characteristics,
            resistance: resistances,
        };
    }

    private static getCharacteristic(
        model: IsolateViewModel
    ): IsolateCharacteristics {
        const characteristics: IsolateCharacteristics = {
            [model.characteristic]: model.characteristicValue,
        };
        return characteristics;
    }

    private static getResistance(model: IsolateViewModel): IsolateResistance {
        const resistance: IsolateResistance = {
            [model.resistance]: {
                active: model.resistanceActive,
                value: model.resistanceValue,
            },
        };
        return resistance;
    }

    constructor(
        @inject(PERSISTENCE_TYPES.IsolateViewModel)
        private IsolateView: ModelStatic<IsolateViewModel>,
        @inject(PERSISTENCE_TYPES.FilterConverterService)
        private filterConverter: FilterConverter
    ) {}

    findAll(filter: QueryFilter = {}): Promise<IsolateCollection> {
        logger.trace(
            `${this.constructor.name}.${this.findAll.name}, Executing`
        );
        let options = {};
        const whereClause = this.filterConverter.convertFilter(filter);
        options = {
            ...options,
            ...whereClause,
        };

        return this.IsolateView.findAll(options)
            .then((models) => {
                const isolates = models.reduce((acc, current) => {
                    const entity: IsolateView = acc[current.isolateId];
                    if (!entity) {
                        acc[current.isolateId] =
                            SequelizeIsolateViewGateway.toEntity(current);
                    } else {
                        entity.characteristics = {
                            ...entity.characteristics,
                            ...SequelizeIsolateViewGateway.getCharacteristic(
                                current
                            ),
                        };
                        entity.resistance = {
                            ...entity.resistance,
                            ...SequelizeIsolateViewGateway.getResistance(
                                current
                            ),
                        };
                    }

                    return acc;
                }, {} as { [key: number]: IsolateView });

                return Object.values(isolates);
            })
            .catch((error) => {
                logger.error(error);
                throw error;
            });
    }

    async getCount(
        filter: QueryFilter = {},
        groupAttributes: GroupAttributes = []
    ): Promise<IsolateCount> {
        logger.trace(
            `${this.constructor.name}.${this.getCount.name}, Executing with: ${filter}`
        );
        let options = {
            distinct: true,
        };
        const whereClause = this.filterConverter.convertFilter(filter);
        options = {
            ...options,
            ...whereClause,
        };

        const result: IsolateCount = await this.IsolateView.count(options)
            .then((dbCount) => {
                return {
                    totalNumberOfIsolates: dbCount,
                };
            })
            .catch((error) => {
                logger.error('Unable to retrieve count data', error);
                throw error;
            });

        const groupByValues = _.compact(groupAttributes);

        if (groupByValues.length > 0) {
            const groupBy = {
                group: groupByValues,
            };
            options = {
                ...options,
                ...groupBy,
            };
            const groupings: CountGroup[] = await this.IsolateView.count(
                options
            )
                .then((dbCount) => {
                    return dbCount as unknown as CountGroup[];
                })
                .catch((error) => {
                    logger.error('Unable to retrieve count data', error);
                    throw error;
                });
            result.groups = groupings;
        }
        return result;
    }

    getUniqueAttributeValues(
        property: keyof IsolateViewAttributes,
        filter: QueryFilter = {}
    ): Promise<(string | number | boolean)[]> {
        let options = {
            attributes: [property],
            group: property,
        };
        const whereClause = this.filterConverter.convertFilter(filter);
        options = {
            ...options,
            ...whereClause,
        };

        // Here we need to filter out null values due to the way the IsolatView is constructed (via multiple joins)
        return this.IsolateView.findAll(options).then((data) => {
            return data
                .map((d) => {
                    return d[property];
                })
                .filter((d) => !_.isNil(d))
                .sort();
        });
    }
}
