import { Database } from 'sqlite';
import { injectable } from 'inversify';

@injectable()
export class SQLiteRepositoryBase {
    constructor(protected _db: Database, protected _relation: string) {}

    protected _retrieve<T>(): Promise<T[] | undefined> {
        return this._db.all(`SELECT * FROM ${this._relation}`);
    }
}
