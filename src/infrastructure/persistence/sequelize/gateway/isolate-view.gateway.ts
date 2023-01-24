import { inject, injectable } from 'inversify';
import * as _ from 'lodash';
import {
    IsolateViewAttributes,
    IsolateViewModel,
} from '../dao/isolate-view.model';
import { FilterConverter } from '../service/filter-converter.service';
import { createWherePart, ModelStatic } from '../dao/shared.model';
import { PERSISTENCE_TYPES } from '../persistence.types';
import {
    QueryFilter,
    Isolate,
    FederalState,
    GeneSet,
    IsolateViewGateway,
    IsolateCharacteristicSet,
    IsolateResistanceSet,
    DataRequestCreatedEvent,
} from '../../../../app/ports';
import { logger } from '../../../../aspects';
import { ERROR_MESSAGE } from '../../../server.fault';

@injectable()
export class SequelizeIsolateViewGateway implements IsolateViewGateway {
    constructor(
        @inject(PERSISTENCE_TYPES.IsolateViewModel)
        private IsolateView: ModelStatic<IsolateViewModel>,
        @inject(PERSISTENCE_TYPES.FilterConverterService)
        private filterConverter: FilterConverter
    ) {}

    async findAll(
        dataRequestCreated: DataRequestCreatedEvent,
        options = {}
    ): Promise<Isolate[]> {
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
            .then((vIsolateList) => this.convertToIsolateList(vIsolateList))
            .catch((error) => {
                logger.error(error);
                throw error;
            });
    }

    // Obsolete? Application Filters?
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
        return this.IsolateView.findAll(options)
            .then((data) => {
                return data
                    .map((d) => {
                        return d[property];
                    })
                    .filter((d) => !_.isNil(d))
                    .sort();
            })
            .catch((error) => {
                throw this.handleException(error);
            });
    }

    find(filter: string[], options = {}): Promise<Isolate[]> {
        logger.trace(`${this.constructor.name}.${this.find.name}, Executing`);

        const whereClause = createWherePart(filter);
        options = { ...options, ...whereClause };

        return this.IsolateView.findAll(options)
            .then((vIsolateList) => this.convertToIsolateList(vIsolateList))
            .catch((error) => {
                throw this.handleException(error);
            });
    }

    private convertToIsolateList(
        modelCollection: IsolateViewModel[],
        filter?: QueryFilter
    ): Isolate[] {
        const isolateArray: any[] = [];
        for (let i = 0; i < modelCollection.length; i++) {
            const isolateViewModel = modelCollection[i];
            const genesSet: GeneSet | undefined =
                this.createGeneSet(isolateViewModel);
            const characteristics: IsolateCharacteristicSet | undefined =
                this.createCharacteristicsSet(isolateViewModel, genesSet);
            const _resistances: IsolateResistanceSet = {};
            const _isolate = new Isolate(
                isolateViewModel.bfrId,
                isolateViewModel.isolateId as number,
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
                characteristics,
                _resistances
            );
            if (null != _isolate) {
                isolateArray.push(_isolate);
            }
        }
        return isolateArray;
    }

    private createCharacteristicsSet(
        isolateViewModel: IsolateViewModel,
        genesSet: GeneSet | undefined
    ) {
        let result;
        if (isolateViewModel.microorganism !== 'E. coli') {
            result = new IsolateCharacteristicSet(
                isolateViewModel.spez,
                isolateViewModel.serovar,
                isolateViewModel.serotype,
                isolateViewModel.spaType,
                isolateViewModel.oGroup,
                isolateViewModel.hGroup,
                isolateViewModel.ampcCarbaPhenotype,
                isolateViewModel.clonalGroup,
                genesSet
            );
        }
        return result;
    }

    private createGeneSet(
        isolateViewModel: IsolateViewModel
    ): GeneSet | undefined {
        const stx1: boolean | null = toNullableBoolean(isolateViewModel.stx1);
        const stx2: boolean | null = toNullableBoolean(isolateViewModel.stx2);
        const eae: boolean | null = toNullableBoolean(isolateViewModel.eae);
        const e_hly: boolean | null = toNullableBoolean(isolateViewModel.e_hly);
        const hasAnyValue: boolean =
            null !== stx1 || null !== stx2 || null !== eae || null !== e_hly;
        return hasAnyValue ? new GeneSet(stx1, stx2, eae, e_hly) : undefined;
    }

    private handleException(error: any) {
        logger.error(error);
        if (error.name && error.name === 'SequelizeConnectionRefusedError') {
            const connectionRefusedException = new Error();
            connectionRefusedException.name =
                ERROR_MESSAGE.PERSISTENCE__ISOLATEVIEWGATEWAY__DATABASE_CONNECTION_REFUSED;
            throw connectionRefusedException;
        } else {
            throw error;
        }
    }
}

function toNullableBoolean(booleanValue?: string) {
    return '+' === booleanValue ? true : '-' === booleanValue ? false : null;
}
