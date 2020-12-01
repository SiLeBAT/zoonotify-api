export interface MatrixRepository {
    retrieve(): Promise<Matrix[]>;
}

export interface Matrix {
    pk: number;
    name: string;
}
