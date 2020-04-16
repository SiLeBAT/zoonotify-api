const SERVER_TYPES = {
    AppServerConfiguration: Symbol.for('AppServerConfiguration'),
    InfoController: Symbol.for('InfoController'),
    VersionRootController: Symbol.for('VersionRootController'),
    APIDocsController: Symbol.for('APIDocsController'),
    SwaggerMW: Symbol.for('SwaggerMW')
};

export default SERVER_TYPES;
