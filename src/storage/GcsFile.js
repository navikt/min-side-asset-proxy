const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

const bucket = storage.bucket('min-side-assets');
    
class GcsFile {
    file = null;
    readStream = null;

    constructor(pathToFile) {
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
