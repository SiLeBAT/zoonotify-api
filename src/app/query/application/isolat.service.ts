import { inject, injectable } from 'inversify';
import {
    IsolateViewGateway,
    IsolateCount,
    IsolateCollection,
} from '../domain/isolate.model';
import { APPLICATION_TYPES } from '../../application.types';
import { DataRequestCreatedEvent } from '../domain/shared.model';

export interface IsolatePort {
    getIsolates(
        datasetOperations: DataRequestCreatedEvent
    ): Promise<IsolateCollection>;
    getIsolateCount(
        datasetOperations: DataRequestCreatedEvent
    ): Promise<IsolateCount>;
}

export type IsolateService = IsolatePort;

@injectable()
export class DefaultIsolateService implements IsolateService {
    constructor(
        @inject(APPLICATION_TYPES.IsolateViewGateway)
        private isolateGateway: IsolateViewGateway
    ) {}

    async getIsolates(
        dataRequestCreated: DataRequestCreatedEvent
    ): Promise<IsolateCollection> {
        return await this.isolateGateway.findAll(dataRequestCreated);
    }

    async getIsolateCount(
        dataRequestCreated: DataRequestCreatedEvent
    ): Promise<IsolateCount> {
        const isolateCollection = await this.isolateGateway.getCount(
            dataRequestCreated
        );
        return isolateCollection.getIsolateCount(dataRequestCreated.grouping);
    }
}
