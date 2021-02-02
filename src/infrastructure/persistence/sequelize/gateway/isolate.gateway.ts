import { FilterConverter } from './../service/filter-converter.service';
import { IsolateModel } from '../dao/isolate.model';
import { ModelStatic } from '../dao/shared.model';
import { PERSISTENCE_TYPES } from '../persistence.types';
import {
    Isolate,
    FederalState,
    IsolateGateway,
    IsolateCollection,
    IsolateCharacteristics,
    IsolateResistance,
    IsolateCount,
    Filter
} from '../../../../app/ports';
import { inject, injectable } from 'inversify';
import { logger } from './../../../../aspects';
import * as _ from 'lodash';

@injectable()
export class SequelizeIsolateGateway implements IsolateGateway {
    static toEntity(isolateModel: IsolateModel): Isolate {
        const characteristics: IsolateCharacteristics = SequelizeIsolateGateway.getCharacteristic(
            isolateModel
        );

        const resistances: IsolateResistance = SequelizeIsolateGateway.getResistance(
            isolateModel
        );
        return {
            microorganism: isolateModel.microorganism,
            id: isolateModel.isolateId,
            federalState: isolateModel.federalState as FederalState,
            samplingYear: isolateModel.samplingYear,
            samplingContext: isolateModel.samplingContext,
            samplingStage: isolateModel.samplingStage,
            origin: isolateModel.origin,
            category: isolateModel.category,
            productionType: isolateModel.productionType,
            matrix: isolateModel.matrix,
            matrixDetail: isolateModel.matrixDetail,
            characteristics: characteristics,
            resistance: resistances
        };
    }

    private static getCharacteristic(
        model: IsolateModel
    ): IsolateCharacteristics {
        const characteristics: IsolateCharacteristics = {
            [model.characteristic]: model.characteristicValue
        };
        return characteristics;
    }

    private static getResistance(model: IsolateModel): IsolateResistance {
        const resistance: IsolateResistance = {
            [model.resistance]: {
                active: model.resistanceActive,
                value: model.resistanceValue
            }
        };
        return resistance;
    }

    constructor(
        @inject(PERSISTENCE_TYPES.IsolateModel)
        private Isolate: ModelStatic<IsolateModel>,
        @inject(PERSISTENCE_TYPES.FilterConverterService)
        private filterConverter: FilterConverter
    ) {}

    findAll(filter: Filter = {}): Promise<IsolateCollection> {
        logger.trace(
            `${this.constructor.name}.${this.findAll.name}, Executing`
        );
        let options = {};
        const whereClause = this.filterConverter.convertFilter(filter);
        options = {
            ...options,
            ...whereClause
        };
        return this.Isolate.findAll(options)
            .then(models => {
                const isolates = models.reduce((acc, current) => {
                    let entity: Isolate = acc[current.isolateId];
                    if (!entity) {
                        acc[
                            current.isolateId
                        ] = SequelizeIsolateGateway.toEntity(current);
                    } else {
                        entity.characteristics = {
                            ...entity.characteristics,
                            ...SequelizeIsolateGateway.getCharacteristic(
                                current
                            )
                        };
                        entity.resistance = {
                            ...entity.resistance,
                            ...SequelizeIsolateGateway.getResistance(current)
                        };
                    }

                    return acc;
                }, {} as { [key: number]: Isolate });

                return Object.values(isolates);
            })
            .catch(error => {
                logger.error(error);
                throw error;
            });
    }

    async getCount(filter: Filter = {}): Promise<IsolateCount> {
        logger.trace(
            `${this.constructor.name}.${this.getCount.name}, Executing with: ${filter}`
        );
        let options = {
            distinct: true
        };

        const whereClause = this.filterConverter.convertFilter(filter);
        options = {
            ...options,
            ...whereClause
        };
        return this.Isolate.count(options).catch(error => {
            logger.error(error);
            throw error;
        });
    }
}
