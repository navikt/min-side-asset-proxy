const fs = require('fs');

class SampleFile {
    fileObject = null;
    readStream = null;

    constructor(sampleFilePath) {
        this.readStream = fs.createReadStream(sampleFilePath);
    }

    exists() {
        return true;
    }
}

module.exports = SampleFile;
