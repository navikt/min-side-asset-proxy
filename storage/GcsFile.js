const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

const bucket = storage.bucket('frontendplattform-assets-dev');

class GcsFile {
    file = null;
    readStream = null;

    constructor(pathToFile) {
        this.file = bucket.file(pathToFile);
        this.readStream = this.file.createReadStream();
    }

    exists() {
        return this.file.exists();
    }
}

module.exports = GcsFile;
