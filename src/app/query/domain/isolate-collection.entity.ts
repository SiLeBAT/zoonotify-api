import { Tree } from './../../core/domain/tree';
import { ApplicationFilter, QueryFilter } from './shared.model';
import { Isolate, IsolateCollection } from './isolate.model';
import * as _ from 'lodash';
import { createQueryFilter } from './query-filter.entity';
import { v4 as uuidv4 } from 'uuid';

class DefaultIsolateCollection implements IsolateCollection {
    private _filteredIsolates: Isolate[];
    private _id: string;

    constructor(isolates: Isolate[]) {
        this._filteredIsolates = isolates;
        //this._filteredIsolates = this.applyApplicationFilter(filter);
        this._id = uuidv4();
    }

    get isolates() {
        return _.cloneDeep(this._filteredIsolates);
    }

    get id() {
        return this._id;
    }
}

// just use the constructor?!
export function createIsolateCollection(
    isolates: Isolate[]
    //filter: QueryFilter = createQueryFilter()
): IsolateCollection {
    return new DefaultIsolateCollection(isolates);
}
