import { Sequelize } from 'sequelize';
import { logger } from '../../../../aspects';
import { SequelizeDatabase } from '../datastore/database.entity';
import {
    DatabaseService,
    Database,
    ConnectionInfo,
} from '../datastore/database.model';
import { SequelizeDAOProvider } from './dao-provider.service';

export class SequelizeDatabaseService implements DatabaseService<Sequelize> {
    private dataStore: Database<Sequelize>;

    createDataStore(connectionInfo: ConnectionInfo): Database<Sequelize> {
        logger.info('Creating datastore');
        let sequelize;
        switch (connectionInfo.dialect) {
            case 'postgres':
                sequelize = new Sequelize(
                    connectionInfo.dataBase,
                    connectionInfo.username,
                    connectionInfo.password,
                    {
                        host: connectionInfo.host,
                        dialect: 'postgres',
                        port: connectionInfo.port,
                    }
                );
                break;
            default:
                throw new Error(
                    'Database dialect not supported.  Must be one of: postgres'
                );
        }
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
