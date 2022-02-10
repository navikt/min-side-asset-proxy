const express = require('express');
const applyMiddlewares = require('./src/middleware/applyMiddlewares');
const setupMetrics = require('./src/metrics/setupMetrics');
const setupAliasRouting = require('./src/routing/setupAliasRouting');
const setupAssetRouting = require('./src/routing/setupAssetRouting');
const aliasesEsm = require('./aliases-esm.json');
const aliasesCss = require('./aliases-css.json');

const app = express();

app.get('/internal/isReady', (req, res) => res.sendStatus(200));
app.get('/internal/isAlive', (req, res) => res.sendStatus(200));

applyMiddlewares(app);
setupMetrics(app);

setupAliasRouting(aliasesEsm, 'js', app);
setupAliasRouting(aliasesCss, 'css', app);

setupAssetRouting(app);

const port = 8080;
app.listen(port, () => console.info(`Listening on port ${port}`));
