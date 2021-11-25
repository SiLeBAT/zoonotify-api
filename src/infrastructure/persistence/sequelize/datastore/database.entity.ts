import { Sequelize } from 'sequelize';
import { logger } from '../../../../aspects';
import { Database } from './database.model';

export class SequelizeDatabase implements Database<Sequelize> {
    constructor(private dataStore: Sequelize) {}

    async isConnectionEstablished(): Promise<boolean> {
        try {
            await this.dataStore.authenticate();
            logger.info('Connection has been established successfully.');
            return true;
        } catch (error) {
            logger.error('Unable to connect to the database:', error);
            return false;
        }
    }

    getDatastore() {
        return this.dataStore;
    }
}
