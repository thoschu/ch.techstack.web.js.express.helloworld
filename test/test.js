const assert = require('assert'),
    chai = require('chai'),
    cheerio = require('cheerio'),
    http = require('http'),
    R = require('ramda'),
    Server = require('../models/server.model'),
    expect = chai.expect,
    timeout = 7000,
    one = 1,
    two = 2,
    three = 3,
    four = 4;

chai.use(require('chai-match'));

describe('Testtest', () => {
    describe('#indexOf()', () => {
        it('should return -1 when the value is not present', () => {
            assert.equal([one, two, three].indexOf(four), R.negate(one));
        });
    });
});

describe('Startpage', () => {
    let statuscode,
        headers,
        parsed = "";

    before(done => {
        setTimeout(() => {
            http.get({
                host: 'localhost',
                port: 3003,
                path: '/'
            }, response => {
                let body = '';

                statuscode = response.statusCode;
                headers = response.headers;

                response.on('data', chunk => {
                    body += chunk;
                });

                response.on('end', () => {
                    parsed = String(body);
                    done();
                });
            });
        }, timeout);
    });

    describe('Statuscode', () => {
        it('should be 200', () => {
            const ok = 200;
            expect(statuscode).to.equal(ok);
        });
    });

    describe('Headers', () => {
        it('x-powered-by should be express.js', () => {
            expect(R.prop('x-powered-by', headers)).to.equal('express.js');
        });

        it('content-type', () => {
            expect(R.prop('content-type', headers)).to.equal('text/html; charset=utf-8');
        });
    });

    describe('Markup', () => {
        it('Title should be Hello world...', () => {
            const $ = cheerio.load(parsed);
            expect($('title').text()).to.equal('Hello world...');
        });

        it('Title should be Hello world...', () => {
            const $ = cheerio.load(parsed);
            let code = $('code').text(),
                n = code.search("address");
            expect(n).to.be.gte(R.negate(one));
        });
    });
});

describe('Server', () => {
    let server;

    before(done => {
        server = new Server();
        done();
    });

    describe('static#getpublicip()', () => {
        it('should return a ip v4 or v6 address', () => {
            const expression = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/;
            new Promise((resolve, reject) => {
                Server.getpublicip().then(result => resolve(result)).catch(err => reject(err));
            }).then(result => {
                expect(result).to.match(expression).and.capture(0);
            }).catch(err => {
                console.error(err);
            });
        });
    });

    describe('#arch()', () => {
        it('should return a string identifying the operating system CPU architecture for which the Node.js binary was compiled', () => {
            const archs = ['arm', 'arm64', 'ia32', 'mips', 'mipsel', 'ppc', 'ppc64', 's390', 's390x', 'x32', 'x64'];
            expect(archs).to.include(server.arch);
        });
    });
});


