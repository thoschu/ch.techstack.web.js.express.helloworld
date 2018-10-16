const fs = require('fs'),
    handlebars = require('handlebars'),
    path = require('path'),
    Server = require('../models/server.model');

let rootAction = async (request, response) => {
    const pip = await Server.getPip().then(result => {return result}).catch(err => console.error(err)),
        server = new Server(),
        context = {
            hostname: server.hostname,
            pip
        };

    fs.readFile(path.join(__dirname, '../views/index.html'), (err, data) => {
        if (err) {
            console.error(err);
            response.status(500).send(err);
        } else {
            const template = handlebars.compile(data.toString()),
                index = template(context);

            response.set('Content-Type', 'text/html');
            response.status(200).send(index);
        }
    });
};

module.exports = {
    rootAction
};
