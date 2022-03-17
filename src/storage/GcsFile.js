const { Storage } = require('@google-cloud/storage');
const isProduction = require('../utils/isProduction');
const storage = new Storage();

const bucketName = isProduction() ? 'min-side-assets-prod' : 'min-side-assets';
const bucket = storage.bucket(bucketName);
console.info(`Using bucket ${bucketName}`);

class GcsFile {
    file = null;
    // readStream = null;

    constructor(pathToFile) {
        this.file = bucket.file(pathToFile);
        // this.readStream = this.file.createReadStream().on('error', (error) => {
        //     console.error('Error reading file from bucket');
        //     throw error;
        // });
    }

    exists() {
        return this.file.exists();
    }
}

module.exports = GcsFile;
