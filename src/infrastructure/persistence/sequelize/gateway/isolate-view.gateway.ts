import { inject, injectable } from 'inversify';
import * as _ from 'lodash';
import {
    IsolateViewAttributes,
    IsolateViewModel,
} from '../dao/isolate-view.model';
import { FilterConverter } from '../service/filter-converter.service';
import { ModelStatic } from '../dao/shared.model';
import { PERSISTENCE_TYPES } from '../persistence.types';
import {
    QueryFilter,
    Isolate,
    FederalState,
    GeneSet,
    IsolateViewGateway,
    IsolateCollection,
    IsolateCharacteristicSet,
    IsolateResistanceSet,
    DataRequestCreatedEvent,
    createIsolateCollection,
    createIsolate,
} from '../../../../app/ports';
import { logger } from '../../../../aspects';
import { characteristicMap, geneMap } from '../service/utils.service';

@injectable()
export class SequelizeIsolateViewGateway implements IsolateViewGateway {
    private static retrieveEntityFromPartials<
        T extends GeneSet | IsolateCharacteristicSet | IsolateResistanceSet
    >(
        isolateViewModelArray: IsolateViewModel[],
        retrievePartial: (isolate: IsolateViewModel) => Partial<T>
    ): T {
        let obj: T;
        return isolateViewModelArray.reduce(
            (_obj: any, isolate: IsolateViewModel) => {
                const _tempSet: Partial<T> = retrievePartial(isolate);
                if (Object.keys(_tempSet)) {
                    obj = { ...obj, ..._tempSet };
                }
                return obj;
            },
            {}
        );
    }

    private static reduceArraytoEntity(
        isolateViewModelArray: IsolateViewModel[]
    ): Isolate | null {
        let _isolate: Isolate | null = null;
        let isolateViewModel: IsolateViewModel;
        if (isolateViewModelArray && isolateViewModelArray.length > 0) {
            isolateViewModel = isolateViewModelArray[0];
            const _genes: GeneSet =
                SequelizeIsolateViewGateway.retrieveEntityFromPartials<GeneSet>(
                    isolateViewModelArray,
                    SequelizeIsolateViewGateway.getGene
                );

            const _characteristics: IsolateCharacteristicSet =
                SequelizeIsolateViewGateway.retrieveEntityFromPartials<IsolateCharacteristicSet>(
                    isolateViewModelArray,
                    SequelizeIsolateViewGateway.getCharacteristic
                );
            const _resistances: IsolateResistanceSet =
                SequelizeIsolateViewGateway.retrieveEntityFromPartials<IsolateResistanceSet>(
                    isolateViewModelArray,
                    SequelizeIsolateViewGateway.getResistance
                );

            _isolate = createIsolate(
                isolateViewModel.federalState as FederalState,
                isolateViewModel.microorganism,
                isolateViewModel.samplingYear,
                isolateViewModel.samplingContext,
                isolateViewModel.samplingStage,
                isolateViewModel.origin,
                isolateViewModel.category,
                isolateViewModel.productionType,
                isolateViewModel.matrix,
                isolateViewModel.matrixDetail,
                _characteristics,
                _genes,
                _resistances,
                isolateViewModel.bfrId,
                isolateViewModel.isolateId
            );
        }
        return _isolate;
    }

    private static getGene(model: IsolateViewModel): Partial<GeneSet> {
        const geneKey = geneMap.get(model.characteristic);
        if (!_.isUndefined(geneKey)) {
            let value: string | boolean = model.characteristicValue;
            if (value === '+') {
                value = true;
            }
            if (value === '-') {
                value = false;
            }
            return { [geneKey]: value };
        }
        return {};
    }

    private static getCharacteristic(
        model: IsolateViewModel
    ): Partial<IsolateCharacteristicSet> {
        const characteristicKey = characteristicMap.get(model.characteristic);
        if (!_.isUndefined(characteristicKey)) {
            let value: string | boolean = model.characteristicValue;
            if (value === '+') {
                value = true;
            }
            if (value === '-') {
                value = false;
            }
            return {
                [characteristicKey]: value,
            };
        }
        return {};
    }

    private static getResistance(
        model: IsolateViewModel
    ): IsolateResistanceSet {
        if (_.isNull(model.resistance)) {
            return {};
        }
        const resistance: IsolateResistanceSet = {
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

    findAll(
        dataRequestCreated: DataRequestCreatedEvent,
        options = {}
    ): Promise<IsolateCollection> {
        logger.trace(
            `${this.constructor.name}.${this.findAll.name}, Executing`
        );
        const filter = dataRequestCreated.filter.getPersistenceFilter();
        const whereClause = this.filterConverter.convertFilter(filter);
        options = {
            ...options,
            ...whereClause,
        };

        return this.IsolateView.findAll(options)
            .then((models) =>
                this.turnModelCollectionIntoIsolateCollection(
                    models,
                    dataRequestCreated.filter
                )
            )
            .catch((error) => {
                logger.error(error);
                throw error;
            });
    }

    private turnModelCollectionIntoIsolateCollection(
        modelCollection: IsolateViewModel[],
        filter: QueryFilter
    ): IsolateCollection {
        const isolateArray: Isolate[] = [];
        const modelCollectionDict = _.groupBy(modelCollection, 'bfrId');
        const bfrIdArray = Object.keys(modelCollectionDict);
        for (let i = 0; i < bfrIdArray.length; i++) {
            const bfrId = bfrIdArray[i];
            const tempIsolateModelCollection = modelCollectionDict[bfrId];
            const isolate = SequelizeIsolateViewGateway.reduceArraytoEntity(
                tempIsolateModelCollection
            );
            if (null != isolate) {
                isolateArray.push(isolate);
            }
        }
        return createIsolateCollection(Object.values(isolateArray), filter);
    }

    async getCount(
        dataRequestCreated: DataRequestCreatedEvent
    ): Promise<IsolateCollection> {
        logger.trace(
            `${this.constructor.name}.${this.getCount.name}, Executing with: ${dataRequestCreated}`
        );
        const options = {
            distinct: true,
        };

        return await this.findAll(dataRequestCreated, options).catch(
            (error) => {
                logger.error('Unable to retrieve count data', error);
                throw error;
            }
        );
    }

    //FIXME: Application Filters?
    getUniqueAttributeValues(
        property: keyof IsolateViewAttributes,
        dataRequestCreated: DataRequestCreatedEvent
    ): Promise<(string | number | boolean)[]> {
        let options = {
            attributes: [property],
            group: property,
        };
        const filter = dataRequestCreated.filter.getPersistenceFilter();
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
