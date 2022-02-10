const helmet = require('helmet');
const cors = require('cors');

const corsOptions = {
    origin: process.env.CORS_ALLOWED_DOMAIN,
    optionsSuccessStatus: 200,
    methods: 'GET,HEAD',
};

module.exports = (app) => {
    app.use(helmet());
    app.use(cors(corsOptions));
    return app;
};