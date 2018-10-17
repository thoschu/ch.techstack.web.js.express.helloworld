const Server = require('../models/server.model');

let infoAction = (request, response) => {
    const server = new Server(),
        method = request.params.method;

    if (method && server[method]) {
        response.send(server[method]);
    } else {
        response.redirect(301, '/');
    }
};

module.exports = {
    infoAction
};
