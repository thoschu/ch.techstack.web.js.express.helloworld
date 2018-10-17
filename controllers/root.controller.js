const fs = require('fs'),
    handlebars = require('handlebars'),
    path = require('path'),
    Server = require('../models/server.model');

let rootAction = async (request, response) => {
    const pip = await Server.getPip().then(result => {return result}).catch(err => console.error(err)),
        server = new Server();

    const view = fs.readFileSync(path.join(__dirname, '../views/index.html'), 'utf8');

    fs.readFile(path.join(__dirname, '../views/index.html'), (err, data) => {
        if (err) {
            response.status(500).send(err);
        }

        response.set('Content-Type', 'text/html');
        response.status(200).send(handlebars.compile(view.toString())({
            hostname: server.hostname,
            pip
        }));
    });
};

module.exports = {
    rootAction
};
