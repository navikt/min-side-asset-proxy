const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const promClient = require('prom-client');
const GcsFile = require('./storage/GcsFile');
const SampleFile = require('./storage/SampleFile');
const aliasesEsm = require('./aliases-esm.json');
const aliasesCss = require('./aliases-css.json');

const secondsInAYear = 31536000;
const corsOptions = {
    origin: process.env.CORS_ALLOWED_DOMAIN,
    optionsSuccessStatus: 200,
    methods: 'GET,HEAD',
};

promClient.collectDefaultMetrics();
const requestCounter = new promClient.Counter({
    name: 'request_count',
    help: 'Number of requests',
    labelNames: ['file'],
});

const app = express();
app.use(helmet());
app.use(cors(corsOptions));

app.get('/internal/metrics', async (req, res) => {
    const metrics = await promClient.register.metrics();
    res.set('Content-Type', promClient.register.contentType).send(metrics);
});

app.get('/internal/isReady', (req, res) => res.sendStatus(200));
app.get('/internal/isAlive', (req, res) => res.sendStatus(200));

const getJsAssetPathname = (libName, libVersion) => {
    return `${libName}/${libVersion}/esm/index.js`;
};
const getCssAssetPathname = (libName, libVersion) => {
    return `${libName}/${libVersion}/index.css`;
};

const isDevelopment = process.env.development === 'true';

Object.keys(aliasesEsm).forEach((assetName) => {
    const assetAliases = aliasesEsm[assetName];
    for (const [alias, actual] of Object.entries(assetAliases)) {
        app.get(`/asset/${assetName}/v/${alias}/index.esm.js`, async (req, res) => {
            res.redirect(`/asset/${assetName}/v/${actual}/index.esm.js`);
        });
    }
});

Object.keys(aliasesCss).forEach((assetName) => {
    const assetAliases = aliasesCss[assetName];
    for (const [alias, actual] of Object.entries(assetAliases)) {
        app.get(`/asset/${assetName}/v/${alias}/index.css`, async (req, res) => {
            res.redirect(`/asset/${assetName}/v/${actual}/index.css`);
        });
    }
});

app.get('/asset/:libName/v/:libVersion/index.esm.js', async (req, res) => {
    const { libName, libVersion } = req.params;
    const pathname = getJsAssetPathname(libName, libVersion);
    const sampleFilePath = __dirname + '/sample.esm.js';
    const file = isDevelopment ? new SampleFile(sampleFilePath) : new GcsFile(pathname);
    if (!isDevelopment) {
        requestCounter.inc({ file: libName });
    }

    try {
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

app.get('/asset/:libName/v/:libVersion/index.css', async (req, res) => {
    const { libName, libVersion } = req.params;
    const pathname = getCssAssetPathname(libName, libVersion);
    const sampleFilePath = __dirname + '/sample.css';
    const file = isDevelopment ? new SampleFile(sampleFilePath) : new GcsFile(pathname);
    if (!isDevelopment) {
        requestCounter.inc({ file: libName });
    }

    try {
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
