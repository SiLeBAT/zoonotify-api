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
import _ = require('lodash');

type FilterTuple = [QueryFilter, string[]];
@injectable()
export class DefaultIsolateService implements IsolateService {
    constructor(
        @inject(APPLICATION_TYPES.IsolateViewGateway)
        private isolateGateway: IsolateViewGateway
    ) {}

    async getIsolates(filter: QueryFilter): Promise<IsolateCollection> {
        /*
        Following attributes are filtered at the application level:
            - Resistance
            - characteristics
        */
        const [persistenceFilter, applicationFilter] =
            this.splitIntoPersistenceAndApplicationFilter(filter);

        let rawData = await this.isolateGateway.findAll(persistenceFilter);

        if (applicationFilter.length > 0) {
            rawData = _.filter(rawData, (e) => {
                return applicationFilter.reduce((prev, curr) => {
                    return (
                        prev &&
                        e.resistance[curr] &&
                        e.resistance[curr].active === true
                    );
                }, e.resistance[applicationFilter[0]] && e.resistance[applicationFilter[0]].active === true);
                return false;
            });
        }
        return rawData;
    }

    getIsolateCount(
        filter: QueryFilter,
        groupAttributes: GroupAttributes
    ): Promise<IsolateCount> {
        return this.isolateGateway.getCount(filter, groupAttributes);
    }

    private splitIntoPersistenceAndApplicationFilter(
        filter: QueryFilter
    ): FilterTuple {
        const persistenceFilter = { ...filter };
        const applicationFilter: string[] = [];
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
                    applicationFilter.push(
                        (entry as DependentQueryFilter).dependent[
                            'resistance'
                        ] as string
                    );
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
}
