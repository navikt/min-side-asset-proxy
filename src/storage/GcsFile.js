const { Storage } = require('@google-cloud/storage');
const isProduction = require('../utils/isProduction');
const storage = new Storage();

const bucketName = isProduction() ? 'min-side-assets-prod' : 'min-side-assets';
const bucket = storage.bucket(bucketName);

class GcsFile {
    file = null;
    readStream = null;

    constructor(pathToFile) {
        console.log(`BucketName: ${bucketName}`);
        this.file = bucket.file(pathToFile);
        this.readStream = this.file.createReadStream().on('error', (error) => {
            console.error('Error reading file from bucket');
        });
    }

    exists() {
        return this.file.exists();
    }
}

module.exports = GcsFile;
