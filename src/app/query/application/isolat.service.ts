import { Isolate } from './../model/isolate.model';
import { APPLICATION_TYPES } from './../../application.types';
// npm
import { inject, injectable } from 'inversify';
import * as _ from 'lodash';
import { IsolateService } from '../model/isolate.model';
import { EntityGateway } from '../model/shared.model';

@injectable()
export class DefaultIsolateService implements IsolateService {
    constructor(
        @inject(APPLICATION_TYPES.IsolateGateway)
        private isolateGateway: EntityGateway<Isolate>
    ) {}

    async getIsolates() {
        return this.isolateGateway.findAll();
    }
}
