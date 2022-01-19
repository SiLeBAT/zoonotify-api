import { DependentQueryFilter, QueryValue } from './../model/shared.model';
import { inject, injectable } from 'inversify';
import {
    IsolateCollection,
    IsolateViewGateway,
    IsolateCount,
    IsolateService,
    ResistanceCollection,
} from '../model/isolate.model';
import { APPLICATION_TYPES } from '../../application.types';
import { QueryFilter, GroupAttributes } from '../model/shared.model';
import _ = require('lodash');

@injectable()
export class DefaultIsolateService implements IsolateService {
    constructor(
        @inject(APPLICATION_TYPES.IsolateViewGateway)
        private isolateGateway: IsolateViewGateway
    ) {}

    getResistances(): Promise<ResistanceCollection> {
        return this.isolateGateway
            .getUniqueAttributeValues('resistance')
            .then(
                (resistanceData) =>
                    new Set(resistanceData) as ResistanceCollection
            );
    }

    getIsolates(filter: QueryFilter): Promise<IsolateCollection> {
        const newFilter = { ...filter };
        const postFilter: QueryValue[] = [];
        if (this.hasResistanceFilter(newFilter)) {
            // Resistance filtering is applyed on the Application level not the SQL level
            newFilter['microorganism'] = (
                newFilter['microorganism'] as Array<DependentQueryFilter>
            ).map((entry: DependentQueryFilter | string) => {
                if (
                    !!(entry as DependentQueryFilter).dependent &&
                    !!(entry as DependentQueryFilter).dependent['resistance']
                ) {
                    postFilter.push(
                        (entry as DependentQueryFilter).dependent['resistance']
                    );
                    entry = (entry as DependentQueryFilter).trigger;
                }

                return entry;
            });
        }
        return this.isolateGateway.findAll(newFilter).then((data) => {
            // tslint:disable-next-line
            return _.filter(data, (e) => {
                const resistancesToCheck = postFilter as string[];
                return resistancesToCheck.reduce((prev, curr) => {
                    return (
                        prev &&
                        e.resistance[curr] &&
                        e.resistance[curr].active === true
                    );
                }, e.resistance[resistancesToCheck[0]] && e.resistance[resistancesToCheck[0]].active === true);
            });
        });
    }

    getIsolateCount(
        filter: QueryFilter,
        groupAttributes: GroupAttributes
    ): Promise<IsolateCount> {
        return this.isolateGateway.getCount(filter, groupAttributes);
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
