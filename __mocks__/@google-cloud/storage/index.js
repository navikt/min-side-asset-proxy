const fileMock = {
    createReadStream: () => ({
        on: () => ({})
    }),
    exists: () => true
};

class StorageMock {
    constructor() {}

    bucket() {
        return {
            file: () => fileMock
        };
    }
}

exports.Storage = StorageMock;
