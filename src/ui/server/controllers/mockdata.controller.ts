import { Response } from 'express';
import { MockDataController } from '../model/controller.model';
import { AbstractController } from './abstract.controller';
import { controller, httpGet, response } from 'inversify-express-utils';
import { ROUTE } from '../model/enums';
const data = require('../../../../data/mock_data.json');

enum MOCKDATA_ROUTE {
    ROOT = '/mockdata'
}
@controller(ROUTE.VERSION + MOCKDATA_ROUTE.ROOT)
export class DefaultMockDataController extends AbstractController
    implements MockDataController {
    constructor() {
        super();
    }

    @httpGet('/')
    async getMockData(@response() res: Response) {
        try {
            this.ok(res, data);
        } catch (error) {
            this.handleError(res);
        }
    }

    private handleError(res: Response) {
        this.fail(res, 'Unable to retrieve system information');
    }
}
