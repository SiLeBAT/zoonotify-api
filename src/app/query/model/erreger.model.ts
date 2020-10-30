export interface Erreger {
    pk: number;
    name: string;
}

export interface ErregerRepository {
    retrieve(): Promise<Erreger[]>;
}
