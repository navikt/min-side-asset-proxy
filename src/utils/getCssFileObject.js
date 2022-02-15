const isDevelopment = require('./isDevelopment');
const { getCssAssetPathnameInBucket } = require('./pathnamesToAssetsInBucket');
const GcsFile = require('../storage/GcsFile');
const SampleFile = require('../storage/SampleFile');

function getBucketFile(assetName, assetVersion, assetScope) {
    const filePathInBucket = getCssAssetPathnameInBucket(assetName, assetVersion, assetScope);
    return new GcsFile(filePathInBucket);
}

exports.getCssFileObject = function (assetName, assetVersion, assetScope) {
    if (isDevelopment()) {
        const sampleFilePath = `${__dirname}/../../sample.css`;
        return new SampleFile(sampleFilePath);
    }
    return getBucketFile(assetName, assetVersion, assetScope);
};
