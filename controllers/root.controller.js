const fs = require('fs'),
    handlebars = require('handlebars'),
    path = require('path'),
    stringifyObject = require('stringify-object'),
    Server = require('../models/server.model');

let rootAction = async (request, response) => {
    const server = new Server(),
        hostname = server.hostname,
        networkInterfaces = stringifyObject(server.networkInterfaces, {
            indent: '  ',
            singleQuotes: false
        }),
        puplicip = await Server.getpublicip().then(result => {return result}).catch(err => console.error(err)),
        pid = process.pid,
        workerId = process.env.workerId,
        numberofcpus = server.cpus.length;

    fs.readFile(path.join(__dirname, '../views/index.html'), (err, data) => {
        if (err) {
            response.status(500).send(err);
        }

        response.set('Content-Type', 'text/html');
        response.status(200).send(handlebars.compile(data.toString())({
            hostname,
            networkInterfaces,
            puplicip,
            pid,
            workerId,
            numberofcpus
        }));
    });
};

module.exports = {
    rootAction
};
