const cluster = require('cluster'),
    express = require('express'),
    os = require('os'),
    path = require('path'),
    R = require('ramda'),
    router = require('./router.js'),
    port = 3000;

if (cluster.isMaster) {
    const numCPUs = R.length(os.cpus());
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
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
        console.log(`Worker ${process.pid} started ↴`);
        console.log(`Server listening on port ${app.get('port')}! Press Ctrl-C to terminate.`);
    });
}
