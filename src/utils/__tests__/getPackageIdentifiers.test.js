const getPackageIdentifiers = require('./../getPackageIdentifiers');

describe('getPackageIdentifiers', () => {
    test('if the provided package name is prefixed with a scope (e.g. @navikt/), it should return [scope, name]', () => {
        const [scope, name] = getPackageIdentifiers('@navikt/ds-react');
        expect(scope).toBe('@navikt');
        expect(name).toBe('ds-react');
    });

    test('if the provided package name is not prefixed with a scope, it should return [null, name]', () => {
        const [scope, name] = getPackageIdentifiers('ds-react');
        expect(scope).toBeNull();
        expect(name).toBe('ds-react');
    })
});
