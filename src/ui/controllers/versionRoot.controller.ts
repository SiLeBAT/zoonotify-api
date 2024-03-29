import { Response } from 'express';
import * as _ from 'lodash';
import { controller, response, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';
import { VersionRootController } from '../model/controller.model';
import { ROUTE } from '../model/enums';
import { AbstractController } from './abstract.controller';
import { AppServerConfiguration } from '../model/server.model';
import SERVER_TYPES from '../server.types';
import { logger } from '../../aspects';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const openAPI = require('../doc/openapi_v1.json');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type APIDefinition = any;

@controller(ROUTE.VERSION)
export class DefaultVersionRootController
    extends AbstractController
    implements VersionRootController
{
    private publicAPI: APIDefinition;

    constructor(
        @inject(SERVER_TYPES.AppServerConfiguration)
        configuration: AppServerConfiguration
    ) {
        super();

        this.publicAPI = this.documentationRevealer(
            openAPI,
            configuration.publicAPIDoc
        );
    }

    @httpGet('/')
    async getAPIDefinition(@response() res: Response) {
        try {
            this.ok(res, this.publicAPI);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    private handleError(res: Response, error: Error) {
        logger.error('Error retrieving documentation', error);
        this.fail(res, 'Unable to retrieve documentation');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private search(term: string, object: APIDefinition, found: any[] = []) {
        Object.keys(object).forEach((key) => {
            if (key === term) {
                found.push(object[key]);
                return found;
            }
            if (typeof object[key] === 'object') {
                this.search(term, object[key], found);
            }
        });
        return found;
    }

    private documentationRevealer(
        definition: APIDefinition,
        filter: { [keys: string]: string[] }
    ) {
        // Delete unwanted paths
        for (const path of Object.keys(definition.paths)) {
            if (!_.includes(Object.keys(filter), path)) {
                delete definition.paths[path];
            } else {
                for (const operation of Object.keys(definition.paths[path])) {
                    if (!_.includes(filter[path], operation)) {
                        delete definition.paths[path][operation];
                    }
                }
                if (_.isEmpty(definition.paths[path])) {
                    delete definition.paths[path];
                }
            }
        }
        // Parse remaining document & note left-over tags and refs
        let remainingTags: string[] = [];
        let remainingRefs: Set<string>;
        for (const path of Object.keys(definition.paths)) {
            for (const operation of Object.keys(definition.paths[path])) {
                if (definition.paths[path][operation].tags) {
                    remainingTags = remainingTags.concat(
                        definition.paths[path][operation].tags
                    );
                }
            }
        }
        remainingRefs = new Set<string>(this.search('$ref', definition));

        // remove tags no longer needed
        const tags: string[] = definition.tags.map(
            (t: { name: string }) => t.name
        );

        tags.forEach((tag) => {
            if (!_.includes(remainingTags, tag)) {
                _.remove(
                    definition.tags,
                    (t: { name: string }) => t.name === tag
                );
            }
        });

        // removes refs no longer needed.
        let currentRemainingRefs = remainingRefs.size;
        let lastRemainingRefs = 0;

        const refString = '#/components';
        while (currentRemainingRefs !== lastRemainingRefs) {
            lastRemainingRefs = currentRemainingRefs;
            // remove refs
            for (const component of Object.keys(definition.components)) {
                for (const ref of Object.keys(
                    definition.components[component]
                )) {
                    const reference = [refString, component, ref].join('/');
                    if (!remainingRefs.has(reference)) {
                        delete definition.components[component][ref];
                    }
                }
            }
            // set new refs
            remainingRefs = new Set<string>(this.search('$ref', definition));
            currentRemainingRefs = remainingRefs.size;
        }
        return definition;
    }
}
