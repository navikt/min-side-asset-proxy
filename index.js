const express = require('express');
const helmet = require('helmet');
const { Storage } = require('@google-cloud/storage');

const storage = new Storage();
const bucket = storage.bucket('frontendplattform-assets');

const app = express();
app.use(helmet());
app.get('/isReady', (req, res) => res.sendStatus(200));
app.get('/isAlive', (req, res) => res.sendStatus(200));

app.get('/react-17.esm.js', (req, res) => {
    const reactPathname = 'react/esm/index.js';
    const file = bucket.file(reactPathname);
    file.createReadStream()
        .on('error', (error) => console.error('Failed to read file', error))
        .on('end', () => {
            res.setHeader('Content-Type', 'application/javascript');
            res.end();
        })
        .pipe(res);
});

app.get('/react-dom-17.esm.js', (req, res) => {
    const reactDomPathname = 'react-dom/esm/index.js';
    const file = bucket.file(reactDomPathname);
    file.createReadStream()
        .on('error', (error) => console.error('Failed to read file', error))
        .on('end', () => {
            res.setHeader('Content-Type', 'application/javascript');
            res.end();
        })
        .pipe(res);
});

const port = 8080;
app.listen(port, () => console.info(`Listening on port ${port}`));
