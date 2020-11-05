import { SQLiteProbenahmegrundRepository } from './repositories/probenahmegrund.repository';
import { ContainerModule, interfaces } from 'inversify';
import { SQLiteIsolatRepository } from './repositories/isolat.repository';
import { SQLiteErregerRepository } from './repositories/erreger.repository';
import {
    IsolatRepository,
    ErregerRepository,
    ProbenahmegrundRepository,
    APPLICATION_TYPES
} from '../../app/ports';
import { PERSISTENCE_TYPES } from './persistence.types';
import { Database } from 'sqlite';

export function getPersistenceContainerModule(db: Database): ContainerModule {
    return new ContainerModule(
        (bind: interfaces.Bind, unbind: interfaces.Unbind) => {
            bind<IsolatRepository>(APPLICATION_TYPES.IsolatRepository).to(
                SQLiteIsolatRepository
            );

            bind<ProbenahmegrundRepository>(
                APPLICATION_TYPES.ProbenahmegrundRepository
            ).to(SQLiteProbenahmegrundRepository);

            bind<ErregerRepository>(APPLICATION_TYPES.ErregerRepository).to(
                SQLiteErregerRepository
            );

            bind<Database>(PERSISTENCE_TYPES.Sqlite).toConstantValue(db);

            bind<string>(PERSISTENCE_TYPES.ErregerRelation).toConstantValue(
                'erreger'
            );

            bind<string>(PERSISTENCE_TYPES.IsolatRelation).toConstantValue(
                'isolat'
            );

            bind<string>(
                PERSISTENCE_TYPES.ProbenahmegrundRelation
            ).toConstantValue('probenahmegrund');
        }
    );
}
