import { Response } from 'express';
import { controller, httpGet, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import { SystemInfoController } from '../model/controller.model';
import { SystemInformationDTO } from '../model/response.model';
import { AbstractController } from './abstract.controller';
import { ROUTE } from '../model/enums';
import { AppServerConfiguration } from '../model/server.model';
import { UnknownPackageConfigurationError } from '../model/domain.error';
import SERVER_TYPES from '../server.types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pjson = require('../../../package.json');

enum INFO_ROUTE {
    ROOT = '/info',
}
@controller(ROUTE.VERSION + INFO_ROUTE.ROOT)
export class DefaultSystemInfoController
    extends AbstractController
    implements SystemInfoController
{
    private supportContact = '';

    constructor(
        @inject(SERVER_TYPES.AppServerConfiguration)
        configuration: AppServerConfiguration
    ) {
        super();
        this.supportContact = configuration.supportContact;
    }

    @httpGet('/')
    async getSystemInfo(@response() res: Response) {
        try {
            if (!(pjson.version && pjson.znConfig.lastChange)) {
                throw new UnknownPackageConfigurationError(
                    "Version number or date of last change can't be determined."
                );
            }
            const dto: SystemInformationDTO = {
                version: pjson.version,
                lastChange: pjson.znConfig.lastChange,
                supportContact: this.supportContact,
            };
            this.ok(res, dto);
        } catch (error) {
            this.handleError(res);
        }
    }

    private handleError(res: Response) {
        this.fail(res, 'Unable to retrieve system information');
    }
}
