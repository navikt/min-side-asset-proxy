const getAliasedPaths = require('../getAliasedPaths');

const dsReactAliasing = {
    '@navikt/ds-react': {
        1: '1.2.0',
        2: '2.0.0',
    },
};

const navFrontendTypografiAliasing = {
    'nav-frontend-typografi': {
        1: '1.0.0',
    },
};

const dsCssAliasing = {
    '@navikt/ds-css': {
        1: '1.2.0',
    },
};

const navFrontendTypografiStylesAliasing = {
    'nav-frontend-typografi-styles': {
        1: '1.0.0',
    },
};

const basePath = '/tms-min-side-assets';

describe('getAliasedPaths', () => {
    test('it should return alias paths in correct formats for scoped js assets', () => {
        const [alias] = getAliasedPaths(basePath, dsReactAliasing, 'js');
        const [aliasedPath, actualPath] = alias;
        expect(aliasedPath).toBe('/tms-min-side-assets/@navikt/ds-react/1/esm/index.js');
        expect(actualPath).toBe('/tms-min-side-assets/@navikt/ds-react/1.2.0/esm/index.js');
    });

    test('it should return alias paths in correct formats for unscoped js assets', () => {
        const [alias] = getAliasedPaths(basePath, navFrontendTypografiAliasing, 'js');
        const [aliasedPath, actualPath] = alias;
        expect(aliasedPath).toBe('/tms-min-side-assets/nav-frontend-typografi/1/esm/index.js');
        expect(actualPath).toBe('/tms-min-side-assets/nav-frontend-typografi/1.0.0/esm/index.js');
    });

    it('should return the correct number of aliases', () => {
        const aliases = getAliasedPaths(basePath, { ...dsReactAliasing, ...navFrontendTypografiAliasing }, 'js');
        expect(aliases.length).toBe(3);
    });

    test('it should return alias paths in correct formats for scoped css assets', () => {
        const [alias] = getAliasedPaths(basePath, dsCssAliasing, 'css');
        const [aliasedPath, actualPath] = alias;
        expect(aliasedPath).toBe('/tms-min-side-assets/@navikt/ds-css/1/index.css');
        expect(actualPath).toBe('/tms-min-side-assets/@navikt/ds-css/1.2.0/index.css');
    });

    test('it should return alias paths in correct formats for unscoped css assets', () => {
        const [alias] = getAliasedPaths(basePath, navFrontendTypografiStylesAliasing, 'css');
        const [aliasedPath, actualPath] = alias;
        expect(aliasedPath).toBe('/tms-min-side-assets/nav-frontend-typografi-styles/1/index.css');
        expect(actualPath).toBe('/tms-min-side-assets/nav-frontend-typografi-styles/1.0.0/index.css');
    });
});
