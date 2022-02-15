const isDevelopment = require('../utils/isDevelopment');

module.exports = (requestCounter) => {
    return (req, res, next) => {
        if (!isDevelopment()) {
            requestCounter.inc({ file: req.assetName });
        }
        next();
    };
};
