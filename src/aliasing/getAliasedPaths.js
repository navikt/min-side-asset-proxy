const getPackageIdentifiers = require('../utils/getPackageIdentifiers');

function getJsAssetPath(basePath, packageName, packageVersion, scope) {
    if (scope) {
        return `${basePath}/${scope}/${packageName}/${packageVersion}/esm/index.js`;
    }
    return `${basePath}/${packageName}/${packageVersion}/esm/index.js`;
}

function getCssAssetPath(basePath, packageName, packageVersion, scope) {
    if (scope) {
        return `${basePath}/${scope}/${packageName}/${packageVersion}/index.css`;
    }
    return `${basePath}/${packageName}/${packageVersion}/index.css`;
}

function getAliasMapping(basePath, assetName, alias, assetType) {
    if (assetType !== 'js' && assetType !== 'css') {
        throw new Error('Invalid asset type in alias mapping, please specify as "js" or "css"');
    }

    const [packageScope, packageName] = getPackageIdentifiers(assetName);
    const [versionAlias, actualVersion] = alias;

    let aliasedPath = '',
        actualPath = '';

    if (assetType === 'js') {
        aliasedPath = getJsAssetPath(basePath, packageName, versionAlias, packageScope);
        actualPath = getJsAssetPath(basePath, packageName, actualVersion, packageScope);
    } else if (assetType === 'css') {
        aliasedPath = getCssAssetPath(basePath, packageName, versionAlias, packageScope);
        actualPath = getCssAssetPath(basePath, packageName, actualVersion, packageScope);
    }

    return [aliasedPath, actualPath];
}

module.exports = function getAliasedPaths(basePath, aliases, assetType) {
    const namesOfAliasedAssets = Object.keys(aliases);
    const aliasedPaths = [];
    namesOfAliasedAssets.forEach((currentAssetName) => {
        const aliasesForCurrentAsset = Object.entries(aliases[currentAssetName]);
        aliasesForCurrentAsset.forEach((alias) => {
            const pathWithAlias = getAliasMapping(basePath, currentAssetName, alias, assetType);
            aliasedPaths.push(pathWithAlias);
        });
    });
    return aliasedPaths;
};
