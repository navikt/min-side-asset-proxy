const express = require('express');
const applyMiddlwares = require('./src/middleware/applyMiddlewares');
const setupMetrics = require('./src/metrics/setupMetrics');
const requestCounter = require('./src/metrics/requestCounter');
const GcsFile = require('./src/storage/GcsFile');
const SampleFile = require('./src/storage/SampleFile');
const aliasesEsm = require('./aliases-esm.json');
const aliasesCss = require('./aliases-css.json');
const applyHealthRoutes = require('./src/routing/applyHealthRoutes');
const { getJsAssetPathname, getCssAssetPathname } = require('./src/utils/assetPathnames');
const isDevelopment = require('./src/utils/isDevelopment');
const getAliasMapping = require('./src/routing/aliasing');

const secondsInAYear = 31536000;

const app = express();

applyMiddlwares(app);
setupMetrics(app);
applyHealthRoutes(app);

function setupAliasForAsset(assetName, alias, assetType) {
    const [aliasedPath, actualPath] = getAliasMapping(assetName, alias, assetType);
    app.get(aliasedPath, async (req, res) => res.redirect(actualPath));
}

function setupAliases(aliases, assetType) {
    const namesOfAliasedAssets = Object.keys(aliases);
    namesOfAliasedAssets.forEach((currentAssetName) => {
        const aliasesForCurrentAsset = Object.entries(aliases[currentAssetName]);
        aliasesForCurrentAsset.forEach((alias) => setupAliasForAsset(currentAssetName, alias, assetType));
    });
}

setupAliases(aliasesEsm, 'js');
setupAliases(aliasesCss, 'css');

app.get('/asset/:assetScope?/:assetName/v/:assetVersion/index.esm.js', async (req, res) => {
    try {
        const { assetScope, assetName, assetVersion } = req.params;

        const pathname = getJsAssetPathname(assetName, assetVersion, assetScope);
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
        const pathname = getCssAssetPathname(assetName, assetVersion, assetScope);
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

const port = 8080;
app.listen(port, () => console.info(`Listening on port ${port}`));
