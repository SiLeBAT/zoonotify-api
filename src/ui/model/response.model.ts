interface ErrorDTO {
    code: number;
    message: string;
}

export type DefaultServerErrorDTO = ErrorDTO;

export interface SystemInformationDTO {
    version: string;
    lastChange: string;
    supportContact: string;
}
