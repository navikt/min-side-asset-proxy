const isDevelopment = require('../utils/isDevelopment');
const { getJsAssetPathnameInBucket } = require('../utils/pathnamesToAssetsInBucket');
const GcsFile = require('./../storage/GcsFile');
const SampleFile = require('./../storage/SampleFile');

function getBucketFile(assetName, assetVersion, assetScope) {
    const filePathInBucket = getJsAssetPathnameInBucket(assetName, assetVersion, assetScope);
    return new GcsFile(filePathInBucket);
}

exports.getJsFileObject = function (assetName, assetVersion, assetScope) {
    if (isDevelopment()) {
        const sampleFilePath = `${__dirname}/../../sample.esm.js`;
        return new SampleFile(sampleFilePath);
    }
    return getBucketFile(assetName, assetVersion, assetScope);
};
