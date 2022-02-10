const promClient = require('prom-client');

promClient.collectDefaultMetrics();

module.exports = (app) => {
    app.get('/internal/metrics', async (req, res) => {
        const metrics = await promClient.register.metrics();
        res.set('Content-Type', promClient.register.contentType).send(metrics);
    });
};
