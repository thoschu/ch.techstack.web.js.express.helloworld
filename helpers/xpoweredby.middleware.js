const xpoweredby = (req, res, next) => {
    res.set('X-Powered-By', 'express.js');
    next();
};

module.exports = {
    xpoweredby
};
