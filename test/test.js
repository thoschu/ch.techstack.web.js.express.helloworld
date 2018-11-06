const assert = require('assert'),
    chai = require('chai'),
    cheerio = require('cheerio'),
    http = require('http'),
    R = require('ramda'),
    exitprocess = require('../helpers/tests/exitprocess'),
    expect = chai.expect,
    timeout = 7000,
    one = 1,
    two = 2,
    three = 3,
    four = 4;

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
                port: 3000,
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
        it('should be 200', (done) => {
            const ok = 200;

            try {
                expect(statuscode).to.equal(ok);
                done();
            } catch (e) {
                exitprocess(e);
            }
        });
    });

    describe('Headers', () => {
        it('x-powered-by should be express.js', (done) => {
            try {
                expect(R.prop('x-powered-by', headers)).to.equal('express.jss');
                done();
            } catch (e) {
                exitprocess(e);
            }
        });

        it('content-type', (done) => {
            try {
                expect(R.prop('content-type', headers)).to.equal('text/html; charset=utf-8');
                done();
            } catch (e) {
                exitprocess(e);
            }
        });
    });

    describe('Markup', () => {
        it('Title should be Hello world...', (done) => {
            try {
                const $ = cheerio.load(parsed);
                expect($('title').text()).to.equal('Hello world...');
                done();
            } catch (e) {
                exitprocess(e);
            }
        });

        it('Title should be Hello world...', (done) => {
            try {
                const $ = cheerio.load(parsed);
                let code = $('code').text(),
                    n = code.search("address");
                expect(n).to.be.gte(R.negate(one));
                done();
            } catch (e) {
                exitprocess(e);
            }
        });
    });
});
