const SERVER_TYPES = {
    AppServerConfiguration: Symbol.for('AppServerConfiguration'),
    InfoController: Symbol.for('InfoController'),
    DatabaseController: Symbol.for('DatabaseController'),
    FilterConfigController: Symbol.for('FilterConfigController'),
    IsolateController: Symbol.for('IsolateController'),
    VersionRootController: Symbol.for('VersionRootController'),
    APIDocsController: Symbol.for('APIDocsController'),
    QueryParameterToQueryFilterConverter: Symbol.for(
        'QueryParameterToQueryFilterConverter'
    ),
    QueryParameterToGroupingConverter: Symbol.for(
        'QueryParameterToGroupingConverter'
    ),
    IsolateConverter: Symbol.for('IsolateConverter'),
    GroupingString: Symbol.for('GroupingString'),
    SwaggerMW: Symbol.for('SwaggerMW'),
};

export default SERVER_TYPES;
