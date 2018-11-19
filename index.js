const cluster = require('cluster'),
    dotenv = require('dotenv'),
    express = require('express'),
    morgan = require('morgan'),
    os = require('os'),
    path = require('path'),
    R = require('ramda'),
    router = require('./router.js'),
    helper = require('./helpers/middleware/xpoweredby.middleware.js');

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running...`);

    os.cpus().forEach((...elements) => {
        const [, index,] = elements;

        cluster.fork({
            workerId: R.inc(index)
        });
    });

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker with id: ${worker.process.pid} and code: ${code} and signal: ${signal} died!`);
    });
} else if(cluster.isWorker) {
    const app = express(),
        processenvironment = R.prop('env', process),
        url = (address, port) => {
            app.set('address', address);
            app.set('port', port.replace(/\D/g, ''));
        };

    dotenv.config();

    app.use(helper.xpoweredby);

    if(process.argv.length === 4) {
        url(process.argv[2], process.argv[3]);
    } else {
        url(processenvironment.ADDRESS, processenvironment.PORT);
    }

    app.use(morgan('combined', {
        immediate: true
    }));

    app.use(express.static(path.join(__dirname, 'public'), {
        dotfiles: 'ignore',
        etag: false,
        extensions: ['js', 'css'],
        index: R.F(),
        maxAge: '1d',
        redirect: false,
        setHeaders: (res, path/*, stat*/) => {
            // console.log(path);
            res.set('X-Timestamp', Date.now());
        }
    }));

    router(app);

    app.listen(app.get('port'), app.get('address') || null, () => {
        console.log(`Worker ${processenvironment.workerId} with pid: ${process.pid} started ↴`);
        console.log(`Server listening on host ${app.get('address')} and port ${app.get('port')}! Press Ctrl-C to terminate.`);
    });
} else {
    throw `Cluster-Error: ${process.pid}`;
}
