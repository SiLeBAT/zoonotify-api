import { Response } from 'express';
import { DatabaseStatusController } from '../model/controller.model';
import { DatabaseStatusDTO } from '../model/response.model';
import { AbstractController } from './abstract.controller';
import { controller, httpGet, response } from 'inversify-express-utils';
import { ROUTE } from '../model/enums';

enum STATUS_ROUTE {
    ROOT = '/database'
}
@controller(ROUTE.VERSION + STATUS_ROUTE.ROOT)
export class DefaultDatabaseStatusController extends AbstractController
    implements DatabaseStatusController {
    @httpGet('/status')
    async getDatabaseStatus(@response() res: Response) {
        const dto: DatabaseStatusDTO = {
            date: '31.12.20',
            directive: 'RL 99/2003/EU'
        };
        this.ok(res, dto);
    }
}
