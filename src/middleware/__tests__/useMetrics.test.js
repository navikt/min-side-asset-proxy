const promClient = require('prom-client');
const useMetrics = require('../useMetrics');

const originalEnv = process.env;
const requestMock = { assetName: '@navikt/ds-react' };
const mockedRequestCounter = new promClient.Counter();
jest.spyOn(mockedRequestCounter, 'inc')

describe('metrics middleware', () => {
    test('it should increment requestCounter for the request when not in development', () => {
        const nextFn = jest.fn();
        process.env.NODE_ENV = 'production';
        useMetrics(mockedRequestCounter)(requestMock, null, nextFn);
        expect(mockedRequestCounter.inc).toHaveBeenCalled();
        expect(nextFn).toHaveBeenCalled();
    });

    it('should not increase requestCounter for the request when in development', () => {
        const nextFn = jest.fn();
        process.env.NODE_ENV = 'development';
        useMetrics(mockedRequestCounter)(requestMock, null, nextFn);
        expect(mockedRequestCounter.inc).not.toHaveBeenCalled();
        expect(nextFn).toHaveBeenCalled();
    });

    afterEach(() => {
        process.env = originalEnv;
        jest.clearAllMocks();
    });
});
