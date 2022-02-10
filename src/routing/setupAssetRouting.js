const requestCounter = require('../metrics/requestCounter');
const GcsFile = require('../storage/GcsFile');
const SampleFile = require('../storage/SampleFile');
const { getJsAssetPathnameInBucket, getCssAssetPathnameInBucket } = require('../utils/pathnamesToAssetsInBucket');
const isDevelopment = require('../utils/isDevelopment');

const secondsInAYear = 31536000;

module.exports = (app) => {
    app.get('/asset/:assetScope?/:assetName/v/:assetVersion/index.esm.js', async (req, res) => {
        try {
            const { assetScope, assetName, assetVersion } = req.params;
            const pathname = getJsAssetPathnameInBucket(assetName, assetVersion, assetScope);
            const sampleFilePath = __dirname + '/sample.esm.js';
            const file = isDevelopment ? new SampleFile(sampleFilePath) : new GcsFile(pathname);
            if (!isDevelopment) {
                requestCounter.inc({ file: assetName });
            }

            const fileExists = await file.exists();
            if (fileExists) {
                res.setHeader('Content-Type', 'application/javascript');
                res.setHeader('Cache-Control', `max-age=${secondsInAYear}`);
                file.readStream
                    .on('end', () => {
                        res.end();
                    })
                    .pipe(res);
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            console.error('Error getting asset', error.statusMessage);
            res.sendStatus(500);
        }
    });

    app.get('/asset/:assetScope?/:assetName/v/:assetVersion/index.css', async (req, res) => {
        try {
            const { assetScope, assetName, assetVersion } = req.params;
            const pathname = getCssAssetPathnameInBucket(assetName, assetVersion, assetScope);
            const sampleFilePath = __dirname + '/sample.css';
            const file = isDevelopment ? new SampleFile(sampleFilePath) : new GcsFile(pathname);
            if (!isDevelopment) {
                requestCounter.inc({ file: assetName });
            }

            const fileExists = await file.exists();
            if (fileExists) {
                res.setHeader('Content-Type', 'text/css');
                res.setHeader('Cache-Control', `max-age=${secondsInAYear}`);
                file.readStream
                    .on('end', () => {
                        res.end();
                    })
                    .pipe(res);
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            console.error('Error getting asset', error.statusMessage);
            res.sendStatus(500);
        }
    });
};
