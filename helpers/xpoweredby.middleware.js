const xpoweredby = (req, res, next) => {
    res.set('X-Powered-By', 'thoschu');
    next();
};

module.exports = {
    xpoweredby
};
