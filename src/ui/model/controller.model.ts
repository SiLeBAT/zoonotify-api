import { Response } from 'express';

export interface VersionRootController {
    getAPIDefinition(res: Response): Promise<void>;
}

export interface SystemInfoController {
    getSystemInfo(res: Response): Promise<void>;
}
