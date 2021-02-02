import {
    IsolateCollection,
    IsolateGateway,
    IsolateCount,
    IsolateService
} from './../model/isolate.model';
import { APPLICATION_TYPES } from './../../application.types';
import { inject, injectable } from 'inversify';
import * as _ from 'lodash';
import { Filter } from '../model/shared.model';

@injectable()
export class DefaultIsolateService implements IsolateService {
    constructor(
        @inject(APPLICATION_TYPES.IsolateGateway)
        private isolateGateway: IsolateGateway
    ) {}

    getIsolates(filter?: Filter): Promise<IsolateCollection> {
        return this.isolateGateway.findAll(filter);
    }

    getIsolateCount(filter?: Filter): Promise<IsolateCount> {
        return this.isolateGateway.getCount(filter);
    }
}
