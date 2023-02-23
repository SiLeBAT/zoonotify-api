export class IsolateQueryFilter {
    constructor(
        public hasORCondition: boolean,
        public isolateFilter: any[],
        public resistanceFilter: any[]
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
