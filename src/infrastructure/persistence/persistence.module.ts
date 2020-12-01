import { SQLiteProbenahmegrundRepository } from './repositories/probenahmegrund.repository';
import { ContainerModule, interfaces } from 'inversify';
import { SQLiteIsolatRepository } from './repositories/isolat.repository';
import { SQLiteErregerRepository } from './repositories/erreger.repository';
import {
    IsolatRepository,
    ErregerRepository,
    ProbenahmegrundRepository,
    APPLICATION_TYPES,
    MatrixRepository
} from '../../app/ports';
import { PERSISTENCE_TYPES } from './persistence.types';
import { Database } from 'sqlite';
import { SQLiteMatrixRepository } from './repositories/matrix.repository';

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

            bind<MatrixRepository>(APPLICATION_TYPES.MatrixRepository).to(
                SQLiteMatrixRepository
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

            bind<string>(PERSISTENCE_TYPES.MatrixRelation).toConstantValue(
                'matrix'
            );
        }
    );
}
