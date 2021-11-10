import { Response, Request } from 'express';

export interface Controller {}

export interface VersionRootController extends Controller {
    getAPIDefinition(res: Response): Promise<void>;
}

export interface SystemInfoController extends Controller {
    getSystemInfo(res: Response): Promise<void>;
}

export interface DatabaseController extends Controller {
    getDatabaseStatus(res: Response): Promise<void>;
}

export interface FilterConfigController extends Controller {
    getFilterConfiguration(res: Response): Promise<void>;
}

export interface MockDataController extends Controller {
    getMockData(res: Response): Promise<void>;
}

export interface IsolateController extends Controller {
    getIsolate(req: Request, res: Response): Promise<void>;
    getIsolateCount(req: Request, res: Response): Promise<void>;
}
