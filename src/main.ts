import 'reflect-metadata';
import * as config from 'config';
import * as path from 'path';
import {
    createServer,
    ServerConfiguration as ExpressServerConfiguration,
} from '@SiLeBAT/fg43-ne-server';
import { logger, getContainer } from './aspects';
import { getServerContainerModule, ROUTE } from './ui/ports';
import { getApplicationContainerModule } from './app/ports';
import {
    SystemConfigurationService,
    GeneralConfiguration,
    ServerConfiguration,
    AppConfiguration,
    APIConfiguration,
} from './main.model';

export class DefaultConfigurationService implements SystemConfigurationService {
    private generalConfigurationDefaults: GeneralConfiguration = {
        logLevel: 'info',
        supportContact: '',
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

    getGeneralConfiguration(): GeneralConfiguration {
        let generalConfiguration: GeneralConfiguration = config.get('general');

        if (!config.has('general')) {
            generalConfiguration = {
                logLevel: this.generalConfigurationDefaults.logLevel,
                supportContact:
                    this.generalConfigurationDefaults.supportContact,
            };
        }

        if (!config.has('general.logLevel')) {
            generalConfiguration.logLevel =
                this.generalConfigurationDefaults.logLevel;
        }

        return generalConfiguration;
    }
}

async function init() {
    const configurationService = new DefaultConfigurationService();
    const serverConfig: ServerConfiguration =
        configurationService.getServerConfiguration();
    const generalConfig: GeneralConfiguration =
        configurationService.getGeneralConfiguration();
    const appConfiguration: AppConfiguration =
        configurationService.getApplicationConfiguration();
    const apiConfiguration: APIConfiguration =
        configurationService.getAPIConfiguration();

    logger.info(`Starting ${appConfiguration.appName}.`);
    logger.info(`Log level: ${generalConfig.logLevel}.`);

    const container = getContainer({ defaultScope: 'Singleton' });
    container.load(
        getApplicationContainerModule({
            ...appConfiguration,
            supportContact: generalConfig.supportContact,
        }),
        getServerContainerModule({
            ...serverConfig,
            publicAPIDoc: apiConfiguration.publicAPIDoc,
            logLevel: generalConfig.logLevel,
            supportContact: generalConfig.supportContact,
        })
    );

    const expressServerConfiguration: ExpressServerConfiguration = {
        container,
        api: {
            port: serverConfig.port,
            root: '',
            version: ROUTE.VERSION,
            docPath: '/api-docs',
        },
        logging: {
            logger,
            logLevel: generalConfig.logLevel,
        },
        publicDir: path.join(__dirname + '/ui/public'),
    };

    const server = createServer(expressServerConfiguration);
    server.startServer();

    process.on('uncaughtException', (error) => {
        logger.error(`Uncaught Exception. error=${error}`);
        process.exit(1);
    });
}

init().catch((error) => {
    logger.error(`Unable to initialise application. error=${error}`);
    throw error;
});
