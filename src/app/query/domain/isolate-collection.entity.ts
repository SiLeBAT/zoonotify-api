import { Isolate, IsolateCollection } from './isolate.model';
import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

class DefaultIsolateCollection implements IsolateCollection {
    private _filteredIsolates: Isolate[];
    private _id: string;

    constructor(isolates: Isolate[]) {
        this._filteredIsolates = isolates;
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
): IsolateCollection {
    return new DefaultIsolateCollection(isolates);
}
