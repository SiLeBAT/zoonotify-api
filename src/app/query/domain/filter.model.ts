import { LogicalOperator } from 'src/app/general.enums';
import { FilterCondition } from 'src/ui/model/filter.model';

export class IsolateQueryFilter {
    constructor(
        public hasORCondition: boolean,
        public isolateFilter: (LogicalOperator | FilterCondition)[],
        public resistanceFilter: (LogicalOperator | FilterCondition)[]
    ) {}
}
export interface PrefixInputParam {
    prefixValue: string;
    isInclusivePrefix: boolean;
}
export class PrefixInputParam implements PrefixInputParam {
    constructor(
        public prefixValue: string,
        public isInclusivePrefix: boolean
    ) {}
}
