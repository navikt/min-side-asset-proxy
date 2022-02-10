exports.getJsAssetPathnameInBucket = (libName, libVersion, scope) => {
    if (scope) {
        return `${scope}/${libName}/${libVersion}/esm/index.js`;
    }
    return `${libName}/${libVersion}/esm/index.js`;
};

exports.getCssAssetPathnameInBucket = (libName, libVersion, scope) => {
    if (scope) {
        return `${scope}/${libName}/${libVersion}/index.css`;
    }
    return `${libName}/${libVersion}/index.css`;
};
