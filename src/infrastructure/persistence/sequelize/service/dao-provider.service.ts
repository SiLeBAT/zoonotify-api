import { injectable } from 'inversify';
import { ModelStatic, Sequelize } from 'sequelize/types';
import { isolateViewModelFactory } from '../dao/isolate-view.model';
import { Database } from '../datastore/database.model';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DAOHash = Record<string, ModelStatic<any>>;

export interface DAOProvider {
    getDAOHash(): DAOHash;
}

@injectable()
export class SequelizeDAOProvider implements DAOProvider {
    private daoHash: DAOHash;

    constructor(private db: Database<Sequelize>) {
        this.daoHash = this.createDAOS();
    }

    getDAOHash() {
        return this.daoHash;
    }

    private createDAOS() {
        const IsolateView = isolateViewModelFactory(this.db.getDatastore());

        return {
            isolateView: IsolateView,
        };
    }
}
