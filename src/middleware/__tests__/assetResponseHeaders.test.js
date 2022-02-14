const { useJsAssetHeaders, useCssAssetHeaders } = require('../assetResponseHeaders');

const nextFn = jest.fn();
const responseMock = {
    setHeader: jest.fn(),
};

describe('assetResponseHeaders', () => {
    test('useJsAssetHeaders should add correct Content-Type and Cache-Control headers to response', () => {
        useJsAssetHeaders(null, responseMock, nextFn);
        expect(responseMock.setHeader).toHaveBeenCalledWith('Content-Type', 'application/javascript');
        expect(responseMock.setHeader).toHaveBeenCalledWith('Cache-Control', 'max-age=31536000');
    });

    test('useCssAssetHeaders should add correct Content-Type and Cache-Control headers to response', () => {
        useCssAssetHeaders(null, responseMock, nextFn);
        expect(responseMock.setHeader).toHaveBeenCalledWith('Content-Type', 'text/css');
        expect(responseMock.setHeader).toHaveBeenCalledWith('Cache-Control', 'max-age=31536000');
    });
});
