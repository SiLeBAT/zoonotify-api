import { Response } from 'express';

export interface Controller {}

export interface ControllerFactory {
    // tslint:disable-next-line: no-any
    getController(controllerName: string): any;
}

export interface VersionRootController extends Controller {
    getAPIDefinition(res: Response): Promise<void>;
}

export interface SystemInfoController extends Controller {
    getSystemInfo(res: Response): Promise<void>;
}

export interface FilterConfigController extends Controller {
    getFilterConfiguration(res: Response): Promise<void>;
}

export interface MockDataController extends Controller {
    getMockData(res: Response): Promise<void>;
}
