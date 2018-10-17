const cluster = require('cluster'),
    express = require('express'),
    os = require('os'),
    path = require('path'),
    R = require('ramda'),
    router = require('./router.js'),
    port = 3000;

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
    const app = express();

    app.set('port', process.env.PORT || port);
    app.use(express.static(path.join(__dirname, 'public'), {
        dotfiles: 'ignore',
        etag: R.F(),
        extensions: ['js', 'css'],
        index: R.F(),
        maxAge: '1d',
        redirect: R.F(),
        setHeaders: (res, path, stat) => {
            res.set('x-timestamp', Date.now())
        }
    }));

    router(app);

    app.listen(app.get('port'), () => {
        console.log(`Worker ${process.env.workerId} with pid: ${process.pid} started ↴`);
        console.log(`Server listening on port ${app.get('port')}! Press Ctrl-C to terminate.`);
    });
} else {
    throw "CustomClusterError";
}
