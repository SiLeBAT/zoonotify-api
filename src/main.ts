import * as config from 'config';
import { logger, getContainer } from './aspects';
import { createServer, getServerContainerModule } from './ui/server/ports';

import {
    createApplication,
    ZoonotifyApplication,
    getApplicationContainerModule
} from './app/ports';
import {
    SystemConfigurationService,
    GeneralConfiguration,
    ServerConfiguration,
    AppConfiguration
} from './main.model';

export class DefaultConfigurationService implements SystemConfigurationService {

    private generalConfigurationDefaults: GeneralConfiguration = {
        logLevel: 'info',
        supportContact: ''
    };

    getServerConfiguration(): ServerConfiguration {
        return config.get('server');
    }

    getApplicationConfiguration(): AppConfiguration {
        const appConfiguration: AppConfiguration = config.get('application');

        return appConfiguration;
    }

    getGeneralConfiguration(): GeneralConfiguration {
        let generalConfiguration: GeneralConfiguration = config.get('general');

        if (!config.has('general')) {
            generalConfiguration = {
                logLevel: this.generalConfigurationDefaults.logLevel,
                supportContact: this.generalConfigurationDefaults
                    .supportContact
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
    const appConfiguration: AppConfiguration = configurationService.getApplicationConfiguration();

    logger.info(`Starting Zoonotify. appName=${appConfiguration.appName}`);

    const container = getContainer({ defaultScope: 'Singleton' });

    container.load(
        getApplicationContainerModule({
            ...appConfiguration,
            supportContact: generalConfig.supportContact
        }),

        getServerContainerModule({
            ...serverConfig,
            logLevel: generalConfig.logLevel,
            supportContact: generalConfig.supportContact
        })
    );

    const application: ZoonotifyApplication = createApplication(container);


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
