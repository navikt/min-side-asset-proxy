const fs = require('fs');
const { Storage } = require('@google-cloud/storage');

const storage = new Storage();

const sampleFilePath = __dirname + '/../sample.esm.js';
const bucket = storage.bucket('frontendplattform-assets-dev');

class FileReader {
    readStream = null;

    constructor(pathToFile) {
        if (process.env.development === 'true') {
            this.readStream = fs.createReadStream(sampleFilePath);
        } else {
            this.readStream = bucket.file(pathToFile).createReadStream();
        }
    }

    getReadStream() {
        return this.readStream.on('error', (error) => console.error('Failed to read file', error));
    }
};

module.exports = FileReader;