import * as config from 'config';
import { logger, getContainer } from './aspects';
import { createServer, getServerContainerModule } from './ui/server/ports';
import { getApplicationContainerModule } from './app/ports';
import {
    SystemConfigurationService,
    GeneralConfiguration,
    ServerConfiguration,
    AppConfiguration,
    DataStoreConfiguration,
    APIConfiguration
} from './main.model';
import {
    getPersistenceContainerModule,
    SequelizeDatabaseService
} from './infrastructure/ports';

export class DefaultConfigurationService implements SystemConfigurationService {
    private generalConfigurationDefaults: GeneralConfiguration = {
        logLevel: 'info',
        supportContact: ''
    };

    getServerConfiguration(): ServerConfiguration {
        return config.get('server');
    }

    getAPIConfiguration(): APIConfiguration {
        return config.get('api');
    }

    getApplicationConfiguration(): AppConfiguration {
        const appConfiguration: AppConfiguration = config.get('application');

        return appConfiguration;
    }

    getDataStoreConfiguration(): DataStoreConfiguration {
        return config.get('dataStore');
    }

    getGeneralConfiguration(): GeneralConfiguration {
        let generalConfiguration: GeneralConfiguration = config.get('general');

        if (!config.has('general')) {
            generalConfiguration = {
                logLevel: this.generalConfigurationDefaults.logLevel,
                supportContact: this.generalConfigurationDefaults.supportContact
            };
        }

        if (!config.has('general.logLevel')) {
            generalConfiguration.logLevel = this.generalConfigurationDefaults.logLevel;
        }

        return generalConfiguration;
    }
}

async function init() {
    const configurationService = new DefaultConfigurationService();
    const serverConfig: ServerConfiguration = configurationService.getServerConfiguration();
    const generalConfig: GeneralConfiguration = configurationService.getGeneralConfiguration();
    const dataStoreConfig: DataStoreConfiguration = configurationService.getDataStoreConfiguration();
    const appConfiguration: AppConfiguration = configurationService.getApplicationConfiguration();
    const apiConfiguration: APIConfiguration = configurationService.getAPIConfiguration();

    logger.info(`Starting ${appConfiguration.appName}.`);
    logger.info(`Log level: ${generalConfig.logLevel}.`);

    const dbService = new SequelizeDatabaseService();
    const dataStore = dbService.createDataStore({
        connectionString: dataStoreConfig.connectionString
    });

    if (!(await dataStore.isConnectionEstablished())) {
        throw new Error('Unable to connect to Database.');
    }

    const daoProvider = dbService.getDAOProvider();
    const daos = daoProvider.getDAOHash();
    const container = getContainer({ defaultScope: 'Singleton' });
    container.load(
        getApplicationContainerModule({
            ...appConfiguration,
            supportContact: generalConfig.supportContact
        }),
        getServerContainerModule({
            ...serverConfig,
            publicAPIDoc: apiConfiguration.publicAPIDoc,
            logLevel: generalConfig.logLevel,
            supportContact: generalConfig.supportContact
        }),
        getPersistenceContainerModule(daos)
    );

    const server = createServer(container);
    server.startServer();

    process.on('uncaughtException', error => {
        logger.error(`Uncaught Exception. error=${error}`);
        process.exit(1);
    });
}

init().catch(error => {
    logger.error(`Unable to initialise application. error=${error}`);
    throw error;
});
