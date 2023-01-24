import { APPLICATION_TYPES } from '../../../app/application.types';
import { ContainerModule, interfaces } from 'inversify';
import {
    IsolateViewGateway,
    ResistanceViewGateway,
} from './../../../app/ports';
import { getMockIsolateViewGateway } from './isolate-view-mock.gateway';
import { getMockResistanceViewGateway } from './resistance-view-mock.gateway';

export const mockPersistenceContainerModule = new ContainerModule(
    (bind: interfaces.Bind, unbind: interfaces.Unbind) => {
        bind<IsolateViewGateway>(
            APPLICATION_TYPES.IsolateViewGateway
        ).toConstantValue(getMockIsolateViewGateway());
        bind<ResistanceViewGateway>(
            APPLICATION_TYPES.ResistanceViewGateway
        ).toConstantValue(getMockResistanceViewGateway());
    }
);
