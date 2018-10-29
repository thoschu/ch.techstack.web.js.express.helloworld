const fs = require('fs'),
    handlebars = require('handlebars'),
    path = require('path'),
    R = require('ramda'),
    stringifyObject = require('stringify-object'),
    Server = require('../models/server.model'),
    server = new Server();

let rootAction = async (request, response) => {
    const proenv = process.env,
        hostname = server.hostname,
        lip = server.lip,
        ipv = server.ipv,
        networkInterfaces = stringifyObject(server.networkInterfaces, {
            indent: '  ',
            singleQuotes: false
        }),
        puplicip = await Server.getpublicip().then(result => {return result}).catch(err => console.error(err)),
        pid = process.pid,
        workerId = proenv.workerId,
        numberofcpus = server.cpus.length,
        nodename = proenv.NODE_NAME,
        podname = proenv.POD_NAME,
        podnamespace = proenv.POD_NAMESPACE,
        podip = proenv.POD_IP,
        podserviceaccount = proenv.POD_SERVICE_ACCOUNT,
        podnumberofcontainer = proenv.POD_NUMBER_OF_CONTAINER,
        hasmore = R.not((R.isNil(nodename) || R.isNil(podname) || R.isNil(podnamespace) || R.isNil(podip) || R.isNil(podserviceaccount) || R.isNil(podnumberofcontainer))),
        appversion = require('../package.json').version;

    fs.readFile(path.join(__dirname, '../views/index.html'), (err, data) => {
        if (err) {
            response.status(500).send(err);
        }

        response.set('Content-Type', 'text/html');
        response.status(200).send(handlebars.compile(data.toString())({
            hostname,
            lip,
            ipv,
            networkInterfaces,
            puplicip,
            pid,
            workerId,
            numberofcpus,
            nodename,
            podname,
            podnamespace,
            podip,
            podserviceaccount,
            podnumberofcontainer,
            hasmore,
            appversion
        }));
    });
};

module.exports = {
    rootAction
};
