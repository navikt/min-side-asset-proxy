module.exports = (app) => {
    app.get('/internal/isReady', (req, res) => res.sendStatus(200));
    app.get('/internal/isAlive', (req, res) => res.sendStatus(200));
};
