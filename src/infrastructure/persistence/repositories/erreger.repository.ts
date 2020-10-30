import { PERSISTENCE_TYPES } from './../persistence.types';
import { inject, injectable } from 'inversify';
import { SQLiteRepositoryBase } from '../datastore/sqlite/sqlite.repository';
import { Database } from 'sqlite';
import { ErregerRepository, Erreger } from '../../../app/ports';
import { logger } from '../../../aspects';

@injectable()
export class SQLiteErregerRepository extends SQLiteRepositoryBase
    implements ErregerRepository {
    constructor(
        @inject(PERSISTENCE_TYPES.Sqlite) db: Database,
        @inject(PERSISTENCE_TYPES.ErregerRelation) relation: string
    ) {
        super(db, relation);
    }

    retrieve(): Promise<Erreger[]> {
        return this._retrieve<Erreger>()
            .then(result => (result ? result : []))
            .catch(err => {
                logger.error(`Could not retrieve erreger entries: ${err}`);
                return [];
            });
    }
}
