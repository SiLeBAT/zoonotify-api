import { Response } from 'express';
import { DatabaseController } from '../model/controller.model';
import { DatabaseStatusDTO } from '../model/response.model';
import { AbstractController } from './abstract.controller';
import { controller, httpGet, response } from 'inversify-express-utils';
import { ROUTE } from '../model/enums';

enum DATABASE_ROUTE {
    ROOT = '/database'
}
@controller(ROUTE.VERSION + DATABASE_ROUTE.ROOT)
export class DefaultDatabaseController extends AbstractController
    implements DatabaseController {
    @httpGet('/status')
    async getDatabaseStatus(@response() res: Response) {
        const dto: DatabaseStatusDTO = {
            date: '31.12.20'
        };
        this.ok(res, dto);
    }
}
