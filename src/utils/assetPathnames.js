exports.getJsAssetPathname = (libName, libVersion) => {
    return `${libName}/${libVersion}/esm/index.js`;
};

exports.getCssAssetPathname = (libName, libVersion) => {
    return `${libName}/${libVersion}/index.css`;
};
