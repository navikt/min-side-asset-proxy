const promClient = require('prom-client');
const isDevelopment = require('../utils/isDevelopment');

const requestCounter = new promClient.Counter({
    name: 'request_count',
    help: 'Number of requests',
    labelNames: ['file'],
});

module.exports = (req, res, next) => {
    if (!isDevelopment()) {
        requestCounter.inc({ file: req.assetName });
    }
    next();
};
