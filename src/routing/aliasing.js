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

function getPackageIdentifiers(fullPackageName) {
    const fragments = fullPackageName.split('/');
    const packageIsScoped = fragments.length === 2;

    const scope = packageIsScoped ? fragments[0] : null;
    const name = packageIsScoped ? fragments[1] : fragments[0];

    return [scope, name];
};

module.exports = (assetName, alias, assetType) => {
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
