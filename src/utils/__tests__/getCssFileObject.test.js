const GcsFile = require('../../storage/GcsFile');
const SampleFile = require('../../storage/SampleFile');
const { getCssFileObject } = require('../getCssFileObject');

const originalEnvironment = process.env;

describe('getCssFileObject', () => {
    beforeEach(() => {
        jest.resetModules();
    })

    describe('outside development', () => {
        test('it should return a GcsFile when not in development', () => {
            const fileObject = getCssFileObject('ds-css', '1.0.0', '@navikt');
            expect(fileObject).toBeInstanceOf(GcsFile);
        });
    });

    describe('in development', () => {
        beforeEach(() => {
            process.env = {
                NODE_ENV: 'development',
            };
        });
        test('it should return a SampleFile when in development', () => {
            const fileObject = getCssFileObject('ds-css', '1.0.0', '@navikt');
            expect(fileObject).toBeInstanceOf(SampleFile);
        });

        afterEach(() => {
            process.env = originalEnvironment;
        });
    });
});
