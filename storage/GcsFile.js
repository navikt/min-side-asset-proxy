const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

const bucket = storage.bucket('frontendplattform-assets-dev');

class GcsFile {
    fileObject = null;
    readStream = null;

    constructor(pathToFile) {
        this.readStream = bucket.file(pathToFile);
    }

    exists() {
        return this.fileObject.exists();
    }
}

module.exports = GcsFile;
