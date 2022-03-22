import {
    DataRequestCreatedEvent,
    GroupAttributes,
    QueryFilter,
} from './shared.model';

export class DefaultDataRequestCreatedEvent implements DataRequestCreatedEvent {
    _filter: QueryFilter;
    _grouping: GroupAttributes;
    constructor(filter: QueryFilter, grouping: GroupAttributes) {
        this._filter = filter;
        this._grouping = grouping;
    }

    public get filter() {
        return this._filter;
    }

    public get grouping() {
        return this._grouping;
    }
}

export function createDataRequestCreatedEvent(
    filter: QueryFilter,
    grouping: GroupAttributes
): DataRequestCreatedEvent {
    return new DefaultDataRequestCreatedEvent(filter, grouping);
}
