import { SQLiteProbenahmegrundRepository } from './repositories/probenahmegrund.repository';
import { ContainerModule, interfaces } from 'inversify';
import { SQLiteIsolatRepository } from './repositories/isolat.repository';
import { SQLiteErregerRepository } from './repositories/erreger.repository';
import {
    IsolatRepository,
    ErregerRepository,
    ProbenahmegrundRepository
} from '../../app/ports';
import { PERSISTENCE_TYPES } from './persistence.types';
import { Database } from 'sqlite';

export function getPersistenceContainerModule(db: Database): ContainerModule {
    return new ContainerModule(
        (bind: interfaces.Bind, unbind: interfaces.Unbind) => {
            bind<IsolatRepository>(PERSISTENCE_TYPES.IsolatRepository).to(
                SQLiteIsolatRepository
            );

            bind<ProbenahmegrundRepository>(
                PERSISTENCE_TYPES.ProbenahmegrundRepository
            ).to(SQLiteProbenahmegrundRepository);

            bind<ErregerRepository>(PERSISTENCE_TYPES.ErregerRepository).to(
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
