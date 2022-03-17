const { Storage } = require('@google-cloud/storage');
const isProduction = require('../utils/isProduction');
const storage = new Storage();

const bucket = storage.bucket(isProduction ? 'min-side-assets-prod' : 'min-side-assets');
const bucketName = isProduction ? 'min-side-assets-prod' : 'min-side-assets';

class GcsFile {
    file = null;
    readStream = null;

    constructor(pathToFile) {
        this.file = bucket.file(pathToFile);
        console.log(bucketName);
        console.log(bucket);
        this.readStream = this.file.createReadStream().on('error', (error) => {
            console.error('Error reading file from bucket');
        });
    }

    exists() {
        return this.file.exists();
    }
}

module.exports = GcsFile;
