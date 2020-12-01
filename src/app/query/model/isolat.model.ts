export interface Isolat {
    pk: number;
}

export interface IsolatRepository {
    retrieve(): Promise<Isolat[]>;
}
