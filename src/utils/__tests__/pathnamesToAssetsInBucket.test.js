const { getCssAssetPathnameInBucket, getJsAssetPathnameInBucket } = require('./../pathnamesToAssetsInBucket');

const falsyValues = [false, 0, '', null, undefined, NaN];

describe('getCssAssetPathnameInBucket', () => {
    test('when a scope is provided it should prefix the returned pathname with "scope-value/"', () => {
        const path = getCssAssetPathnameInBucket('ds-css', '1.0.0', '@navikt');
        expect(path).toEqual('@navikt/ds-css/1.0.0/index.css');
    });

    test('when a scope is not provided it should return the pathname as "assetName/assetVersion"', () => {
        const path = getCssAssetPathnameInBucket('ds-css', '1.0.0');
        expect(path).toEqual('ds-css/1.0.0/index.css');
    });

    test('when the scope is provided with a value which is falsy, the returned pathname should not be prefixed with that value', () => {
        falsyValues.forEach((falsyValue) => {
            const path = getCssAssetPathnameInBucket('ds-css', '1.0.0', falsyValue);
            expect(path).toEqual('ds-css/1.0.0/index.css');
        });
    });
});

describe('getJsAssetPathnameInBucket', () => {
    test('when a scope is provided it should prefix the returned pathname with "scope-value/"', () => {
        const path = getJsAssetPathnameInBucket('ds-react', '1.0.0', '@navikt');
        expect(path).toEqual('@navikt/ds-react/1.0.0/esm/index.js');
    });

    test('when a scope is not provided it should return the pathname as "assetName/assetVersion/esm"', () => {
        const path = getJsAssetPathnameInBucket('ds-react', '1.0.0');
        expect(path).toEqual('ds-react/1.0.0/esm/index.js');
    });

    test('when the scope is provided with a value which is falsy, the returned pathname should not be prefixed with that value', () => {
        falsyValues.forEach((falsyValue) => {
            const path = getJsAssetPathnameInBucket('ds-react', '1.0.0', falsyValue);
            expect(path).toEqual('ds-react/1.0.0/esm/index.js');
        });
    });
});