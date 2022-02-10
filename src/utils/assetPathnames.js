exports.getJsAssetPathname = (libName, libVersion, scope) => {
    if (scope) {
        return `${scope}/${libName}/${libVersion}/esm/index.js`;
    }
    return `${libName}/${libVersion}/esm/index.js`;
};

exports.getCssAssetPathname = (libName, libVersion, scope) => {
    if (scope) {
        return `${scope}/${libName}/${libVersion}/index.css`;
    }
    return `${libName}/${libVersion}/index.css`;
};
