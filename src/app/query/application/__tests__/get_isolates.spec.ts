import { getContainer } from '../../../../aspects/container/container';
import { Container } from 'inversify';
import { mockPersistenceContainerModule } from '../../../../infrastructure/persistence/__mocks__/persistence-mock.module';
import { APPLICATION_TYPES } from '../../../application.types';
import { getApplicationContainerModule } from '../../../ports';
import { IsolateService } from '../isolat.service';
import { IsolateQueryFilter } from '../../domain/filter.model';

describe('Get Isolates Use Case', () => {
    let service: IsolateService;
    let container: Container | null;
    let filter: IsolateQueryFilter;
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
        filter = new IsolateQueryFilter(false, [], []);
    });
    afterEach(() => {
        container = null;
    });
    it('should return a promise', () => {
        const result = service.getIsolateListByIsolateQueryFilter(filter);
        expect(result).toBeInstanceOf(Promise);
    });
    it('should return the complete data set', async () => {
        const result = await service.getIsolateListByIsolateQueryFilter(filter);
        //expect(result.isolates.length).toEqual(6);
    });
});
