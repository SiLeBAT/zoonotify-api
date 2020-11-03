// core
// npm
import * as sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
// local
import { logger } from './../../../../aspects';

export interface ConnectionInfo {
    connectionString: string;
}

class SQLiteDataStore {
    private db: Database;
    constructor(private connectionInfo: ConnectionInfo) {}

    async init() {
        return open({
            filename: this.connectionInfo.connectionString,
            mode: sqlite3.OPEN_READONLY,
            driver: sqlite3.Database
        }).then(
            db => {
                logger.info(
                    'Connected to DB',
                    this.connectionInfo.connectionString
                );
                return (this.db = db);
            },
            error => {
                throw new Error(
                    `Unable to connect to DB. ${this.connectionInfo.connectionString} error=${error}`
                );
            }
        );
    }
    close() {
        this.db.close().then(
            () => logger.info('Connection to DB closed.'),
            error => {
                throw new Error(`Unable to close DB. error=${error}`);
            }
        );
    }
}

export function createDataStore(
    connectionInfo: ConnectionInfo
): SQLiteDataStore {
    logger.info('Creating datastore');
    return new SQLiteDataStore(connectionInfo);
}
