export interface Isolat {
    pk: number;
    programm_beschreibung: string;
}

export interface IsolatRepository {
    retrieve(): Promise<Isolat[]>;
}
