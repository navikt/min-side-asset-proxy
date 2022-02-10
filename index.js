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

Object.keys(aliasesEsm).forEach((assetName) => {
    const aliases = Object.entries(aliasesEsm[assetName]);
    aliases.forEach((alias) => {
        const [aliasedPath, actualPath] = getAliasMapping(assetName, alias, 'js');
        app.get(aliasedPath, async (req, res) => res.redirect(actualPath));
    });
});

Object.keys(aliasesCss).forEach((assetName) => {
    const aliases = Object.entries(aliasesCss[assetName]);
    aliases.forEach((alias) => {
        const [aliasedPath, actualPath] = getAliasMapping(assetName, alias, 'css');
        app.get(aliasedPath, async (req, res) => res.redirect(actualPath));
    });
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
