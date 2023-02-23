export interface EntityGateway<T> {
    find(filter?: any[]): Promise<T>;
}
