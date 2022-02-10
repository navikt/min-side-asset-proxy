const getAliasMapping = require("./getAliasMapping");

function setupAliasRouteForAsset(assetName, alias, assetType, app) {
    const [aliasedPath, actualPath] = getAliasMapping(assetName, alias, assetType);
    app.get(aliasedPath, async (req, res) => res.redirect(actualPath));
}

module.exports = function setupAliasRouting(aliases, assetType, app) {
    const namesOfAliasedAssets = Object.keys(aliases);
    namesOfAliasedAssets.forEach((currentAssetName) => {
        const aliasesForCurrentAsset = Object.entries(aliases[currentAssetName]);
        aliasesForCurrentAsset.forEach((alias) => setupAliasRouteForAsset(currentAssetName, alias, assetType, app));
    });
}
