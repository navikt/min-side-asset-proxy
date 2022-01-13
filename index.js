const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const promClient = require('prom-client');
const GcsFile = require('./storage/GcsFile');
const SampleFile = require('./storage/SampleFile');

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

app.get('/isReady', (req, res) => res.sendStatus(200));
app.get('/isAlive', (req, res) => res.sendStatus(200));

const getJsAssetPathname = (libName, libVersion) => {
    return `${libName}/${libVersion}/esm/index.js`;
};
const getCssAssetPathname = (libName, libVersion) => {
    return `${libName}/${libVersion}/index.css`;
};

const isDevelopment = process.env.development === 'true';

app.get('/asset/:libName/v/:libVersion/index.esm.js', async (req, res) => {
    const { libName, libVersion } = req.params;
    const pathname = getJsAssetPathname(libName, libVersion);
    const sampleFilePath = __dirname + '/sample.esm.js';
    const file = isDevelopment ? new SampleFile(sampleFilePath) : new GcsFile(pathname);
    if (isDevelopment) {
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
        console.error('error occured', error);
        res.sendStatus(500);
    }
});

app.get('/asset/:libName/v/:libVersion/index.css', async (req, res) => {
    const { libName, libVersion } = req.params;
    const pathname = getCssAssetPathname(libName, libVersion);
    const sampleFilePath = __dirname + '/sample.css';
    const file = isDevelopment ? new SampleFile(sampleFilePath) : new GcsFile(pathname);
    if (isDevelopment) {
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
        console.error('error occured', error);
        res.sendStatus(500);
    }
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
    const dsIconsPathname = '@navikt/ds-icons/0.7.1/esm/index.js';
    const file = bucket.file(dsIconsPathname);
    file.createReadStream()
        .on('error', (error) => console.error('Failed to read file', error))
        .on('end', () => {
            res.end();
        })
        .pipe(res);
});

app.get('/@navikt-ds-css-0.12.6.css', (req, res) => {
    requestCounter.inc({ file: 'ds-css' });
    res.setHeader('Content-Type', 'text/css');
    res.setHeader('Cache-Control', `max-age=${secondsInAYear}`);
    const dsCssPathname = '@navikt/ds-css/0.12.6/index.css';
    const file = bucket.file(dsCssPathname);
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
    const uuidPathname = 'uuid/8.3.2/esm/esm-browser-v4.js';
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
    const reactModalPathname = 'react-modal/3.14.3/esm/index.js';
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
