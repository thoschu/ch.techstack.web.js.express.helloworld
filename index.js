const express = require('express'),
    path = require('path'),
    R = require('ramda'),
    router = require('./router.js'),
    app = express(),
    port = 80;

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
    console.log(`Server listening on port ${app.get('port')}! Press Ctrl-C to terminate.`);
});
