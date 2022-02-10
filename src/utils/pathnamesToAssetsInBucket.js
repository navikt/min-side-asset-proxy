exports.getJsAssetPathnameInBucket = (assetName, assetVersion, assetScope) => {
    if (!!assetScope) {
        return `${assetScope}/${assetName}/${assetVersion}/esm/index.js`;
    }
    return `${assetName}/${assetVersion}/esm/index.js`;
};

exports.getCssAssetPathnameInBucket = (assetName, assetVersion, assetScope) => {
    if (!!assetScope) {
        return `${assetScope}/${assetName}/${assetVersion}/index.css`;
    }
    return `${assetName}/${assetVersion}/index.css`;
};
