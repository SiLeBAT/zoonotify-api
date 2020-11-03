import { PERSISTENCE_TYPES } from './../persistence.types';
import { inject, injectable } from 'inversify';
import { SQLiteRepositoryBase } from '../datastore/sqlite/sqlite.repository';
import { Database } from 'sqlite';
import { logger } from '../../../aspects';
import { ProbenahmegrundRepository, Probenahmegrund } from '../../../app/ports';

@injectable()
export class SQLiteProbenahmegrundRepository extends SQLiteRepositoryBase
    implements ProbenahmegrundRepository {
    constructor(
        @inject(PERSISTENCE_TYPES.Sqlite) db: Database,
        @inject(PERSISTENCE_TYPES.ProbenahmegrundRelation) relation: string
    ) {
        super(db, relation);
    }

    retrieve(): Promise<Probenahmegrund[]> {
        return this._retrieve<Probenahmegrund>()
            .then(result => (result ? result : []))
            .catch(err => {
                logger.error(
                    `Could not retrieve probenahmegrund entries: ${err}`
                );
                return [];
            });
    }
}
