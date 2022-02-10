const express = require('express');
const applyMiddlwares = require('./src/middleware/applyMiddlewares');
const setupMetrics = require('./src/metrics/setupMetrics');
const requestCounter = require('./src/metrics/requestCounter');
const GcsFile = require('./src/storage/GcsFile');
const SampleFile = require('./src/storage/SampleFile');
const aliasesEsm = require('./aliases-esm.json');
const aliasesCss = require('./aliases-css.json');
const applyHealthRoutes = require('./src/routing/applyHealthRoutes');
const getPackageIdentifiers = require('./src/utils/getPackageIdentifiers');
const { getJsAssetPathname, getCssAssetPathname } = require('./src/utils/assetPathnames');
const isDevelopment = require('./src/utils/isDevelopment');

const secondsInAYear = 31536000;

const app = express();
applyMiddlwares(app);
setupMetrics(app);
applyHealthRoutes(app);

Object.keys(aliasesEsm).forEach((assetName) => {
    const assetAliases = aliasesEsm[assetName];
    const [packageScope, packageName] = getPackageIdentifiers(assetName);
    for (const [alias, actual] of Object.entries(assetAliases)) {
        app.get(`/asset/${packageScope ? `${packageScope}/` : ''}${packageName}/v/${alias}/index.esm.js`, async (req, res) => {
            res.redirect(`/asset/${packageScope ? `${packageScope}/` : ''}${packageName}/v/${actual}/index.esm.js`);
        });
    }
});

Object.keys(aliasesCss).forEach((assetName) => {
    const assetAliases = aliasesCss[assetName];
    const [packageScope, packageName] = getPackageIdentifiers(assetName);
    for (const [alias, actual] of Object.entries(assetAliases)) {
        app.get(`/asset/${packageScope ? `${packageScope}/` : ''}${packageName}/v/${alias}/index.css`, async (req, res) => {
            res.redirect(`/asset/${packageScope ? `${packageScope}/` : ''}${packageName}/v/${actual}/index.css`);
        });
    }
});

app.get('/asset/:scope?/:libName/v/:libVersion/index.esm.js', async (req, res) => {
    try {
        const { scope, libName, libVersion } = req.params;

        const pathname = getJsAssetPathname(libName, libVersion);
        const sampleFilePath = __dirname + '/sample.esm.js';
        const file = isDevelopment ? new SampleFile(sampleFilePath) : new GcsFile(pathname);
        if (!isDevelopment) {
            requestCounter.inc({ file: libName });
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

app.get('/asset/:scope?/:libName/v/:libVersion/index.css', async (req, res) => {
    try {
        const { scope, libName, libVersion } = req.params;
        const pathname = getCssAssetPathname(libName, libVersion);
        const sampleFilePath = __dirname + '/sample.css';
        const file = isDevelopment ? new SampleFile(sampleFilePath) : new GcsFile(pathname);
        if (!isDevelopment) {
            requestCounter.inc({ file: libName });
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
