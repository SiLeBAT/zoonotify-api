import { QueryFilter } from './../../domain/shared.model';
import { getContainer } from '../../../../aspects/container/container';
import { Container } from 'inversify';
import { mockPersistenceContainerModule } from '../../../../infrastructure/persistence/__mocks__/persistence-mock.module';
import { APPLICATION_TYPES } from '../../../application.types';
import { getApplicationContainerModule } from '../../../ports';
import { IsolateService } from '../isolat.service';
import { createQueryFilter } from '../../domain/query-filter.entity';

describe('Get Isolates Use Case', () => {
    let service: IsolateService;
    let container: Container | null;
    let filter: QueryFilter;
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
        filter = createQueryFilter();
    });
    afterEach(() => {
        container = null;
    });
    it('should return a promise', () => {
        const result = service.getIsolates({
            grouping: [],
            filter: filter,
        });
        expect(result).toBeInstanceOf(Promise);
    });
    it('should return the complete data set', async () => {
        const result = await service.getIsolates({
            grouping: [],
            filter: filter,
        });
        expect(result.isolates.length).toEqual(6);
    });
});
