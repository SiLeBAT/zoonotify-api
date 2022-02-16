import { IsolateService } from './../../model/isolate.model';
import { getContainer } from '../../../../aspects/container/container';
import { Container } from 'inversify';
import { mockPersistenceContainerModule } from '../../../../infrastructure/persistence/__mocks__/persistence-mock.module';
import { APPLICATION_TYPES } from '../../../application.types';
import { getApplicationContainerModule } from '../../../ports';

describe('Get Isolates Use Case', () => {
    let service: IsolateService;
    let container: Container | null;
    beforeEach(() => {
        container = getContainer();
        container.load(
            getApplicationContainerModule({
                appName: 'TestZN',
                apiUrl: '/',
                supportContact: 'none',
            }),
            mockPersistenceContainerModule
        );
        service = container.get<IsolateService>(
            APPLICATION_TYPES.IsolateService
        );
    });
    afterEach(() => {
        container = null;
    });
    it('should return a promise', () => {
        const result = service.getIsolates({});
        expect(result).toBeInstanceOf(Promise);
    });
    it('should return the complete data set', async () => {
        const result = await service.getIsolates({});
        expect(result.length).toEqual(5);
    });
    it('should return one GEN positive', async () => {
        const result = await service.getIsolates({
            microorganism: [
                {
                    trigger: 'STEC',
                    dependent: {
                        resistance: 'GEN',
                        resistance_active: 'true',
                    },
                },
            ],
        });
        expect(result.length).toEqual(1);
        const entry = result[0];
        expect(entry.resistance['GEN'].active).toBeTruthy;
        expect(entry.resistance['KAN'].active).toBeFalsy;
    });
    it('should return one O_Gruppe 166 entry', async () => {
        const result = await service.getIsolates({
            microorganism: [
                {
                    trigger: 'STEC',
                    dependent: {
                        characteristic: 'o_group',
                        characteristicValue: '184',
                    },
                },
            ],
        });

        expect(result.length).toEqual(1);
        const entry = result[0];
        expect(entry.characteristics['o_group']).toEqual('184');
        expect(entry.characteristics['h_group']).toEqual('2');
    });
});
