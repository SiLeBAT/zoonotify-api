import { SequelizeDatabase } from './database.entity';
import { Sequelize } from 'sequelize';
import { logger } from '../../../../aspects';
import { SequelizeDAOProvider } from '../../dao/dao-provider.service';
import {
    ConnectionInfo,
    Database,
    DatabaseService,
    SupportedDB
} from './databse.model';

export class SequelizeDatabaseService implements DatabaseService<Sequelize> {
    private dataStore: Database<Sequelize>;

    createDataStore(connectionInfo: ConnectionInfo): Database<Sequelize> {
        logger.info('Creating datastore');
        const [dialect, storage]: [
            SupportedDB,
            string
        ] = connectionInfo.connectionString.split(':') as [SupportedDB, string];
        const sequelize = new Sequelize({
            storage,
            dialect
        });

        this.dataStore = new SequelizeDatabase(sequelize);
        return this.dataStore;
    }

    getDAOProvider() {
        if (!this.dataStore) {
            throw new Error('Datastore not yet created');
        }
        return new SequelizeDAOProvider(this.dataStore);
    }
}
