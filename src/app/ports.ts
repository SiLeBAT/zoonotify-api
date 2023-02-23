/**
 * core exports
 */
export { getApplicationContainerModule } from './application.module';
export { ApplicationConfiguration } from './core/domain/configuration.model';
export { ConfigurationService } from './core/application/configuration.service';
export { APPLICATION_TYPES } from './application.types';
export { BidirectionalMap } from './core/domain/bidirectional.map';
export { Tree } from './core/domain/tree';
export { TreeNode } from './core/domain/tree-node';

/**
 * query exports
 */
export { FederalState } from './query/domain/federal-state.enum';
export {
    IsolateQueryFilter,
    PrefixInputParam,
} from './query/domain/filter.model';

export {
    GeneSet,
    Isolate,
    IsolateCharacteristicSet,
    IsolateResistanceSet,
    IsolateViewGateway,
    IsolateCollection,
} from './query/domain/isolate.model';

export {
    Resistance,
    ResistanceViewGateway,
    ResistanceCollection,
} from './query/domain/resistance.model';

export { createIsolateCollection } from './query/domain/isolate-collection.entity';
export { IsolatePort } from './query/application/isolat.service';
export { createIsolate } from './query/domain/isolate.entity';
