const SERVER_TYPES = {
    AppServerConfiguration: Symbol.for('AppServerConfiguration'),
    InfoController: Symbol.for('InfoController'),
    DatabaseController: Symbol.for('DatabaseController'),
    FilterConfigController: Symbol.for('FilterConfigController'),
    IsolateController: Symbol.for('IsolateController'),
    ResistanceController: Symbol.for('ResistanceController'),
    VersionRootController: Symbol.for('VersionRootController'),
    APIDocsController: Symbol.for('APIDocsController'),
    SwaggerMW: Symbol.for('SwaggerMW'),
};

export default SERVER_TYPES;
