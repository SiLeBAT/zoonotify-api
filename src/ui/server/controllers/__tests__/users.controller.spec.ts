import { getContainer } from '../../../../aspects/container/container';
var mockReq = require('mock-express-request');
var mockRes = require('mock-express-response');
import {
    AuthorizationError,
    getApplicationContainerModule
} from '../../../../app/ports';
import { UsersController } from '../../model/controller.model';
import { Container } from 'inversify';
import { getServerContainerModule } from '../../server.module';
import { mockPersistenceContainerModule } from '../../../../infrastructure/persistence/__mocks__/persistence-mock.module';
import SERVER_TYPES from '../../server.types';
import { rebindMocks } from '../../../../__mocks__/util';
import { getMockLoginService } from '../../../../app/authentication/application/__mocks__/login.service';
import { APPLICATION_TYPES } from '../../../../app/application.types';

describe('Login controller', () => {
    let controller: UsersController;
    let container: Container | null;
    beforeEach(() => {
        container = getContainer();
        container.load(
            getServerContainerModule({
                port: 1,
                publicAPIDoc: {},
                jwtSecret: 'test',
                logLevel: 'info',
                supportContact: 'test'
            }),
            getApplicationContainerModule({
                appName: 'test',
                jobRecipient: 'test',
                login: {
                    threshold: 0,
                    secondsDelay: 0
                },
                apiUrl: 'test',
                supportContact: 'test',
                jwtSecret: 'test'
            }),
            mockPersistenceContainerModule
        );
        controller = container.get<UsersController>(
            SERVER_TYPES.UsersController
        );
    });
    afterEach(() => {
        container = null;
    });
    it('should be return a promise', () => {
        const mockLoginService = getMockLoginService();
        controller = rebindMocks<UsersController>(
            container,
            SERVER_TYPES.UsersController,
            [
                {
                    id: APPLICATION_TYPES.LoginService,
                    instance: mockLoginService
                }
            ]
        );
        const req = new mockReq({
            body: {
                email: 'test'
            }
        });
        const res = new mockRes();
        const result = controller.postLogin(req, res);
        // tslint:disable-next-line: no-floating-promises
        expect(result).toBeInstanceOf(Promise);
    });
    it('should be return a 500 response', () => {
        const mockLoginService = getMockLoginService();
        controller = rebindMocks<UsersController>(
            container,
            SERVER_TYPES.UsersController,
            [
                {
                    id: APPLICATION_TYPES.LoginService,
                    instance: mockLoginService
                }
            ]
        );
        mockLoginService.loginUser.mockImplementation(() => {
            throw new Error('Fake error');
        });
        const req = new mockReq({
            body: {
                email: 'test2'
            }
        });
        const res = new mockRes();
        const result = controller.postLogin(req, res);
        expect.assertions(1);
        return result.then(data => {
            return expect(res.statusCode).toBe(500);
        });
    });

    it('should be return a 401 response', () => {
        const mockLoginService = getMockLoginService();
        controller = rebindMocks<UsersController>(
            container,
            SERVER_TYPES.UsersController,
            [
                {
                    id: APPLICATION_TYPES.LoginService,
                    instance: mockLoginService
                }
            ]
        );
        mockLoginService.loginUser.mockImplementation(() => {
            throw new AuthorizationError('Fake error');
        });
        const req = new mockReq({
            body: {
                email: 'test3'
            }
        });
        const res = new mockRes();
        const result = controller.postLogin(req, res);
        expect.assertions(1);
        return result.then(data => {
            return expect(res.statusCode).toBe(401);
        });
    });

    it('should be return a 200 response', () => {
        const mockLoginService = getMockLoginService();
        controller = rebindMocks<UsersController>(
            container,
            SERVER_TYPES.UsersController,
            [
                {
                    id: APPLICATION_TYPES.LoginService,
                    instance: mockLoginService
                }
            ]
        );
        const req = new mockReq({
            body: {
                email: 'test4'
            }
        });
        const res = new mockRes();
        const result = controller.postLogin(req, res);
        expect.assertions(1);
        return result.then(data => {
            return expect(res.statusCode).toBe(200);
        });
    });
});
