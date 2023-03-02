export enum CompareOperator {
    EQ = 'EQ',
    GT = 'GT',
    GTE = 'GTE',
    LT = 'LT',
    LTE = 'LTE',
    NEQ = 'NEQ',
    IN = 'IN',
    NOT_IN = 'NOT_IN',
}

export enum FilterComponentType {
    NOT_SET = 'NOT_SET',
    LOGICAL_OPERATOR = 'LOGICAL_OPERATOR',
    COMPARE_OPERATOR = 'COMPARE_OPERATOR',
    FILTER_CONDITION = 'FILTER_CONDITION',
    CHILD_FILTER_LIST = 'CHILD_FILTER_LIST',
}

export enum LogicalOperator {
    AND = 'AND',
    OR = 'OR',
}
