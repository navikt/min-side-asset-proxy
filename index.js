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

app.get('/@navikt-ds-react-0.14.3-beta.1.esm.js', (req, res) => {
    requestCounter.inc({ file: 'ds-react' });
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', `max-age=${secondsInAYear}`);
    const dsReactPathname = '@navikt/ds-react/0.14.3-beta.1/esm/index.js';
    const file = bucket.file(dsReactPathname);
    file.createReadStream()
        .on('error', (error) => console.error('Failed to read file', error))
        .on('end', () => {
            res.end();
        })
        .pipe(res);
});

app.get('/@navikt-ds-icons-0.7.1.esm.js', (req, res) => {
    requestCounter.inc({ file: 'ds-icons' });
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', `max-age=${secondsInAYear}`);
    const dsIconsPathname = '@navikt/ds-icons/0.7.1/esm/index.esm.js';
    const file = bucket.file(dsIconsPathname);
    file.createReadStream()
        .on('error', (error) => console.error('Failed to read file', error))
        .on('end', () => {
            res.end();
        })
        .pipe(res);
});

app.get('/classnames-2.3.1.esm.js', (req, res) => {
    requestCounter.inc({ file: 'classnames' });
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', `max-age=${secondsInAYear}`);
    const classnamesPathname = 'classnames/2.3.1/esm/index.js';
    const file = bucket.file(classnamesPathname);
    file.createReadStream()
        .on('error', (error) => console.error('Failed to read file', error))
        .on('end', () => {
            res.end();
        })
        .pipe(res);
});

app.get('/react-collapse-5.1.1.esm.js', (req, res) => {
    requestCounter.inc({ file: 'react-collapse' });
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', `max-age=${secondsInAYear}`);
    const reactCollapsePathname = 'react-collapse/5.1.1/esm/index.js';
    const file = bucket.file(reactCollapsePathname);
    file.createReadStream()
        .on('error', (error) => console.error('Failed to read file', error))
        .on('end', () => {
            res.end();
        })
        .pipe(res);
});

app.get('/uuid-8.3.2.esm.js', (req, res) => {
    requestCounter.inc({ file: 'uuid' });
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', `max-age=${secondsInAYear}`);
    const uuidPathname = 'uuid/8.3.2/esm/index.js';
    const file = bucket.file(uuidPathname);
    file.createReadStream()
        .on('error', (error) => console.error('Failed to read file', error))
        .on('end', () => {
            res.end();
        })
        .pipe(res);
});

app.get('/react-merge-refs-1.1.0.esm.js', (req, res) => {
    requestCounter.inc({ file: 'react-merge-refs' });
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', `max-age=${secondsInAYear}`);
    const reactMergeRefsPathname = 'react-merge-refs/1.1.0/esm/index.js';
    const file = bucket.file(reactMergeRefsPathname);
    file.createReadStream()
        .on('error', (error) => console.error('Failed to read file', error))
        .on('end', () => {
            res.end();
        })
        .pipe(res);
});

app.get('/react-popper-2.2.5.esm.js', (req, res) => {
    requestCounter.inc({ file: 'react-popper' });
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', `max-age=${secondsInAYear}`);
    const reactPopperPathname = 'react-popper/2.2.5/esm/index.js';
    const file = bucket.file(reactPopperPathname);
    file.createReadStream()
        .on('error', (error) => console.error('Failed to read file', error))
        .on('end', () => {
            res.end();
        })
        .pipe(res);
});

app.get('/popperjs-core-2.11.0.esm.js', (req, res) => {
    requestCounter.inc({ file: 'popperjs-core' });
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', `max-age=${secondsInAYear}`);
    const popperJsCorePathname = '@popperjs/core/2.11.0/esm/index.js';
    const file = bucket.file(popperJsCorePathname);
    file.createReadStream()
        .on('error', (error) => console.error('Failed to read file', error))
        .on('end', () => {
            res.end();
        })
        .pipe(res);
});

app.get('/react-modal-3.14.3.esm.js', (req, res) => {
    requestCounter.inc({ file: 'react-modal' });
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', `max-age=${secondsInAYear}`);
    const reactModalPathname = 'react-modal/3.14.3/esm/index.esm.js';
    const file = bucket.file(reactModalPathname);
    file.createReadStream()
        .on('error', (error) => console.error('Failed to read file', error))
        .on('end', () => {
            res.end();
        })
        .pipe(res);
})

const port = 8080;
app.listen(port, () => console.info(`Listening on port ${port}`));
