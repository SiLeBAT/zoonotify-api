import { inject, injectable } from 'inversify';
import { SQLiteRepositoryBase } from '../datastore/sqlite/sqlite.repository';
import { IsolatRepository, Isolat } from 'src/app/query/model/isolat.model';
import { Database } from 'sqlite';
import { PERSISTENCE_TYPES } from '../persistence.types';
import { logger } from '../../../aspects/logging';

@injectable()
export class SQLiteIsolatRepository extends SQLiteRepositoryBase
    implements IsolatRepository {
    constructor(
        @inject(PERSISTENCE_TYPES.Sqlite) db: Database,
        @inject(PERSISTENCE_TYPES.IsolatRelation) relation: string
    ) {
        super(db, relation);
    }
    retrieve(): Promise<Isolat[]> {
        return this._retrieve<Isolat>()
            .then(result => (result ? result : []))
            .catch(err => {
                logger.error(`Could not retrieve isolat entries: ${err}`);
                return [];
            });
    }
}
