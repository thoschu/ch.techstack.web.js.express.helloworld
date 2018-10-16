const controllers = require('./controllers/controllers');

module.exports = app => {
    app.get('/', controllers.rootCtrl.rootAction);
    app.get('/info/:method?', controllers.infoCtrl.infoAction);
};
