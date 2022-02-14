const express = require('express');
const promClient = require('prom-client');
const getAliasedPaths = require('./src/aliasing/getAliasedPaths');
const { getJsFileObject } = require('./src/utils/getJsFileObject');
const { getCssFileObject } = require('./src/utils/getCssFileObject');
const applyDefaultMiddlewares = require('./src/middleware/applyDefaultMiddlewares');
const useMetrics = require('./src/middleware/useMetrics');
const { useCssAssetHeaders, useJsAssetHeaders } = require('./src/middleware/assetResponseHeaders');
const aliasesEsm = require('./aliases/esm.json');
const aliasesCss = require('./aliases/css.json');

const app = express();
applyDefaultMiddlewares(app);

promClient.collectDefaultMetrics();
const requestCounter = new promClient.Counter({
    name: 'request_count',
    help: 'Number of requests',
    labelNames: ['file'],
});

app.get('/internal/metrics', async (req, res) => {
    const metrics = await promClient.register.metrics();
    res.set('Content-Type', promClient.register.contentType).send(metrics);
});

app.get('/internal/isReady', (req, res) => res.sendStatus(200));
app.get('/internal/isAlive', (req, res) => res.sendStatus(200));

function addRedirectUrl(originalUrl, redirectUrl) {
    app.get(originalUrl, (req, res) => res.redirect(redirectUrl));
}

const jsAliases = getAliasedPaths(aliasesEsm, 'js');
jsAliases.forEach(([aliasPath, actualPath]) => addRedirectUrl(aliasPath, actualPath));

const cssAliases = getAliasedPaths(aliasesCss, 'css');
cssAliases.forEach(([aliasPath, actualPath]) => addRedirectUrl(aliasPath, actualPath));

function respondWithFileContents(file, res) {
    file.readStream.on('end', () => res.end()).pipe(res);
}

app.get(
    '/asset/:assetScope?/:assetName/v/:assetVersion/index.esm.js',
    useMetrics(requestCounter),
    useJsAssetHeaders,
    async (req, res) => {
        try {
            const { assetName, assetVersion, assetScope } = req.params;
            const file = getJsFileObject(assetName, assetVersion, assetScope);
            const fileExists = await file.exists();
            if (fileExists) {
                respondWithFileContents(file, res);
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            console.error('Error getting asset', error.statusMessage);
            res.sendStatus(500);
        }
    }
);

app.get(
    '/asset/:assetScope?/:assetName/v/:assetVersion/index.css',
    useMetrics(requestCounter),
    useCssAssetHeaders,
    async (req, res) => {
        try {
            const { assetName, assetVersion, assetScope } = req.params;
            const file = getCssFileObject(assetName, assetVersion, assetScope);
            const fileExists = await file.exists();
            if (fileExists) {
                respondWithFileContents(file, res);
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            console.error('Error getting asset', error.statusMessage);
            res.sendStatus(500);
        }
    }
);

const port = 8080;
app.listen(port, () => console.info(`Listening on port ${port}`));
