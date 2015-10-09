var LF = require('../src');
var chai = require('chai');
var fs = require('fs');
var expect = chai.expect;
var cr = new RegExp('\r\n', 'g');
var lf = new RegExp('\n', 'g');
fs.writeFileSync('test.txt', '');
describe('conversion tests', function () {
    it('will replace all line endings with CRLF', function () {
        LF.convertSync('tsconfig.json', { target: 'test.txt', ending: LF.ending.crlf });
        expect(test('test.txt', cr)).to.be.true;
    });
    it('will replace all line endings with LF', function () {
        LF.convertSync('tsconfig.json', { target: 'test.txt', ending: LF.ending.lf });
        expect(test('test.txt', cr)).to.be.false;
        expect(test('test.txt', lf)).to.be.true;
    });
});
describe('async tests', function () {
    it('will convert line endings to CRLF with callbacks', function (done) {
        var cb = function (error) {
            expect(error).to.not.exist;
            expect(test('test.txt', cr)).to.be.true;
            done();
        };
        LF.convert('tsconfig.json', { target: 'test.txt', ending: LF.ending.crlf }, cb);
    });
    it('will convert line endings to LF with callbacks', function (done) {
        var cb = function (error) {
            expect(error).to.not.exist;
            expect(test('test.txt', cr)).to.be.false;
            expect(test('test.txt', lf)).to.be.true;
            done();
        };
        LF.convert('tsconfig.json', { target: 'test.txt', ending: LF.ending.lf }, cb);
    });
});
describe('stream tests', function () {
    it('will convert line endings to CRLF with streams', function (done) {
        var stream = LF.stream('tsconfig.json', { ending: LF.ending.crlf });
        var buffer = '';
        stream.on('end', function () {
            expect(cr.test(buffer)).to.be.true;
            done();
        });
        stream.on('data', function (data) {
            buffer += data;
        });
    });
    it('will convert line endings to LF with streams', function (done) {
        var stream = LF.stream('tsconfig.json', { ending: LF.ending.lf });
        var buffer = '';
        stream.on('end', function () {
            expect(cr.test(buffer)).to.be.false;
            expect(lf.test(buffer)).to.be.true;
            done();
        });
        stream.on('data', function (data) {
            buffer += data;
        });
    });
});
function test(file, regex) {
    var context = fs.readFileSync(file).toString();
    return regex.test(context);
}
