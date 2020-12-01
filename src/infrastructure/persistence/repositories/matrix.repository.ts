import { Matrix } from './../../../app/query/model/matrix.model';
import { PERSISTENCE_TYPES } from './../persistence.types';
import { inject, injectable } from 'inversify';
import { SQLiteRepositoryBase } from '../datastore/sqlite/sqlite.repository';
import { Database } from 'sqlite';
import { MatrixRepository } from '../../../app/ports';
import { logger } from '../../../aspects';

@injectable()
export class SQLiteMatrixRepository extends SQLiteRepositoryBase
    implements MatrixRepository {
    constructor(
        @inject(PERSISTENCE_TYPES.Sqlite) db: Database,
        @inject(PERSISTENCE_TYPES.MatrixRelation) relation: string
    ) {
        super(db, relation);
    }

    retrieve(): Promise<Matrix[]> {
        return this._retrieve<Matrix>()
            .then(result => (result ? result : []))
            .catch(err => {
                logger.error(`Could not retrieve erreger entries: ${err}`);
                return [];
            });
    }
}
