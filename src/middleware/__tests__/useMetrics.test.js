const promClient = require('prom-client');
const useMetrics = require('../useMetrics');

const originalEnv = process.env;
const requestMock = { assetName: '@navikt/ds-react' };
const nextFn = jest.fn();

const mockedRequestCounter = new promClient.Counter();
jest.spyOn(mockedRequestCounter, 'inc')

function fakeRequest() {
    useMetrics(mockedRequestCounter)(requestMock, null, nextFn);
}

describe('metrics middleware', () => {
    test('it should increment requestCounter for the request when not in development', () => {
        process.env.NODE_ENV = 'production';
        fakeRequest();
        expect(mockedRequestCounter.inc).toHaveBeenCalled();
        expect(nextFn).toHaveBeenCalled();
    });

    it('should not increase requestCounter for the request when in development', () => {
        process.env.NODE_ENV = 'development';
        fakeRequest();
        expect(mockedRequestCounter.inc).not.toHaveBeenCalled();
        expect(nextFn).toHaveBeenCalled();
    });

    afterEach(() => {
        process.env = originalEnv;
        jest.clearAllMocks();
    });
});
