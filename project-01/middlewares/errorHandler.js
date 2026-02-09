const logger = require("../utils/logger");

module.exports = (err, req, res, next) => {
    logger.info({
        reqId: req.reqId,
        method: req.method,
        url: req.url,
        error: err.message,
    })
    const statusCode = err.statusCode || 500;
    res.status(statusCode).send({ error: err.message });
}