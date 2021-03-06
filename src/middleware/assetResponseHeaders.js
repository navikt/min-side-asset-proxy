const secondsInAYear = 31536000;

exports.useJsAssetHeaders = (req, res, next) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', `max-age=${secondsInAYear}`);
    next();
};

exports.useCssAssetHeaders = (req, res, next) => {
    res.setHeader('Content-Type', 'text/css');
    res.setHeader('Cache-Control', `max-age=${secondsInAYear}`);
    next();
};
