interface ErrorDTO {
    code: number;
    message: string;
}

export interface DefaultServerErrorDTO extends ErrorDTO {}

export interface SystemInformationDTO {
    version: string;
    lastChange: string;
    supportContact: string;
}
