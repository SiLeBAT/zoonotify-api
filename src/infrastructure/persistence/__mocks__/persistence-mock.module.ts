import { IsolateViewGateway } from './../../../app/ports';
import { ContainerModule, interfaces } from 'inversify';
import { APPLICATION_TYPES } from '../../../app/application.types';
import { getMockIsolateViewGateway } from './isolateView.gateway';

export const mockPersistenceContainerModule = new ContainerModule(
    (bind: interfaces.Bind, unbind: interfaces.Unbind) => {
        bind<IsolateViewGateway>(
            APPLICATION_TYPES.IsolateViewGateway
        ).toConstantValue(getMockIsolateViewGateway());
    }
);
