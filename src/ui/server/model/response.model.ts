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

export interface GetFilterConfigurationContainerDTO {
    filters: FilterConfigurationDTO[];
}

export interface FilterConfigurationDTO {
    id: string;
    name: string;
    parent?: string;
    values: string[];
}
