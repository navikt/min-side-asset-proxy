const fs = require('fs');

class SampleFile {
    fileObject = null;
    readStream = null;
    sampleFilePath = null;

    constructor(sampleFilePath) {
        this.sampleFilePath = sampleFilePath;
    }

    readFileContents() {
        this.readStream = fs.createReadStream(this.sampleFilePath);
    }

    exists() {
        return [true];
    }
}

module.exports = SampleFile;
