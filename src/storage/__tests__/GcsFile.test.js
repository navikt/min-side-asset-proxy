const GcsFile = require("../GcsFile");

describe('GcsFile', () => {
    const gcsFile = new GcsFile();

    jest.spyOn(gcsFile.file, 'exists');

    test('it should have instantiated a file object', () => {
        expect(gcsFile.file).toBeDefined();
        expect(typeof gcsFile.file.exists).toBe('function')
        expect(typeof gcsFile.file.createReadStream).toBe('function')
    });

    test('it should have instantiated a readStream object', () => {
        expect(typeof gcsFile.readStream).toBeDefined();
    });

    test('it should use google api to determine whether the file exists in bucket', () => {
        expect(gcsFile.file.exists).not.toHaveBeenCalled();
        gcsFile.exists();
        expect(gcsFile.file.exists).toHaveBeenCalled();
    })
});