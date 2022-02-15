const getPackageIdentifiers = require('../utils/getPackageIdentifiers');

function getJsAssetPath(packageName, packageVersion, scope) {
    if (scope) {
        return `/asset/${scope}/${packageName}/v/${packageVersion}/index.esm.js`;
    }
    return `/asset/${packageName}/v/${packageVersion}/index.esm.js`;
}

function getCssAssetPath(packageName, packageVersion, scope) {
    if (scope) {
        return `/asset/${scope}/${packageName}/v/${packageVersion}/index.css`;
    }
    return `/asset/${packageName}/v/${packageVersion}/index.css`;
}

function getAliasMapping(assetName, alias, assetType) {
    if (assetType !== 'js' && assetType !== 'css') {
        throw new Error('Invalid asset type in alias mapping, please specify as "js" or "css"');
    }

    const [packageScope, packageName] = getPackageIdentifiers(assetName);
    const [versionAlias, actualVersion] = alias;

    let aliasedPath = '',
        actualPath = '';

    if (assetType === 'js') {
        aliasedPath = getJsAssetPath(packageName, versionAlias, packageScope);
        actualPath = getJsAssetPath(packageName, actualVersion, packageScope);
    } else if (assetType === 'css') {
        aliasedPath = getCssAssetPath(packageName, versionAlias, packageScope);
        actualPath = getCssAssetPath(packageName, actualVersion, packageScope);
    }

    return [aliasedPath, actualPath];
}

module.exports = function getAliasedPaths(aliases, assetType) {
    const namesOfAliasedAssets = Object.keys(aliases);
    const aliasedPaths = [];
    namesOfAliasedAssets.forEach((currentAssetName) => {
        const aliasesForCurrentAsset = Object.entries(aliases[currentAssetName]);
        aliasesForCurrentAsset.forEach((alias) => {
            const pathWithAlias = getAliasMapping(currentAssetName, alias, assetType);
            aliasedPaths.push(pathWithAlias);
        });
    });
    return aliasedPaths;
};
