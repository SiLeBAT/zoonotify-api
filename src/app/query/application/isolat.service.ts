import { inject, injectable } from 'inversify';
import * as _ from 'lodash';
import {
    IsolateCollection,
    IsolateViewGateway,
    IsolateCount,
    IsolateService,
} from '../model/isolate.model';
import { APPLICATION_TYPES } from '../../application.types';
import { QueryFilter, GroupAttributes } from '../model/shared.model';

@injectable()
export class DefaultIsolateService implements IsolateService {
    constructor(
        @inject(APPLICATION_TYPES.IsolateViewGateway)
        private isolateGateway: IsolateViewGateway
    ) {}

    getIsolates(filter: QueryFilter): Promise<IsolateCollection> {
        return this.isolateGateway.findAll(filter);
    }

    getIsolateCount(
        filter: QueryFilter,
        groupAttributes: GroupAttributes
    ): Promise<IsolateCount> {
        return this.isolateGateway.getCount(filter, groupAttributes);
    }
}
