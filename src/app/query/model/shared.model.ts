export interface EntityGateway<T> {
    findAll(): Promise<T[]>;
}
