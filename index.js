const { Storage } = require('@google-cloud/storage');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const promClient = require('prom-client');

const storage = new Storage();
const bucket = storage.bucket('frontendplattform-assets-dev');

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
    labelNames: ['file']
});

const app = express();
app.use(helmet());
app.use(cors(corsOptions));

app.get('/internal/metrics', async (req, res) => {
    const metrics = await promClient.register.metrics();
    res.set('Content-Type', promClient.register.contentType).send(metrics);
});

app.get('/isReady', (req, res) => res.sendStatus(200));
app.get('/isAlive', (req, res) => res.sendStatus(200));

app.get('/react-17.esm.js', (req, res) => {
    res.redirect('/react-17.0.2.esm.js', 302);
});

app.get('/react-17.0.2.esm.js', (req, res) => {
    requestCounter.inc({ file: 'react' });
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', `max-age=${secondsInAYear}`);
    const reactPathname = 'react/17.0.2/esm/index.js';
    const file = bucket.file(reactPathname);
    file.createReadStream()
        .on('error', (error) => console.error('Failed to read file', error))
        .on('end', () => {
            res.end();
        })
        .pipe(res);
});

app.get('/react-dom-17.esm.js', (req, res) => {
    res.redirect('/react-dom-17.0.2.esm.js', 302);
});

app.get('/react-dom-17.0.2.esm.js', (req, res) => {
    requestCounter.inc({ file: 'react-dom' });
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', `max-age=${secondsInAYear}`);
    const reactDomPathname = 'react-dom/17.0.2/esm/index.js';
    const file = bucket.file(reactDomPathname);
    file.createReadStream()
        .on('error', (error) => console.error('Failed to read file', error))
        .on('end', () => {
            res.end();
        })
        .pipe(res);
});

const port = 8080;
app.listen(port, () => console.info(`Listening on port ${port}`));
