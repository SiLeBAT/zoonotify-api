const SERVER_TYPES = {
    APIDocsController: Symbol.for('APIDocsController'),
    AppServerConfiguration: Symbol.for('AppServerConfiguration'),
    DatabaseController: Symbol.for('DatabaseController'),
    GroupingString: Symbol.for('GroupingString'),
    InfoController: Symbol.for('InfoController'),
    IsolateController: Symbol.for('IsolateController'),
    IsolateConverter: Symbol.for('IsolateConverter'),
    QueryFilterConverter: Symbol.for('QueryFilterConverter'),
    SwaggerMW: Symbol.for('SwaggerMW'),
    VersionRootController: Symbol.for('VersionRootController'),
};

export default SERVER_TYPES;
