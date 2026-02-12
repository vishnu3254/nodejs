const logger = require("../utils/logger")

module.exports = (req, res, next) => {
    const start = Date.now();
    logger.info({
        reqId: req.reqId,
        method: req.method,
        url: req.url,
    }, "incoming request");
    res.on('finish', () => {
        const durationTime = Date.now() - start;
        logger.info({
            reqId: req.reqId,
            method: req.method,
            url: req.url,
            durationTime,
        }, "Request finised");
    })

    next();

}