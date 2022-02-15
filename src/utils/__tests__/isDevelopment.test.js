const isDevelopmentFn = require("../isDevelopment");

const originalEnvironment = process.env;

describe('isDevelopment', () => {
    test('it should return true when process.env.NODE_ENV is set to "development"', () => {
        process.env.NODE_ENV = 'development';
        const isDevelopment = isDevelopmentFn();
        expect(isDevelopment).toBe(true);
    });

    test('it should return false when process.env.NODE_ENV is not set to "development"', () => {
        process.env.NODE_ENV = 'production';
        let isDevelopment = isDevelopmentFn();
        expect(isDevelopment).toBe(false);
        
        process.env.NODE_ENV = undefined;
        isDevelopment = isDevelopmentFn();
        expect(isDevelopment).toBe(false);
    });

    afterEach(() => {
        process.env = originalEnvironment;
    })
});
