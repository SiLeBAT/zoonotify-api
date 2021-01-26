import {
    IsolateCollection,
    IsolateGateway,
    IsolateCount,
    IsolateService
} from './../model/isolate.model';
import { APPLICATION_TYPES } from './../../application.types';
import { inject, injectable } from 'inversify';
import * as _ from 'lodash';

@injectable()
export class DefaultIsolateService implements IsolateService {
    constructor(
        @inject(APPLICATION_TYPES.IsolateGateway)
        private isolateGateway: IsolateGateway
    ) {}

    getIsolates(): Promise<IsolateCollection> {
        return this.isolateGateway.findAll();
    }

    getIsolateCount(): Promise<IsolateCount> {
        return this.isolateGateway.getCount();
    }
}
