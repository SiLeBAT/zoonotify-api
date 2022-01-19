import { Response, Request } from 'express';

export interface VersionRootController {
    getAPIDefinition(res: Response): Promise<void>;
}

export interface SystemInfoController {
    getSystemInfo(res: Response): Promise<void>;
}

export interface DatabaseController {
    getDatabaseStatus(res: Response): Promise<void>;
}

export interface FilterConfigController {
    getFilterConfiguration(res: Response): Promise<void>;
}

export interface MockDataController {
    getMockData(res: Response): Promise<void>;
}

export interface IsolateController {
    getIsolate(req: Request, res: Response): Promise<void>;
    getIsolateCount(req: Request, res: Response): Promise<void>;
}

export interface ResistanceController {
    getResistance(res: Response): Promise<void>;
}
