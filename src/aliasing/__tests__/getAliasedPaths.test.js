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

describe('getAliasedPaths', () => {
    test('it should return alias paths in correct formats for scoped js assets', () => {
        const [alias] = getAliasedPaths(dsReactAliasing, 'js');
        const [aliasedPath, actualPath] = alias;
        expect(aliasedPath).toBe('/asset/@navikt/ds-react/v/1/index.esm.js');
        expect(actualPath).toBe('/asset/@navikt/ds-react/v/1.2.0/index.esm.js');
    });

    test('it should return alias paths in correct formats for unscoped js assets', () => {
        const [alias] = getAliasedPaths(navFrontendTypografiAliasing, 'js');
        const [aliasedPath, actualPath] = alias;
        expect(aliasedPath).toBe('/asset/nav-frontend-typografi/v/1/index.esm.js');
        expect(actualPath).toBe('/asset/nav-frontend-typografi/v/1.0.0/index.esm.js');
    });

    it('should return the correct number of aliases', () => {
        const aliases = getAliasedPaths({ ...dsReactAliasing, ...navFrontendTypografiAliasing }, 'js');
        expect(aliases.length).toBe(3);
    });

    test('it should return alias paths in correct formats for scoped css assets', () => {
        const [alias] = getAliasedPaths(dsCssAliasing, 'css');
        const [aliasedPath, actualPath] = alias;
        expect(aliasedPath).toBe('/asset/@navikt/ds-css/v/1/index.css');
        expect(actualPath).toBe('/asset/@navikt/ds-css/v/1.2.0/index.css');
    });

    test('it should return alias paths in correct formats for unscoped css assets', () => {
        const [alias] = getAliasedPaths(navFrontendTypografiStylesAliasing, 'css');
        const [aliasedPath, actualPath] = alias;
        expect(aliasedPath).toBe('/asset/nav-frontend-typografi-styles/v/1/index.css');
        expect(actualPath).toBe('/asset/nav-frontend-typografi-styles/v/1.0.0/index.css');
    });
});
