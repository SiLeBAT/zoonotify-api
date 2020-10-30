export interface ProbenahmegrundRepository {
    retrieve(): Promise<Probenahmegrund[]>;
}

export interface Probenahmegrund {
    pk: number;
    name: string;
}
