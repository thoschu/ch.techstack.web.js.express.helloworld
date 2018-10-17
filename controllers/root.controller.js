const fs = require('fs'),
    handlebars = require('handlebars'),
    path = require('path'),
    Server = require('../models/server.model');

let rootAction = async (request, response) => {
    const puplicip = await Server.getPip().then(result => {return result}).catch(err => console.error(err)),
        server = new Server(),
        pip = process.pid;

    console.log(pip);

    fs.readFile(path.join(__dirname, '../views/index.html'), (err, data) => {
        if (err) {
            response.status(500).send(err);
        }

        response.set('Content-Type', 'text/html');
        response.status(200).send(handlebars.compile(data.toString())({
            hostname: server.hostname,
            puplicip,
            pip
        }));
    });
};

module.exports = {
    rootAction
};
