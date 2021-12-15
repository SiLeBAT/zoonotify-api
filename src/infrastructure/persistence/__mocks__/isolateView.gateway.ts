import { IsolateViewGateway } from './../../../app/ports';

export function getMockIsolateViewGateway(): IsolateViewGateway {
    return {
        getCount: jest.fn(() =>
            Promise.resolve({
                totalNumberOfIsolates: 0,
            })
        ),
        getUniqueAttributeValues: jest.fn(() => Promise.resolve([])),
        findAll: jest.fn(),
    };
}
