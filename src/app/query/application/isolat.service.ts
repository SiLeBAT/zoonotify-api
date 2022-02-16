import { IsolateView, IsolateCharacteristics } from './../model/isolate.model';
import { DependentQueryFilter } from './../model/shared.model';
import { inject, injectable } from 'inversify';
import {
    IsolateCollection,
    IsolateViewGateway,
    IsolateCount,
    IsolateService,
} from '../model/isolate.model';
import { APPLICATION_TYPES } from '../../application.types';
import { QueryFilter, GroupAttributes } from '../model/shared.model';
import * as _ from 'lodash';

type FilterTuple = [QueryFilter, ApplicationFilter[]];

interface ApplicationFilter {
    key: string;
    value: string | boolean;
}
@injectable()
export class DefaultIsolateService implements IsolateService {
    constructor(
        @inject(APPLICATION_TYPES.IsolateViewGateway)
        private isolateGateway: IsolateViewGateway
    ) {}

    async getIsolates(filter: QueryFilter): Promise<IsolateCollection> {
        const [persistenceFilter, applicationFilter] =
            this.splitIntoPersistenceAndApplicationFilter(filter);

        let rawData = await this.isolateGateway.findAll(persistenceFilter);

        if (applicationFilter.length > 0) {
            rawData = _.filter(rawData, (e) => {
                const hasApplicationFilter =
                    this.hasActiveResistance(e, applicationFilter[0]) ||
                    this.hasDesiredCharacteristic(e, applicationFilter[0]);
                return applicationFilter.reduce((prev, curr) => {
                    return (
                        prev &&
                        (this.hasActiveResistance(e, curr) ||
                            this.hasDesiredCharacteristic(e, curr))
                    );
                }, hasApplicationFilter);
            });
        }
        return rawData;
    }

    private hasActiveResistance(
        isolateView: IsolateView,
        applicationFilter: ApplicationFilter
    ): boolean {
        return (
            Boolean(isolateView.resistance[applicationFilter.key]) &&
            isolateView.resistance[applicationFilter.key].active ===
                applicationFilter.value
        );
    }

    private hasDesiredCharacteristic(
        isolateView: IsolateView,
        applicationFilter: ApplicationFilter
    ): boolean {
        const filterKey = applicationFilter.key as keyof IsolateCharacteristics;
        const result =
            Boolean(isolateView.characteristics[filterKey]) &&
            String(isolateView.characteristics[filterKey]) ===
                String(applicationFilter.value);
        return result;
    }

    getIsolateCount(
        filter: QueryFilter,
        groupAttributes: GroupAttributes
    ): Promise<IsolateCount> {
        return this.isolateGateway.getCount(filter, groupAttributes);
    }

    /*
        Following attributes are filtered at the application level:
            - Resistance
            - characteristics
        */
    private splitIntoPersistenceAndApplicationFilter(
        filter: QueryFilter
    ): FilterTuple {
        const persistenceFilter = { ...filter };
        const applicationFilter: ApplicationFilter[] = [];
        if (this.hasResistanceFilter(persistenceFilter)) {
            persistenceFilter['microorganism'] = (
                persistenceFilter[
                    'microorganism'
                ] as Array<DependentQueryFilter>
            ).map((entry: DependentQueryFilter | string) => {
                if (
                    !!(entry as DependentQueryFilter).dependent &&
                    !!(entry as DependentQueryFilter).dependent['resistance']
                ) {
                    applicationFilter.push({
                        key: (entry as DependentQueryFilter).dependent[
                            'resistance'
                        ] as string,
                        value: true,
                    });
                    entry = (entry as DependentQueryFilter).trigger;
                }

                return entry;
            });
        }
        if (this.hasCharacteristicsFilter(persistenceFilter)) {
            persistenceFilter['microorganism'] = (
                persistenceFilter[
                    'microorganism'
                ] as Array<DependentQueryFilter>
            ).map((entry: DependentQueryFilter | string) => {
                if (
                    !!(entry as DependentQueryFilter).dependent &&
                    !!(entry as DependentQueryFilter).dependent[
                        'characteristic'
                    ]
                ) {
                    applicationFilter.push({
                        key: (entry as DependentQueryFilter).dependent[
                            'characteristic'
                        ] as string,
                        value: (entry as DependentQueryFilter).dependent[
                            'characteristicValue'
                        ] as string,
                    });
                    entry = (entry as DependentQueryFilter).trigger;
                }

                return entry;
            });
        }

        return [persistenceFilter, applicationFilter];
    }
    private hasResistanceFilter(filter: QueryFilter) {
        return (
            filter['microorganism'] &&
            _.isArray(filter['microorganism']) &&
            filter['microorganism'].reduce(
                (prev, curr: DependentQueryFilter) => {
                    return (
                        prev ||
                        (!!curr.dependent && !!curr.dependent['resistance'])
                    );
                },
                false
            )
        );
    }

    private hasCharacteristicsFilter(filter: QueryFilter) {
        return (
            filter['microorganism'] &&
            _.isArray(filter['microorganism']) &&
            filter['microorganism'].reduce(
                (prev, curr: DependentQueryFilter) => {
                    return (
                        prev ||
                        (!!curr.dependent && !!curr.dependent['characteristic'])
                    );
                },
                false
            )
        );
    }
}
